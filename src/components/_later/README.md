# Parked screens (not routed)

These screens were built with sample data but belong to modules that are not
live yet. They are kept here so they can be reused when each module launches.
Nothing imports them today except `pricing-table.tsx` (only rendered when
`SHOW_PRICING` is `true` in `src/lib/site-config.ts`).

| File | Was at | Module |
| --- | --- | --- |
| `sales-page.tsx` | `/dashboard/sales` | Sales |
| `support-page.tsx` | `/dashboard/support` | Support |
| `live-page.tsx` | `/dashboard/live` | Sojao Live |
| `analytics-page.tsx` | `/dashboard/analytics` | Analytics |
| `billing-page.tsx` | `/dashboard/billing` | Billing (plans, invoices, usage) |
| `pricing-table.tsx` | `/pricing` (plan comparison table) | Pricing |
| `testimonials.tsx` | landing + FAQ | Waiting for real customer quotes |
- `hero-scene.tsx` — animated mascot scene removed from the landing hero
