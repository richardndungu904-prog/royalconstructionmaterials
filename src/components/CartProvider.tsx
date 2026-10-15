import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Product } from '@/data/products'

export type CartItem = { id: string; productId: number; variantId: string; color: string; quantity: number; name: string; image: string; price: number | null; unit: string; label: string }
type CartAction = { action: 'add' | 'update' | 'remove' | 'clear'; productId?: number; variantId?: string; color?: string; quantity?: number; id?: string }
type CartContextValue = { items: CartItem[]; busy: boolean; loading: boolean; error: string; open: boolean; setOpen: (open: boolean) => void; add: (product: Product, variantId?: string, color?: string, quantity?: number) => Promise<boolean>; mutate: (action: CartAction) => Promise<boolean>; reload: () => Promise<void>; toast: string }
const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState('')
  async function reload() {
    setLoading(true)
    try {
      const response = await fetch('/api/cart', { credentials: 'same-origin' })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      setItems(result.items)
      setError('')
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Unable to load your basket. Please retry.') }
    finally { setLoading(false) }
  }
  useEffect(() => { void reload() }, [])
  useEffect(() => { if (toast) { const timer = setTimeout(() => setToast(''), 3500); return () => clearTimeout(timer) } }, [toast])
  async function mutate(action: CartAction) {
    if (busy || loading) return false
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/cart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(action) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      setItems(result.items)
      return true
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Unable to update your basket. Please retry.'); setOpen(true); return false }
    finally { setBusy(false) }
  }
  async function add(product: Product, variantId = product.variants[0].id, color = product.colors?.[0].name || '', quantity = 1) {
    const success = await mutate({ action: 'add', productId: product.id, variantId, color, quantity })
    if (success) { setToast(`${product.name} added to your basket`); setOpen(true) }
    return success
  }
  return <CartContext.Provider value={{ items, busy, loading, error, open, setOpen, add, mutate, reload, toast }}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('CartProvider is required')
  return context
}
