import { Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import type { ReactNode, FormEvent } from 'react'
import { ArrowRight, Check, ChevronRight, Crown, Facebook, Mail, MapPin, Menu, MessageCircle, Minus, Phone, Plus, Search, ShoppingBag, Trash2, X } from 'lucide-react'
import { imageUrl, money, photo } from '@/data/products'
import { email, facebook, mapsLink, phone, phoneLink, whatsapp } from '@/lib/contact'
import { CartProvider, useCart } from './CartProvider'

export function SiteLayout({ children }: { children: ReactNode }) {
  return <CartProvider><Header /><main id="main-content">{children}</main><Footer /><FloatingContact /><CartDrawer /><Toast /></CartProvider>
}

function Brand() {
  return <Link to="/" className="brand" aria-label="Royalconstructionmaterials home"><img src={imageUrl(photo(152), 100)} alt="Royal Construction Materials crown logo" /><span><strong>ROYAL<span className="brand-dot">.</span></strong><small>CONSTRUCTION MATERIALS</small></span></Link>
}

function Header() {
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const cart = useCart()
  function submit(event: FormEvent) { event.preventDefault(); setSearch(false); setMenu(false); void navigate({ to: '/products', search: { search: query } }) }
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div className="topbar"><div className="container"><a href={mapsLink} target="_blank" rel="noreferrer"><MapPin size={13} /> Nakuru Pipeline, Kenya</a><span className="topbar-center">Quality materials. Honest prices. Royal service.</span><a href={phoneLink}><Phone size={13} /> Let’s talk: <strong>{phone}</strong></a></div></div>
    <header className="site-header"><div className="container header-inner"><Brand /><nav className={menu ? 'navigation expanded' : 'navigation'} aria-label="Main navigation">
      <Link to="/" onClick={() => setMenu(false)} activeProps={{ className: 'active' }} activeOptions={{ exact: true }}>Home</Link>
      <Link to="/products" search={{ search: '' }} onClick={() => setMenu(false)} activeProps={{ className: 'active' }}>Shop materials</Link>
      <Link to="/price-list" onClick={() => setMenu(false)} activeProps={{ className: 'active' }}>Price list</Link>
      <Link to="/about" onClick={() => setMenu(false)} activeProps={{ className: 'active' }}>About us</Link>
      <Link to="/contact" onClick={() => setMenu(false)} activeProps={{ className: 'active' }}>Contact & location</Link>
    </nav><div className="header-actions"><button className="icon-button search-button" aria-label="Search materials" aria-expanded={search} onClick={() => setSearch(!search)}>{search ? <X size={20} /> : <Search size={20} />}</button><button className="cart-button" onClick={() => cart.setOpen(true)} aria-label={`Open basket, ${cart.items.reduce((sum, item) => sum + item.quantity, 0)} items`}><ShoppingBag size={19} /><span className="cart-label">My basket</span><b>{cart.items.reduce((sum, item) => sum + item.quantity, 0)}</b></button><button className="icon-button menu-button" aria-label="Toggle navigation" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button></div></div>
      {search && <form className="header-search container" onSubmit={submit}><Search size={21} /><input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="Search roofing sheets, tanks, binding wire…" aria-label="Search products" /><button className="button button-gold" type="submit">Search <ArrowRight size={17} /></button></form>}
    </header>
  </>
}

export function Footer() {
  return <footer className="site-footer"><div className="container footer-grid"><div><Brand /><p>From your first sheet to your final finish.<br />Your building partner in Nakuru and beyond.</p><a href={facebook} target="_blank" rel="noreferrer" className="social-link" aria-label="Find Royal Construction Materials on Facebook"><Facebook size={17} /></a></div><div><h3>Build with Royal</h3><Link to="/products" search={{ search: '' }}>Shop all materials</Link><Link to="/price-list">Our price list</Link><Link to="/quotation">Request a quotation</Link><Link to="/about">Our story</Link></div><div><h3>Talk to a real person</h3><a href={phoneLink}><Phone size={15} /> {phone}</a><a href={whatsapp()} target="_blank" rel="noreferrer"><MessageCircle size={15} /> WhatsApp our sales team</a><a href={`mailto:${email}`} className="footer-email"><Mail size={15} /> {email}</a></div><div><h3>Find us</h3><p>Nakuru Pipeline, Kenya<br />P.O. Box 05644<br />Nakuru 20100</p><a href={mapsLink} target="_blank" rel="noreferrer">Get directions <ArrowRight size={15} /></a></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Royalconstructionmaterials. Built on quality.</span><span>No online payments. Every order is confirmed with our sales team.</span></div></footer>
}

function FloatingContact() {
  return <aside className="floating-contact" aria-label="Quick contact"><a href={phoneLink} aria-label="Call our sales team" className="floating-phone"><Phone size={19} /></a><a href={whatsapp()} target="_blank" rel="noreferrer" className="floating-whatsapp"><MessageCircle size={22} /><span>Let’s talk</span><span className="online-dot" /></a></aside>
}

function Toast() {
  const { toast } = useCart()
  const { open } = useCart()
  return toast && !open ? <div className="toast" role="status"><Check size={18} /> {toast}</div> : null
}

export function basketMessage(items: ReturnType<typeof useCart>['items']) {
  if (!items.length) return 'Hello Royal Construction Materials, please prepare a quotation for the project and materials listed below.'
  const total = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)
  return `Hello Royal Construction Materials, please quote for my order:\n\n${items.map(item => `${item.quantity} × ${item.name} — ${item.label}${item.color ? `, ${item.color}` : ''} — ${item.price === null ? 'price to confirm' : money(item.price * item.quantity)}`).join('\n')}\n\nEstimated priced subtotal: ${items.some(item => item.price !== null) ? money(total) : 'To be quoted'}${items.some(item => item.price === null) ? '\nAdditional items require pricing.' : ''}\nPlease confirm availability, specifications, final prices and delivery. No payment has been made.`
}

function CartDrawer() {
  const cart = useCart()
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => { const dialog = ref.current; if (!dialog) return; if (cart.open && !dialog.open) dialog.showModal(); else if (!cart.open && dialog.open) dialog.close() }, [cart.open])
  useEffect(() => { if (cart.open) { const previous = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = previous } } }, [cart.open])
  const total = cart.items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)
  return <dialog ref={ref} className="cart-drawer" aria-labelledby="basket-title" onCancel={() => cart.setOpen(false)} onClick={event => { if (event.target === event.currentTarget) cart.setOpen(false) }}><div className="drawer-inner"><div className="drawer-heading"><div><span className="eyebrow">LET’S BUILD YOUR ORDER</span><h2 id="basket-title">Your materials basket<span>.</span></h2></div><button className="icon-button" onClick={() => cart.setOpen(false)} aria-label="Close basket"><X /></button></div><div className="basket-notice"><MessageCircle size={18} /> No online payments. Get a quote from our sales team.</div>
    {cart.toast && <div className="basket-added" role="status"><Check size={15} /> Added to your materials basket</div>}
    {cart.error && <div className="error-message" role="alert">{cart.error}<button onClick={() => void cart.reload()} className="text-button">Retry loading basket</button><a href={whatsapp()} target="_blank" rel="noreferrer">Contact sales instead</a></div>}
    {cart.loading ? <div className="cart-loading"><div className="skeleton" /><div className="skeleton" /><p>Loading your saved basket…</p></div> : cart.items.length ? <><div className="cart-items">{cart.items.map(item => <article className="cart-item" key={item.id}><Link to="/products/$productId" params={{ productId: String(item.productId) }} onClick={() => cart.setOpen(false)}><img src={imageUrl(item.image, 180)} alt={item.name} /></Link><div className="cart-item-info"><h3>{item.name}</h3><p>{item.label}{item.color ? ` · ${item.color}` : ''}</p><strong>{item.price === null ? 'Price on request' : money(item.price * item.quantity)}</strong><div className="quantity small"><button aria-label={`Decrease ${item.name} quantity`} disabled={cart.busy || item.quantity === 1} onClick={() => void cart.mutate({ action: 'update', id: item.id, quantity: item.quantity - 1 })}><Minus size={13} /></button><span>{item.quantity}</span><button aria-label={`Increase ${item.name} quantity`} disabled={cart.busy || item.quantity === 1000} onClick={() => void cart.mutate({ action: 'update', id: item.id, quantity: item.quantity + 1 })}><Plus size={13} /></button></div></div><button className="icon-button remove-button" disabled={cart.busy} onClick={() => void cart.mutate({ action: 'remove', id: item.id })} aria-label={`Remove ${item.name}`}><Trash2 size={17} /></button></article>)}</div><div className="basket-summary"><div><span>Estimated subtotal</span><strong>{cart.items.some(item => item.price !== null) ? money(total) : 'To be quoted'}</strong></div><p>Final prices, stock and delivery are confirmed by sales.{cart.items.some(item => item.price === null) && ' Quote-only items are not included in this subtotal.'}</p><a href={whatsapp(basketMessage(cart.items))} className="button button-green" target="_blank" rel="noreferrer"><MessageCircle size={19} /> Send order on WhatsApp <ArrowRight size={17} /></a><Link to="/quotation" className="button button-outline" onClick={() => cart.setOpen(false)}>Request a detailed quotation <ChevronRight size={17} /></Link><button disabled={cart.busy} onClick={() => void cart.mutate({ action: 'clear' })} className="text-button">Clear basket</button></div></> : <div className="empty-basket"><ShoppingBag size={52} strokeWidth={1} /><h3>Good projects start here.</h3><p>Add your materials, review your estimate, and let our team take care of the rest.</p><Link to="/products" search={{ search: '' }} className="button button-gold" onClick={() => cart.setOpen(false)}>Explore materials <ArrowRight size={17} /></Link></div>}
  </div></dialog>
}

export function PageHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="page-heading"><div className="container"><div className="breadcrumb"><Link to="/">Home</Link><ChevronRight size={13} /><span>{title}</span></div><span className="eyebrow"><Crown size={14} /> {eyebrow}</span><h1>{title}<span>.</span></h1><p>{description}</p></div></div>
}
