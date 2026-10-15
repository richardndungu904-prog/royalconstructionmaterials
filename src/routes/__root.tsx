import { HeadContent, Link, Scripts, createRootRoute } from '@tanstack/react-router'
import '../styles.css'
import { SiteLayout } from '@/components/SiteLayout'

const siteName = 'Royalconstructionmaterials | Build with confidence'
const siteDescription = 'Shop roofing sheets, building essentials, binding wire and water tanks in Nakuru. Build your materials basket and request a personalised quotation from Royal Construction Materials on WhatsApp.'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: siteName,
      },
      {
        name: 'description',
        content: siteDescription,
      },
      {
        property: 'og:title',
        content: siteName,
      },
      {
        property: 'og:description',
        content: siteDescription,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: () => <div className="container empty-results missing-page"><h1>Let’s get your build back on track.</h1><p>This page isn’t here, but your next project starts with the right materials.</p><Link to="/products" search={{ search: '' }} className="button button-gold">Explore our materials</Link></div>,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <SiteLayout>{children}</SiteLayout>
        <Scripts />
      </body>
    </html>
  )
}
