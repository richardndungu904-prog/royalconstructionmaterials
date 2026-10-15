import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight, CheckCheck, ClipboardList, MessageCircle, Phone, ShieldCheck } from 'lucide-react'
import { PageHeading, basketMessage } from '@/components/SiteLayout'
import { useCart } from '@/components/CartProvider'
import { imageUrl, money } from '@/data/products'
import { phone, phoneLink, whatsapp } from '@/lib/contact'

export const Route = createFileRoute('/quotation')({ component: Quotation })

function Quotation() {
  const cart = useCart()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ reference: string; url: string } | null>(null)
  const total = cart.items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true); setError('')
    const form = new FormData(event.currentTarget)
    const details = Object.fromEntries(form.entries())
    try {
      const response = await fetch('/api/quotation', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(details) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      const message = `${basketMessage(cart.items)}\n\nQuotation reference: ${data.reference}\nName: ${details.name}\nPhone: ${details.phone}\nEmail: ${details.email || 'Not provided'}\nDelivery location: ${details.location}\nProject notes / order list: ${details.notes || 'None'}`
      setResult({ reference: data.reference, url: whatsapp(message) })
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Unable to save your request. Please try again.') }
    finally { setBusy(false) }
  }
  return <><PageHeading eyebrow="LET’S PUT YOUR PROJECT TOGETHER" title="Your build. Your quotation" description="Share your materials list and delivery details. We’ll help you confirm the right specifications and prices—no online payment required." /><div className="container quotation-layout"><section className="quotation-form-card">{result ? <div className="quotation-success" role="status"><span className="success-icon"><CheckCheck size={34} /></span><span className="eyebrow">YOUR REQUEST IS SAVED</span><h2>One more step.<br />Let’s talk to sales<span>.</span></h2><p>Your reference is <strong>{result.reference}</strong>. Continue on WhatsApp and send the prepared message to our team to discuss and confirm your quotation.</p><a className="button button-green" href={result.url} target="_blank" rel="noreferrer"><MessageCircle size={20} /> Continue on WhatsApp <ArrowRight size={17} /></a><p className="form-disclaimer">Saving this request does not place an order or make a payment. You still need to send the WhatsApp message to sales.</p><Link to="/products" search={{ search: '' }} className="section-link">Continue browsing <ArrowRight size={16} /></Link></div> : <form onSubmit={submit}><div className="form-heading"><ClipboardList size={23} /><div><h2>A few details, a better quote.</h2><p>All fields marked * are required.</p></div></div><div className="form-grid"><label>Full name *<input name="name" autoComplete="name" required minLength={2} maxLength={120} placeholder="Your full name" /></label><label>Phone / WhatsApp number *<input name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={25} placeholder="e.g. +254 712 345678" /></label><label className="full-width">Email address <span>(optional)</span><input name="email" type="email" autoComplete="email" maxLength={200} placeholder="Your email address" /></label><label className="full-width">Project / delivery location *<input name="location" autoComplete="street-address" required minLength={2} maxLength={200} placeholder="Town, estate or site location" /></label><label className="full-width">Project notes & additional materials<textarea name="notes" rows={5} maxLength={5000} required={!cart.items.length} placeholder="Tell us what you’re building. Include your order list, preferred gauge, colours, tank capacity or delivery requirements." /></label><label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>{error && <div className="error-message" role="alert">{error}<a href={whatsapp(basketMessage(cart.items))} target="_blank" rel="noreferrer">Contact sales directly on WhatsApp</a></div>}<p className="form-disclaimer"><ShieldCheck size={17} /> Your details are only used to help prepare and discuss your materials quotation.</p><button className="button button-gold" type="submit" disabled={busy || cart.loading}>{busy ? 'Saving your request…' : 'Save request & continue to WhatsApp'}<ArrowRight size={18} /></button></form>}</section><aside className="quotation-sidebar"><span className="eyebrow">YOUR PROJECT, AT A GLANCE</span><h2>Materials summary<span>.</span></h2>{cart.error && <div className="error-message" role="alert">{cart.error}<button className="text-button" onClick={() => void cart.reload()}>Retry loading basket</button><p>You can also enter your full materials list in the project notes.</p></div>}{cart.loading ? <div className="skeleton" /> : cart.items.length ? <><div className="quote-items">{cart.items.map(item => <div key={item.id}><img src={imageUrl(item.image, 140)} alt={item.name} /><div><strong>{item.name}</strong><small>{item.quantity} × {item.label}{item.color ? ` · ${item.color}` : ''}</small><span>{item.price === null ? 'To be quoted' : money(item.price * item.quantity)}</span></div></div>)}</div><div className="quote-total"><span>Estimated subtotal</span><strong>{cart.items.some(item => item.price !== null) ? money(total) : 'To be quoted'}</strong></div><small className="muted">Delivery and quote-only materials are excluded. Sales confirms your final total.</small><button className="text-button" onClick={() => cart.setOpen(true)}>Edit materials basket <ArrowRight size={15} /></button></> : <div className="quote-empty"><ClipboardList size={30} /><p>No basket? No problem. Type your materials list into the project notes, or browse the catalogue to add products.</p><Link className="section-link" to="/products" search={{ search: '' }}>Find my materials <ArrowRight size={16} /></Link></div>}<div className="quote-help"><Phone size={21} /><h3>Prefer a conversation?</h3><p>Talk through your project with our sales team.</p><a href={phoneLink}>{phone}</a></div></aside></div></>
}
