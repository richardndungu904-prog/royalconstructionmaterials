import { pgTable, text, integer, timestamp, jsonb, uniqueIndex } from 'drizzle-orm/pg-core'

export const cartItems = pgTable('cart_items', {
  id: text('id').primaryKey(),
  cartId: text('cart_id').notNull(),
  productId: integer('product_id').notNull(),
  variantId: text('variant_id').notNull(),
  color: text('color').notNull().default(''),
  quantity: integer('quantity').notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, table => [uniqueIndex('cart_selection').on(table.cartId, table.productId, table.variantId, table.color)])

export const quotations = pgTable('quotations', {
  id: text('id').primaryKey(),
  cartId: text('cart_id').notNull(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  location: text('location').notNull(),
  notes: text('notes').notNull(),
  items: jsonb('items').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
