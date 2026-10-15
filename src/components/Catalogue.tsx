import { Link } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Check, ChevronDown, Grid2X2, Plus, Search, SlidersHorizontal, X } from 'lucide-react'
import products, { categories, imageUrl, money } from '@/data/products'
import type { Product } from '@/data/products'
import { useCart } from './CartProvider'

export function ProductCard({ product }: { product: Product }) {
  const cart = useCart()
  return <article className="product-card"><Link className="product-picture" to="/products/$productId" params={{ productId: String(product.id) }}><img src={imageUrl(product.image, 560)} alt={product.name} loading="lazy" />{product.badge && <span className={`product-badge ${product.grade === 'Economy' ? 'economy' : ''}`}>{product.badge}</span>}<span className="view-product">Explore material <ArrowRight size={15} /></span></Link><div className="product-card-body"><div className="product-category">{product.category}</div><Link to="/products/$productId" params={{ productId: String(product.id) }} className="product-name">{product.name}</Link><p>{product.grade === 'Economy' ? 'Reject grade · confirm condition' : product.price === null ? 'Tailored pricing for your project' : 'Multiple lengths & finishes'}</p><div className="product-card-bottom"><div>{product.price === null ? <strong className="quote-price">Request price</strong> : <><strong>{money(product.price)}</strong><span> / {product.unit}</span></>}</div><button disabled={cart.busy || cart.loading} className="add-button" aria-label={`Add ${product.name} to basket`} onClick={() => void cart.add(product)}><Plus size={20} /></button></div></div></article>
}

export function Catalogue({ initialSearch = '', home = false, activeCategory = 'All materials', onCategoryChange }: { initialSearch?: string; home?: boolean; activeCategory?: string; onCategoryChange?: (category: string) => void }) {
  const [query, setQuery] = useState(initialSearch)
  const [category, setCategory] = useState(activeCategory)
  const [sort, setSort] = useState('featured')
  const [price, setPrice] = useState('all')
  const [grade, setGrade] = useState('all')
  const [filters, setFilters] = useState(false)
  const [limit, setLimit] = useState(home ? 8 : 100)
  useEffect(() => { setQuery(initialSearch) }, [initialSearch])
  useEffect(() => { setCategory(activeCategory) }, [activeCategory])
  const filtered = useMemo(() => {
    const list = products.filter(product => (category === 'All materials' || product.category === category) && `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(query.toLowerCase().trim()) && (grade === 'all' || product.grade === grade) && (price === 'all' || (price === 'quote' ? product.price === null : product.price !== null && product.price <= Number(price))))
    if (sort === 'low') list.sort((first, second) => (first.price ?? Infinity) - (second.price ?? Infinity))
    if (sort === 'high') list.sort((first, second) => (second.price ?? -1) - (first.price ?? -1))
    if (sort === 'name') list.sort((first, second) => first.name.localeCompare(second.name))
    return list
  }, [category, query, sort, price, grade])
  function selectCategory(value: string) { setCategory(value); onCategoryChange?.(value); setLimit(100) }
  function reset() { setQuery(''); selectCategory('All materials'); setPrice('all'); setGrade('all') }
  return <section className="catalogue container" id="materials"><div className="section-heading"><div><span className="eyebrow">THE RIGHT MATERIALS. THE RIGHT START.</span><h2>{home ? 'Built for your next project' : 'Find your building essentials'}<span>.</span></h2></div>{home && <Link to="/products" search={{ search: '' }} className="section-link">View all materials <ArrowRight size={17} /></Link>}</div><div className="catalogue-toolbar"><label className="catalogue-search"><Search size={19} /><input value={query} onChange={event => { setQuery(event.target.value); setLimit(100) }} placeholder="What are you building with?" aria-label="Search materials" />{query && <button aria-label="Clear search" onClick={() => setQuery('')}><X size={16} /></button>}</label><button className={`filter-toggle ${filters ? 'selected' : ''}`} onClick={() => setFilters(!filters)} aria-expanded={filters}><SlidersHorizontal size={17} /> Filters{(price !== 'all' || grade !== 'all') && <span className="filter-indicator" />}</button><label className="sort-select"><span>Sort by:</span><select value={sort} onChange={event => setSort(event.target.value)} aria-label="Sort products"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="name">Name: A–Z</option></select><ChevronDown size={14} /></label></div><div className="category-chips">{categories.map(item => <button key={item} aria-pressed={category === item} onClick={() => selectCategory(item)} className={category === item ? 'chip active' : 'chip'}>{item === 'All materials' && <Grid2X2 size={13} />}{item}{category === item && item !== 'All materials' && <Check size={13} />}</button>)}</div>
    {filters && <div className="filter-panel"><label>Price per listed unit<select value={price} onChange={event => setPrice(event.target.value)}><option value="all">All prices</option><option value="200">Up to KSh 200</option><option value="400">Up to KSh 400</option><option value="600">Up to KSh 600</option><option value="quote">Quotation only</option></select></label><label>Material grade<select value={grade} onChange={event => setGrade(event.target.value)}><option value="all">All grades</option><option value="Standard">Standard</option><option value="Economy">Economy / reject</option><option value="Quote only">Quote only</option></select></label><button className="text-button" onClick={reset}>Reset all filters <X size={13} /></button></div>}
    <div className="results-count" aria-live="polite"><span>Showing {Math.min(limit, filtered.length)} of {filtered.length} materials{category !== 'All materials' ? ` in ${category.toLowerCase()}` : ''}</span><span><span className="gold-dot" /> Prices in Kenyan Shillings</span></div>{filtered.length ? <><div className="product-grid">{filtered.slice(0, limit).map(product => <ProductCard key={product.id} product={product} />)}</div>{filtered.length > limit && <button className="button button-outline load-more" onClick={() => setLimit(100)}>Explore all {filtered.length} materials <ArrowRight size={17} /></button>}</> : <div className="empty-results"><Search size={38} strokeWidth={1} /><h3>No materials match just yet.</h3><p>Try a different search or clear your filters to browse the full range.</p><button className="button button-gold" onClick={reset}>Clear filters <ArrowRight size={17} /></button></div>}
    <p className="catalogue-note">Listed prices are estimates from our supplied price guides. Confirm current pricing, specifications and delivery with our sales team.</p></section>
}
