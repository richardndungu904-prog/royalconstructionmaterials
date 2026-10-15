import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const input = z.object({ action: z.enum(['add', 'update', 'remove', 'clear']), productId: z.number().int().positive().optional(), variantId: z.string().max(30).optional(), color: z.string().max(40).default(''), quantity: z.number().int().min(1).max(1000).optional(), id: z.string().uuid().optional() })

export const Route = createFileRoute('/api/cart')({
  server: { handlers: {
    GET: async ({ request }) => {
      const { session, readCart } = await import('@/lib/cart-server')
      const current = session(request)
      try { return Response.json({ items: await readCart(current.id) }, { headers: current.headers }) }
      catch { return Response.json({ error: 'Your basket is temporarily unavailable. Please retry or contact sales.' }, { status: 503, headers: current.headers }) }
    },
    POST: async ({ request }) => {
      const { session, readCart, safeOrigin } = await import('@/lib/cart-server')
      if (!safeOrigin(request)) return Response.json({ error: 'Request not allowed.' }, { status: 403 })
      if (Number(request.headers.get('content-length') || 0) > 10000) return Response.json({ error: 'Request too large.' }, { status: 413 })
      const data = input.safeParse(await request.json().catch(() => null))
      if (!data.success) return Response.json({ error: 'Please check your product selection.' }, { status: 400 })
      const current = session(request)
      try {
        const { db } = await import('../../db/index.js')
        const { cartItems } = await import('../../db/schema.js')
        const { and, eq, sql } = await import('drizzle-orm')
        const { resolveSelection } = await import('@/data/products')
        const body = data.data
        if (body.action === 'add') {
          if (!body.productId || !body.variantId || !body.quantity) return Response.json({ error: 'Select a product, variant and quantity.' }, { status: 400 })
          resolveSelection(body.productId, body.variantId, body.color)
          await db.insert(cartItems).values({ id: crypto.randomUUID(), cartId: current.id, productId: body.productId, variantId: body.variantId, color: body.color, quantity: body.quantity }).onConflictDoUpdate({ target: [cartItems.cartId, cartItems.productId, cartItems.variantId, cartItems.color], set: { quantity: sql`least(${cartItems.quantity} + ${body.quantity}, 1000)`, updatedAt: new Date() } })
        } else if (body.action === 'clear') {
          await db.delete(cartItems).where(eq(cartItems.cartId, current.id))
        } else {
          if (!body.id) return Response.json({ error: 'Select a basket item.' }, { status: 400 })
          const selection = and(eq(cartItems.cartId, current.id), eq(cartItems.id, body.id))
          if (body.action === 'remove') await db.delete(cartItems).where(selection)
          else {
            if (!body.quantity) return Response.json({ error: 'Enter a valid quantity.' }, { status: 400 })
            await db.update(cartItems).set({ quantity: body.quantity, updatedAt: new Date() }).where(selection)
          }
        }
        return Response.json({ items: await readCart(current.id) }, { headers: current.headers })
      } catch { return Response.json({ error: 'We could not update your basket. Please retry or contact sales.' }, { status: 503, headers: current.headers }) }
    },
  } },
})
