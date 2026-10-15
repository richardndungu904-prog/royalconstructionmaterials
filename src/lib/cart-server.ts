import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { cartItems } from '../../db/schema.js'
import { resolveSelection } from '../data/products.js'

export function session(request: Request) {
  const cookie = request.headers.get('cookie')?.match(/(?:^|;\s*)royal_cart=([a-f0-9-]{36})(?:;|$)/)?.[1]
  const id = cookie || randomUUID()
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : ''
  return { id, headers: { 'Set-Cookie': `royal_cart=${id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${secure}`, 'Cache-Control': 'no-store' } }
}

export function safeOrigin(request: Request) {
  const origin = request.headers.get('origin')
  return !origin || origin === new URL(request.url).origin
}

export async function readCart(cartId: string) {
  const rows = await db.select().from(cartItems).where(eq(cartItems.cartId, cartId))
  return rows.map(row => {
    const { product, variant } = resolveSelection(row.productId, row.variantId, row.color)
    return { id: row.id, productId: row.productId, variantId: row.variantId, color: row.color, quantity: row.quantity, name: product.name, image: product.colors?.find(color => color.name === row.color)?.image || product.image, price: variant.price, unit: variant.unit, label: variant.label }
  })
}
