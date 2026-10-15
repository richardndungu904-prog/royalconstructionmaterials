import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const input = z.object({ name: z.string().trim().min(2).max(120), phone: z.string().trim().regex(/^[+\d\s()-]{7,25}$/), email: z.union([z.literal(''), z.string().email().max(200)]), location: z.string().trim().min(2).max(200), notes: z.string().trim().max(5000), website: z.string().max(0) })

export const Route = createFileRoute('/api/quotation')({ server: { handlers: {
  POST: async ({ request }) => {
    const { session, readCart, safeOrigin } = await import('@/lib/cart-server')
    if (!safeOrigin(request)) return Response.json({ error: 'Request not allowed.' }, { status: 403 })
    if (Number(request.headers.get('content-length') || 0) > 15000) return Response.json({ error: 'Request too large.' }, { status: 413 })
    const body = input.safeParse(await request.json().catch(() => null))
    if (!body.success) return Response.json({ error: 'Please enter a valid name, phone number, location and email.' }, { status: 400 })
    const current = session(request)
    try {
      const { db } = await import('../../db/index.js')
      const { quotations } = await import('../../db/schema.js')
      const { and, eq, gte } = await import('drizzle-orm')
      const recent = await db.select({ id: quotations.id }).from(quotations).where(and(eq(quotations.cartId, current.id), gte(quotations.createdAt, new Date(Date.now() - 60000)))).limit(1)
      if (recent.length) return Response.json({ error: 'Please wait a minute before sending another request.' }, { status: 429 })
      const items = await readCart(current.id)
      if (!items.length && !body.data.notes) return Response.json({ error: 'Add materials to your basket or describe your order in the notes.' }, { status: 400 })
      const reference = `RCM-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
      await db.insert(quotations).values({ id: reference, cartId: current.id, name: body.data.name, phone: body.data.phone, email: body.data.email || null, location: body.data.location, notes: body.data.notes, items })
      return Response.json({ reference }, { status: 201, headers: current.headers })
    } catch { return Response.json({ error: 'Your quotation could not be saved. Retry, or send your details directly on WhatsApp.' }, { status: 503 }) }
  },
} } })
