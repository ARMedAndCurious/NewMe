# NEWME — independent design concept

A responsive fashion storefront and case study exploring a desktop-first shopping experience.

**Independent and unofficial:** this portfolio concept is not affiliated with, endorsed by, or the official website of NEWME. Product names, prices and inventory are fictional; stock photographs do not depict NEWME merchandise or imply model endorsement.

## Features

- Responsive homepage and campaign carousel, with controls and reduced-motion support.
- Category discovery, product listings, search, filters and sorting.
- Product details, size selection, wishlist and bag persisted in the browser.
- An independent design case study and responsive desktop concept capture.

## Tech stack

React, React Router, Vite, CSS and Tailwind CSS; Lucide icons; Vitest, Testing Library and Playwright for tests.

## Local setup

Use Node.js 20.19+ or 22.12+ (as required by Vite), and npm:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. `npm run build` produces `dist/`; `npm run preview` serves the build locally. Vercel uses `vercel.json` to route client-side URLs to the app. No environment variables are required.

## Testing

```sh
npm run lint
npm test
npm run build
```

For the optional Playwright browser check, start the dev server on port 5173 and run `node scripts/browser-check.mjs`. It defaults to Chrome's standard Windows path; set `CHROME_PATH` for another Chrome installation.

## Architecture highlights

- `src/main.jsx` defines React Router routes and shared UI; `src/data.js` holds the fictional catalogue.
- Client-side state uses localStorage; there is no server-side customer data or commerce backend.
- `public/images/` contains local imagery, with provenance in [`public/images/ATTRIBUTION.md`](public/images/ATTRIBUTION.md).
- The original-site screenshot is excluded from Git and production builds; the case study uses a placeholder pending rights review.

## Limitations and rights

There is no real checkout, payment, inventory or order fulfillment, and browser data is local to the device. The case study describes design choices, not measured outcomes. Stock-photo licenses, model/property permissions, NEWME name and branding, and the suitability of public redistribution must be reviewed for the intended use before deployment. See the attribution inventory for sources and restrictions. Original NEWME captures are not cleared for publication.

## Live demo

Not yet deployed — link to be added.
