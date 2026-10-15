# Royalconstructionmaterials

A mobile-responsive construction-materials storefront for Royal Construction Materials in Nakuru Pipeline, Kenya. The site uses the supplied company logo, factory photographs, product images, contact information and price guides. Its charcoal-and-gold visual identity highlights the materials and the people behind them.

## Features

- Searchable product catalogue with category, grade and price filters and sorting.
- Product pages with photo galleries, enlarged image views, sheet-length variants, colour selection and quantity estimates.
- Anonymous, persistent materials baskets backed by Netlify Database.
- WhatsApp order handoff with selected materials, quantities and estimated pricing.
- A quotation form that saves customer details and a server-priced basket snapshot, then offers a prepared WhatsApp message for the customer to send to sales.
- Price-guide page, downloadable CSV, original reference images, company story, contact information and location map.
- Visible phone and WhatsApp contact actions on every page. No customer login, admin login or online payment flow.

## Technologies

TanStack Start, TanStack Router, React 19, TypeScript, Vite, Tailwind CSS 4, custom responsive CSS, Lucide icons, Zod, Netlify Image CDN and Netlify Database with Drizzle ORM.

## Run locally

Use Node.js 22 or newer and pnpm. This project needs a linked Netlify project for its database-backed features.

```bash
pnpm install
netlify dev --port 8889
```

Open the local URL printed by Netlify CLI. Netlify Dev runs the application and emulates the platform features together. `pnpm dev` runs the frontend directly, but does not provide the same Netlify platform environment.

Netlify deploys the application using the build command in `netlify.toml`. Database schema definitions live in `db/schema.ts`; deploy-time migrations live in `netlify/database/migrations/`. The managed database is provisioned through the Netlify Database adapter, without hard-coded connection credentials. The initial production database branch becomes available with deployment.

When changing the schema, inspect migration status first, then generate a named migration:

```bash
netlify db status
pnpm exec drizzle-kit generate --name describe_schema_change
```

Use the beta versions of Drizzle configured in this project because the Netlify adapter is on that release line. Do not edit applied migrations.

## Content and ordering

The editorial catalogue is defined in `src/data/products.ts`; sales contact details are in `src/lib/contact.ts`. Static product content is not customer application state. Customer baskets and saved quotation requests are stored only in the managed database.

Roofing prices are drawn from the supplied per-metre guides. The Dumuzas G30 product preserves the specific sheet-length promotional prices, including the KSh 850 price for a 2.5-metre sheet. A separate KSh 378 box-profile promotion has an unclear unit and is shown as a reference requiring sales confirmation, rather than applied as an assumed discount. No price was invented for nails, wire, tanks or paving blocks; those products are quoted by sales.

All displayed prices are indicative. Gauge, finish, stock, final price, delivery costs and timing must be confirmed with the sales agent. Economy/reject products explicitly identify their grade. The location map identifies the Nakuru Pipeline area, not a verified storefront pin; visitors are asked to call for the exact collection point and opening hours.

Saving a quotation does not automatically send WhatsApp or place an order. Customers must click the WhatsApp continuation and send their prepared message. No payment processor or login system is included, in accordance with the supplied instructions.

The uploaded reference assets were deduplicated and copied to `public/img/`. Original instruction and contact documents are retained in `public/resources/`. Rendered imagery is resized through Netlify Image CDN. Original price-guide links deliberately open the source images for legibility.

## Validation

No local build, development server or test commands were run during implementation. The deployment pipeline performs installation and build validation. The database migration was generated with Drizzle Kit; live database status was unavailable because the fresh project had not yet published a production database branch.
