# HEXSHOES

## AI-Powered Footwear Discovery Platform

A React commerce platform built around a live Firestore catalog and genuine CLIP visual search. The cinematic homepage follows the approved footwear campaign reference. Shop discovery, product details, wishlist, cart, demo checkout and a product-aware scripted assistant share the same real catalog.

## Presentation imagery and visual polish

Temporary presentation imagery is used until official HEXSHOES product photography
is available. Four coordinated generated studio samples are isolated in
`frontend/src/data/sampleProductImages.ts`, each marked `isSampleImage: true`.
They apply only while rendering; real catalog photos take precedence. API product
images and browser cart records remain untouched. Samples establish no product
ownership, variants or CLIP assignments. See the [asset provenance and prompts](frontend/public/presentation/README.md).

The hero uses a local, compressed Pexels sample running clip with a static
campaign poster. Its source, license, encoding and presentation-only status are
documented in [hero media provenance](frontend/public/media/hero/README.md).
Mobile and reduced-motion viewers receive the static hero; desktop playback has
an accessible pause control and stops offscreen. Watch Film offers explicit native
playback controls. No background-video autoplay is required to use the site.

Shared CSS motion tokens, the existing IntersectionObserver reveal system and
a small media-query hook provide consistent reveals, route entrances, modal
transitions and restrained card interactions. No animation library was added.
The editorial Intelligence Layer distinguishes live retrieval from future research;
the assistant remains catalog-based. Shipping/returns claims and LKR prices are
not advertised without verified policies or currency data.

Phase 5 comparison screenshots are under `frontend/verification/phase5/`.

## Problem and solution

A shoe photograph can communicate style more naturally than a text query, but
visual similarity alone cannot establish a product's identity. HEXSHOES combines
a real Firestore storefront with image-to-image CLIP retrieval, exposing the
boundary between ranked references and verified purchasable catalog facts.

It is an internship portfolio application: real integration and deliberate
engineering, with honest demo checkout and research features clearly marked.

## Project structure

```text
catalog/                     Canonical draft manifest and catalog workflow
frontend/src/pages/          Routed retail and portfolio pages
frontend/src/components/     Home, layout, products, AI and shared controls
frontend/src/context/        Products, cart, wishlist and Firebase Auth
frontend/src/services/       API, visual search and deterministic assistant adapters
frontend/tests/              Real-service browser tests and isolated fixture tests
backend/src/                 Express, Firestore contract and registry validation
backend/scripts/             Catalog validation and read-only Firestore preview
backend/tests/               Registry and catalog contract tests
ai-service/                  FastAPI, existing CLIP assets and Python tests
```

## Architecture

- **Frontend:** React, TypeScript, Vite, React Router, HTML/CSS. Layout/home/product/AI/shared components, routed pages, state providers and service boundaries.
- **Backend:** Node.js, Express, TypeScript and Firebase Admin SDK. Read-only product API with Firestore document IDs, a safe product contract, structured errors and origin allowlisting.
- **Database:** Firebase Firestore. Missing product photos, sizes, colors, gender, stock and release metadata stay missing; UI fallbacks do not invent them.
- **Authentication:** Firebase client SDK, sign-up/sign-in/sign-out UI and AuthContext. Disabled until public Firebase web-app configuration is supplied. No Admin credentials enter the browser.
- **AI service:** Python, FastAPI, PyTorch, OpenCLIP ViT-B-32 with existing OpenAI pretrained weights, normalized image embeddings and cosine similarity. Existing embeddings are preserved.

```text
Firestore -> Firebase Admin -> Express product API -> React catalog
Shoe image -> FastAPI validation -> OpenCLIP preprocessing -> CLIP encoder
           -> normalized vector -> cosine similarity -> ranked catalog matches
```

## Implemented

Home, Shop, Men, Women, New Drops, Product, Visual Search, Wishlist, Cart, Demo Checkout, Account, About, Technology, Contact and 404 routes. Search overlay, URL-based filters, keyboard-accessible Quick View, responsive filter drawer, browser-persistent wishlist/cart, cart quantities/subtotals, real CLIP upload/results and local scripted product assistance.

Cart/wishlist persistence is browser-local, not account-synchronized. Shipping is explicitly pending. Checkout stores no order or address and takes no payment. Newsletter and contact validate locally and never claim delivery or persistence. The assistant uses deterministic product-name/description/color/budget matching, lists current styles, compares recorded prices/descriptions and explains visual search. It is not LLM-powered.

## Planned intelligence

- AI Stylist: in development; later LLM and catalog tools.
- Recommendations: in development; real preference and interaction data required.
- Demand forecasting: research; sales history and temporal evaluation required.
- Fit intelligence: planned; verified dimensions and fit feedback required.
- Customer segmentation: research; appropriate consent and real behavior data required.
- Retrieval evaluation: labeled held-out queries and authoritative image/product relationships required.

No fake metrics, accuracy, demand growth, customer records or payment processing are supplied. "In development" describes the integration direction; it does not mean a trained or deployed model exists.

## Local setup (PowerShell)

Node/npm and Python are required. Use the project's existing Python virtual environment when available. No Firebase credential values belong in source control.

### Frontend

```powershell
cd E:\hexshoes\frontend
npm ci
Copy-Item .env.example .env
npm run dev
```

The default Vite URL is `http://localhost:5173/`. Set `VITE_API_URL` and `VITE_AI_API_URL` in the ignored `.env` if services run elsewhere. Vite embeds public configuration during builds. Local fallbacks apply to development/local previews; remote deployments require explicit API origins or a same-origin reverse proxy.

### Backend

```powershell
cd E:\hexshoes\backend
npm ci
Copy-Item .env.example .env
npm run dev
```

Keep the existing ignored `backend/serviceAccountKey.json` locally. `PORT` defaults to 4000. `CORS_ORIGINS` is a comma-separated allowlist; add the actual frontend origin if you change the Vite port. The Admin SDK initialization remains server-only.

### AI service

```powershell
cd E:\hexshoes\ai-service
.\venv\Scripts\python.exe -B -m uvicorn api:app --host 127.0.0.1 --port 8000
```

For a fresh Python environment, install the documented requirements with `python -m pip install -r requirements.txt`. Existing cached model weights are used. A fresh setup may need the pretrained-weight download; do not rebuild embeddings simply to run the service.

Optional AI configuration is documented in `ai-service/.env.example`. Export `CORS_ORIGINS` into the process environment; the AI service does not silently load dotenv. Paths resolve relative to `api.py`.

### Environment keys

Frontend: `VITE_API_URL`, `VITE_AI_API_URL`, `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`.

Firebase Auth requires a registered web app, public configuration, enabled Email/Password sign-in and authorized domains. Without the required values, the UI says **UI implemented / Firebase Auth configuration pending** and disables submission. Public Firebase web configuration is distinct from private Admin service-account credentials. Restrict the web key and configure appropriate Firebase rules before live use.

Backend: `PORT`, `CORS_ORIGINS`. AI: `CORS_ORIGINS`.

## Product contract

`GET /api/products` returns canonical Firestore document IDs plus `code`, `name`, `description`, `price`, `currency`, `category`, `gender`, `image`, `images`, `aiImageFilename`, `availableSizes`, `colors`, `stock`, `isNew`, `featured`, `createdAt`.

Missing scalar fields are null and missing lists are empty. Compatibility is explicit: legacy `desc` maps to `description`; legacy `$128.00` price strings are parsed as numeric USD. Missing numeric-price currency is not inferred. No category, gender, photo or stock is guessed from a name. Filter controls are disabled when the real catalog supplies no corresponding options. Men/Women/category filters can legitimately produce empty states until metadata is verified. New Drops shows explicit new flags or unflagged releases dated within the last 30 days; explicitly false flags are respected. Without new/release metadata it identifies the displayed list as the current collection.

## Visual-search mapping

The ten catalog images contain only filename/embedding metadata; no reliable relationship to the four Firestore documents exists. `ai-service/product_mapping.json` is the shared canonical registry: `products` inventories the four observed Firestore IDs, actual codes/names and optional verified store images; `catalogImages` explicitly lists all ten filenames. Every current image has `productId: null`, `verified: false`, and `evidence: null`.

To activate a mapping, independently confirm the image belongs to the real Firestore product, record the confirmation reference in `evidence`, set that image's `productId` and `verified: true`, and restart **both backend and AI service**. Do not use visual resemblance, product names, or filename numbering as confirmation. Unknown filenames/IDs, duplicate assignments, missing image entries, and verified assignments without evidence are rejected. One primary CLIP image per product is currently supported. The backend also rejects verified IDs absent from the live Firestore snapshot and conflicting code/image metadata. Registry edits never write Firestore.

The backend overlays only verified registry images/AI filenames on its existing product contract; unverified AI filenames remain null. The frontend requires agreement between the AI result's product ID and the fetched product's AI filename before showing its name, price, image and **View Product** action. Otherwise it shows a **Catalog reference / Product mapping pending** without a product link. Existing Firestore photos remain available independently of CLIP mapping; a verified CLIP image is the result-image fallback when a store image is missing.

`POST /search` uses multipart field `file`. Accepts JPG/JPEG/PNG filenames, JPEG/PNG MIME types and safely decoded JPEG/PNG content up to 10 MB. Returns ranked `productId` (null if unmapped), `filename`, `score`, and metric `cosine_similarity`. `GET /health` reports model/catalog readiness and mapped/unmapped counts. `GET /catalog/{filename}` serves the real catalog artwork. Scores measure vector alignment, not confidence probability. Uploaded images are processed in memory and are not saved by the endpoint.

## Verification

```powershell
cd E:\hexshoes\frontend
npm run lint
npm run typecheck
npm run build
npm run test:e2e
cd E:\hexshoes\backend
npx tsc --noEmit --pretty false
```

Browser tests require all three real services and an installed Chrome. The Windows default executable path is in `playwright.config.ts`; set `CHROME_PATH` for other installations. Tests use isolated browser contexts and sample checkout/contact inputs; they do not mock AI or modify Firestore. They cover genuine uploads, server-side validation, persistence, filters, routing, modal focus and 1440/1024/768/390 px layouts. Test artifacts are ignored; reviewed screenshots live in `frontend/verification/`.

## Screenshots

See `frontend/verification/platform-home-1440.png`, `platform-home-390.png`, `platform-ai-1440.png`, and `platform-ai-390.png`. Existing editorial campaign artwork is generated marketing imagery; provenance is preserved in `frontend/public/editorial/ASSET-PROMPTS.md`. It is not presented as verified photography of the four store products.

## Security and portfolio boundaries

For production credential handling, compiled backend startup, AI hosting and
Vercel SPA routing, see [deployment preparation](DEPLOYMENT.md).

The credential file, all real `.env` variants, node_modules and Python environments are ignored. Never push secrets. Product API responses whitelist catalog fields and sanitize errors. Origin allowlists, MIME/size/decoder validation and bounded AI inference protect local integration. No payment card fields exist. Checkout is deliberately demo-only, with no order persistence or gateway. Legal policies, film, social destinations and mail delivery remain pending rather than fabricated.

The Firebase dependency uses a targeted patched gRPC override. Compatible security patches were applied to frontend and backend dependencies; rerun audits before deployment. A public launch additionally needs production origins/HTTPS, auth configuration, authorized API access where appropriate, rate limiting and operational monitoring.

## Catalog enrichment without writes

`catalog/products.json` preserves the four real IDs, names, descriptions and
prices. It is a draft, not a replacement for live Firestore data. Approved product
photography folders exist under `frontend/public/products/<ID>/` and remain empty.
See [catalog workflow](catalog/README.md) for image naming, approval and mapping.

```powershell
cd E:\hexshoes\backend
node --import tsx scripts/validateCatalog.ts
node --import tsx scripts/validateCatalog.ts --require-images
node --import tsx scripts/previewCatalog.ts
```

The first command accepts explicit unresolved values with warnings. Strict image
readiness currently fails as expected. The preview shows raw existing fields,
exact proposed merges and unresolved data; it contains no Firestore write mode.
No seed script is run as part of setup or verification.

## Portfolio demonstration

1. Open Shop and sort the four real products by price.
2. Search a product, inspect Quick View, save it and add it to the demo cart.
3. Refresh to verify browser-local persistence; review checkout using sample values.
4. Upload `ai-service/test_query.jpg` for genuine ranked CLIP references.
5. Open the product helper and compare Hex Runner with Hex Mono.
6. Visit Technology for the actual architecture, model explanation and limitations.

## Test boundaries

Browser checks use real Firestore and CLIP services. Isolated synthetic fixtures
exercise mapped-result navigation and size/color resets because those real facts
are missing; they never enter Firestore or the production registry. Tests include
all fifteen routes at 1440, 1366, 1024, 768 and 390 px, plus populated mobile/desktop
cart, wishlist and checkout, keyboard search, modal inertness, labels and upload
rejections. This is a basic accessibility review, not a formal WCAG certification.

```powershell
cd E:\hexshoes\backend
node --import tsx --test tests/catalogValidation.test.ts tests/productImageRegistry.test.ts
cd E:\hexshoes\ai-service
.\venv\Scripts\python.exe -B -m unittest discover -v
```

Campaign WebP variants and responsive image sources avoid serving original PNGs
in the interface. Original generated campaign sources are retained for provenance;
AI reference images and embeddings remain unchanged. Fonts use display swap with
system fallbacks. Secondary routes and below-fold imagery load lazily.

## Current limitations

- Product photos, most category/gender/variant/stock/release fields and all ten
  product-to-CLIP assignments await authoritative evidence.
- Firebase client configuration and Email/Password activation are pending.
- Cart/wishlist are browser-local; totals are demo estimates, not server quotes.
- Orders, payments, shipping/tax calculations, mail delivery and subscriptions
  are not connected. Campaign film and verified social/legal information are pending.
- OpenCLIP reports a QuickGELU compatibility warning for the existing configuration.
  Preserve this baseline until retrieval evaluation can justify a model/vector change.
- No measured retrieval accuracy, trained recommender or research model is claimed.
- Services are local; production HTTPS, origins, access controls, rate limits and
  monitoring require a separate deployment pass.

## Next AI/ML work

Establish verified canonical catalog mappings and build a labeled visual-retrieval evaluation set. Measure recall@k and ranking quality on held-out shoe queries before adding recommendation/LLM tooling or claiming accuracy.

## Implementation references

[React Router declarative routing](https://reactrouter.com/start/declarative/routing), [Firebase Authentication setup](https://firebase.google.com/docs/auth/web/start), [FastAPI file uploads](https://fastapi.tiangolo.com/tutorial/request-files/).
