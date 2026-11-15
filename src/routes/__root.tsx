import { HeadContent, Link, Scripts, createRootRoute } from '@tanstack/react-router'
import '../styles.css'
import { SiteLayout } from '@/components/SiteLayout'
import { companyName, email, facebook, phone, siteUrl, whatsappNumber } from '@/lib/contact'

const siteName = 'Royal Construction Materials | Roofing Sheets & Building Materials in Nakuru'
const siteDescription = 'Shop roofing sheets, building essentials, binding wire and water tanks in Nakuru. Build your materials basket and request a personalised quotation from Royal Construction Materials on WhatsApp.'
const structuredData = { '@context': 'https://schema.org', '@type': 'HardwareStore', name: companyName, url: siteUrl, logo: `${siteUrl}/img/material-152.jpg`, image: `${siteUrl}/img/material-151.jpg`, description: siteDescription, telephone: phone, email, address: { '@type': 'PostalAddress', streetAddress: 'Nakuru Pipeline', postOfficeBoxNumber: '05644', addressLocality: 'Nakuru', postalCode: '20100', addressCountry: 'KE' }, contactPoint: [{ '@type': 'ContactPoint', telephone: phone, contactType: 'sales' }, { '@type': 'ContactPoint', telephone: whatsappNumber, contactType: 'customer service', description: 'WhatsApp' }], sameAs: [facebook] }

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
        name: 'robots',
        content: 'index, follow',
      },
      {
        property: 'og:site_name',
        content: companyName,
      },
      {
        property: 'og:url',
        content: siteUrl,
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
    links: [{ rel: 'icon', href: '/img/material-152.jpg', type: 'image/jpeg' }, { rel: 'apple-touch-icon', href: '/img/material-152.jpg' }],
    scripts: [{ type: 'application/ld+json', children: JSON.stringify(structuredData) }],
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
