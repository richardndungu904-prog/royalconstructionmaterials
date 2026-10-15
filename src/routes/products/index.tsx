import { createFileRoute } from '@tanstack/react-router'
import { Catalogue } from '@/components/Catalogue'
import { PageHeading } from '@/components/SiteLayout'

export const Route = createFileRoute('/products/')({ validateSearch: (search: Record<string, unknown>) => ({ search: typeof search.search === 'string' ? search.search : '' }), component: Shop })

function Shop() {
  const { search } = Route.useSearch()
  return <><PageHeading eyebrow="THE ROYAL MATERIALS COLLECTION" title="Materials that mean business" description="Find roofing, finishing touches and building essentials. Build your basket, then get a personalised quotation from our team." /><Catalogue initialSearch={search} /></>
}
