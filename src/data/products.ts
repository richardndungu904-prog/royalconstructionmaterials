export type Variant = { id: string; label: string; price: number | null; unit: string }
export type Product = {
  id: number
  name: string
  category: string
  image: string
  gallery: string[]
  description: string
  shortDescription: string
  price: number | null
  unit: string
  badge?: string
  grade: 'Standard' | 'Economy' | 'Quote only'
  variants: Variant[]
  colors?: { name: string; hex: string; image: string }[]
}

export const photo = (image: number) => `/img/material-${image}.jpg`
export const imageUrl = (image: string, width = 600) => `/.netlify/images?url=${encodeURIComponent(image)}&w=${width}&fm=webp&q=85`
export const money = (value: number) => `KSh ${value.toLocaleString('en-KE')}`
export const categories = ['All materials', 'Roofing sheets', 'Roofing accessories', 'Wire & steel', 'Water tanks', 'Building essentials']

function roofing(id: number, name: string, price: number, image: number, gallery: number[], description: string, badge?: string, grade: Product['grade'] = 'Standard'): Product {
  return { id, name, price, image: photo(image), gallery: gallery.map(photo), description, shortDescription: description, category: 'Roofing sheets', unit: 'metre', badge, grade,
    variants: [1, 2, 3].map(length => ({ id: `${length}m`, label: `${length}-metre sheet`, price: price * length, unit: 'sheet' })),
  }
}

const products: Product[] = [
  { ...roofing(1, 'Box Profile Roofing Sheets', 400, 120, [120, 105, 15, 16, 32, 34, 63, 111, 121], 'A clean-lined box profile for residential and commercial roofing. Choose your colour and sheet length; your sales agent confirms gauge, finish and the final specification.', 'BESTSELLER'), colors: [{ name: 'Charcoal', hex: '#414747', image: photo(120) }, { name: 'Ocean blue', hex: '#366994', image: photo(15) }, { name: 'Forest green', hex: '#2e6146', image: photo(32) }, { name: 'Tile red', hex: '#8b343a', image: photo(34) }] },
  { ...roofing(2, 'Versatile Tile Roofing Sheets', 650, 117, [117, 13, 12, 37, 38, 39, 40, 41, 42, 46, 71, 74, 84, 101, 112, 114], 'The character of traditional tiles with the practicality of metal roofing. A distinctive stepped profile for a refined roofline. Colour and gauge are confirmed at quotation.', 'PREMIUM FINISH'), colors: [{ name: 'Chocolate', hex: '#74564c', image: photo(117) }, { name: 'Charcoal', hex: '#414747', image: photo(38) }, { name: 'Forest green', hex: '#2e6146', image: photo(37) }, { name: 'Ocean blue', hex: '#366994', image: photo(40) }] },
  { ...roofing(3, 'Corrugated Iron Sheets', 300, 124, [124, 3, 11, 18, 19, 23, 25, 44, 49, 58, 61, 62, 70, 77, 85, 86, 91, 125, 128], 'A familiar corrugated profile for everyday construction projects. Available in different lengths. Discuss galvanised or coloured finishes with the team.', 'EVERYDAY ESSENTIAL'), colors: [{ name: 'Galvanised', hex: '#a6aaa8', image: photo(124) }, { name: 'Ocean blue', hex: '#366994', image: photo(85) }, { name: 'Charcoal', hex: '#414747', image: photo(86) }] },
  { ...roofing(4, 'Roman Tile Roofing Sheets', 650, 123, [123, 30, 31, 53, 65, 68, 73, 75, 76, 79, 80, 81, 87, 89, 93, 98, 100, 108, 110, 118, 119, 127], 'A rounded Roman tile profile that brings texture and architectural character to your home. Select a length and colour, then confirm the details with our sales team.'), colors: [{ name: 'Charcoal', hex: '#414747', image: photo(123) }, { name: 'Forest green', hex: '#2e6146', image: photo(31) }, { name: 'Chocolate', hex: '#74564c', image: photo(53) }, { name: 'Tile red', hex: '#8b343a', image: photo(80) }] },
  roofing(5, 'Ordinary Iron Sheets', 350, 54, [54, 0, 4, 6, 21, 22, 35, 51, 55, 56, 57, 59, 60, 82, 83, 88, 94, 95, 99, 105, 106, 107, 115, 129, 130, 131, 132, 134], 'Straightforward roofing sheets for practical building projects. Prices follow the supplied Royal price list. Confirm finish, gauge and length before ordering.', 'VALUE PICK'),
  roofing(6, 'Ordinary Reject Iron Sheets', 150, 125, [125, 19, 18, 23], 'Economy-grade reject sheets. These may have cosmetic or manufacturing imperfections. Ask your sales agent for current photos, condition and suitability before purchasing.', 'ECONOMY RANGE', 'Economy'),
  roofing(7, 'Box Profile Reject Sheets', 200, 111, [111, 16, 63, 121], 'A budget-conscious box profile option sold as reject grade. Condition varies by batch. Your sales agent confirms available stock and imperfections before purchase.', 'ECONOMY RANGE', 'Economy'),
  { id: 8, name: 'Colour-Matched Roofing Nails', category: 'Roofing accessories', image: photo(163), gallery: [photo(163), photo(161), photo(162), photo(29)], description: 'Complete your roof with colour-matched roofing nails. Ask our team to recommend the right size, finish and quantity for your selected roofing sheets.', shortDescription: 'The finishing touch for your roof.', price: null, unit: 'pack', grade: 'Quote only', variants: [{ id: 'standard', label: 'Confirm pack size with sales', price: null, unit: 'pack' }] },
  { id: 9, name: 'Construction Binding Wire', category: 'Wire & steel', image: photo(158), gallery: [photo(158), photo(159), photo(160)], description: 'Binding wire for tying reinforcement and general construction use. Send your required weight and project details for a tailored quotation.', shortDescription: 'For reinforcement and everyday site work.', price: null, unit: 'roll', grade: 'Quote only', variants: [{ id: 'standard', label: 'Confirm roll weight with sales', price: null, unit: 'roll' }] },
  { id: 10, name: 'Gentex Water Storage Tanks', category: 'Water tanks', image: photo(155), gallery: [photo(155), photo(153), photo(156), photo(157)], description: 'Water storage solutions for homes and construction sites. Tell the team your required capacity and delivery location to receive current sizes and pricing.', shortDescription: 'Water storage for home and site.', price: null, unit: 'tank', grade: 'Quote only', variants: [{ id: 'standard', label: 'Capacity to be confirmed', price: null, unit: 'tank' }] },
  { id: 11, name: 'Underground Water Tank', category: 'Water tanks', image: photo(154), gallery: [photo(154)], description: 'An underground water storage option for projects where space matters. Request capacity, installation requirements and pricing from your sales agent.', shortDescription: 'A space-conscious water storage option.', price: null, unit: 'tank', grade: 'Quote only', variants: [{ id: 'standard', label: 'Capacity to be confirmed', price: null, unit: 'tank' }] },
  { id: 12, name: 'Concrete Paving Blocks', category: 'Building essentials', image: photo(2), gallery: [photo(2)], description: 'Paving blocks for paths, compounds and outdoor spaces. Share your surface area and preferred layout so the sales team can prepare your materials quotation.', shortDescription: 'Build practical, finished outdoor spaces.', price: null, unit: 'order', grade: 'Quote only', variants: [{ id: 'standard', label: 'Specify area in quotation notes', price: null, unit: 'order' }] },
  { ...roofing(13, 'Dumuzas Corrugated Sheets · G30', 350, 85, [85, 124, 137], 'Gauge 30 corrugated sheets. The supplied promotion lists 1m at KSh 350, 2m at KSh 700, 2.5m at KSh 850 and 3m at KSh 1,050. Ask sales to confirm promotional availability and delivery terms.', 'G30 COLLECTION'), variants: [{ id: '1m', label: '1-metre sheet', price: 350, unit: 'sheet' }, { id: '2m', label: '2-metre sheet', price: 700, unit: 'sheet' }, { id: '2.5m', label: '2.5-metre sheet', price: 850, unit: 'sheet' }, { id: '3m', label: '3-metre sheet', price: 1050, unit: 'sheet' }] },
]

export function resolveSelection(productId: number, variantId: string, color: string) {
  const product = products.find(item => item.id === productId)
  const variant = product?.variants.find(item => item.id === variantId)
  if (!product || !variant || (color && !product.colors?.some(item => item.name === color))) throw new Error('Invalid product selection')
  return { product, variant }
}

export default products
