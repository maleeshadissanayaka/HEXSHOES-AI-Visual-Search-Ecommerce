# HEXSHOES approved homepage implementation

The supplied **Hexshoes_ Built for the Grid.png** drives section order, composition, spacing, proportions and hierarchy. `reference/hexshoes-preview-v3.html` drives the Archivo / Space Grotesk / JetBrains Mono typography, reveals, hover effects, wishlist pop and modal animation. The reference is interpreted as the homepage sequence continuing from the left panel into the right panel, rendered as one scrolling responsive page.

## What matches the approved direction

- Compact black announcement strip and translucent sticky navigation, with Men, Women, New Drops, Find My Shoe, About and Contact.
- Cinematic urban hero with the shoe on the right, three-line **BUILT / FOR THE / GRID.** headline, outline GRID, blue dot, blue Shop New Drops button and Watch Film control.
- Exactly four benefits with line icons and the requested copy.
- Light horizontal HEX meaning strip, large blue H/E/X, black labels, fine dividers and an architectural texture at the right.
- Three landscape category cards: Runners, Trail & Boot and Slides, with bottom overlays, subtitles, circular arrows and restrained hover movement.
- Compact bordered New Drops cards with real API names, tags and prices; four records rendered, with synchronized wishlist, cart counter and Quick View.
- Dark visual-search section with the requested heading, Embed/Compare/Rank steps, dashed upload area and actual returned result thumbnails/scores.
- Cinematic sunset Our Story section, requested copy, CTA and HOVER/ELEGANCE/XPERIENCE brand words.
- Compact dark newsletter with a blue Subscribe button and campaign background.
- Compact footer with Shop, Support, Company, social controls, legal links and a quiet floating HEX Assistant button.

## Verification

| Check | Result |
| --- | --- |
| Frontend ESLint | Pass |
| Production build | Pass |
| TypeScript `tsc -b` | Pass |
| Real Firestore product endpoint | HTTP 200, four records |
| New Drops at 1440 × 900 | Four names exactly match the live response |
| New Drops at 390 × 900 | Four names exactly match the live response |
| Horizontal overflow | None: document widths equal 1440 and 390 |
| JavaScript exceptions | None at either viewport |
| Images and fonts | All homepage images load; all three font families load |
| Wishlist and cart | Card/modal state stays synchronized; two additions increment count to 2 |
| Quick View | Opens, selects UK 9, supports wishlist/add, closes with Escape |
| Film and sizing dialogs | Open and close; modal focus is contained and restored |
| Mobile navigation | Opens, navigates and closes |
| Real FastAPI/CLIP upload | HTTP 200 from `POST http://127.0.0.1:8000/search`, multipart field `file` |
| Actual search output | Five real matches; uploading `shoe1.jpg` returns `shoe1.jpg` first with score 1.0 |
| Reduced motion | Revealed content has opacity 1 and no transform |

Browser verification uses live services throughout: **no intercepted/mock responses**. Detailed results are in [approved-results.json](verification/approved-results.json); the reproducible browser check is [approved-design.mjs](verification/approved-design.mjs).

Screenshots were visually reviewed against the approved reference:

- [Desktop, initial state](verification/approved-desktop-1440.png)
- [Mobile, initial state](verification/approved-desktop-390.png)
- [Desktop, actual AI results](verification/approved-live-1440.png)
- [Mobile, actual AI results](verification/approved-live-390.png)
- [Desktop AI detail](verification/approved-ai-1440.png)
- [Mobile AI detail](verification/approved-ai-390.png)

## Remaining visual differences

- The supplied screenshot is a composite reference rather than an exact 1440px page capture; section widths and heights scale through the centered 1360px content system.
- The hero, category and story backgrounds are newly generated campaign assets matching the reference composition, rather than identical extracted artwork. They are marketing illustrations, not photographs of verified physical HEXSHOES inventory. The imagegen built-in tool was used; prompts and asset paths are recorded in [ASSET-PROMPTS.md](public/editorial/ASSET-PROMPTS.md).
- Firestore has four products, not the five pictured in the reference. Existing Firestore names, codes and prices are retained.
- Current Firestore records have no image field. Existing per-product stock photographs remain as fallbacks and differ in backgrounds, colors and shoe styles from the reference. An API-provided product image still takes precedence. Actual catalog photography is needed to close this gap.
- The newsletter reuses the urban campaign photograph rather than the reference's isolated shoe composition.
- The small architectural accent uses the campaign's concrete texture. It is not the exact facade in the reference.
- On mobile, benefit items use two columns, categories stack, products use two columns, search stacks and footer columns use a structured two-column layout.
- The optional story video control and currency selector are omitted. Hero photography is static; Watch Film opens the existing stock video with native play/pause controls.
- AI thumbnails appear only after a real upload. The idle state deliberately has no sample/fake matches; the service returns five thumbnails rather than the reference's three.

## Remaining functional differences

- Newsletter validates email and shows an explicit coming-soon message; no subscription API exists.
- Category, Men/Women and View All links navigate the existing collection sections; they do not add filtering or new routes.
- Social controls show a coming-soon information dialog because official profile URLs were not supplied.
- Legal controls show current development-status information; full commerce policies are not published yet.
- AI results retain the existing filename/score catalog contract. There is no API mapping from a match filename to a Firestore product ID, so thumbnails are not automatically product-detail links.
- Wishlist and bag remain existing in-memory frontend state. No authentication, persistence or checkout was added.
- HEX Assistant remains a button with a coming-soon notice; no conversation agent or LLM was added.

## Files changed in this implementation

All paths below are relative to `frontend/`. Pre-existing uncommitted work was preserved.

**Application and styles**

- `src/App.tsx`
- `src/App.css`
- `src/index.css`

**Updated components and component styles**

- `src/components/Ticker.tsx`, `src/components/Ticker.css`
- `src/components/Navbar.tsx`, `src/components/Navbar.css`
- `src/components/Hero.tsx`, `src/components/Hero.css`
- `src/components/HeroVideo.tsx`, `src/components/HeroVideo.css`
- `src/components/HomepageSections.tsx`, `src/components/HomepageSections.css`
- `src/components/ProductRail.tsx`, `src/components/ProductRail.css`
- `src/components/ProductCard.tsx`
- `src/components/AiSearch.tsx`, `src/components/AiSearch.css`
- `src/components/OurStory.tsx`, `src/components/OurStory.css`
- `src/components/Newsletter.tsx`, `src/components/Newsletter.css`
- `src/components/Footer.tsx`, `src/components/Footer.css`
- `src/components/HexAssistant.tsx`, `src/components/HexAssistant.css`
- `src/components/QuickViewModal.tsx`, `src/components/QuickViewModal.css`
- `src/components/InfoModal.tsx`, `src/components/InfoModal.css`

**New reusable code**

- `src/components/Icon.tsx`: shared line icons matching the reference.
- `src/hooks/useModal.ts`: keyboard focus containment/restoration, Escape and scroll locking.

Quick View now renders through a React portal so section-reveal transforms cannot trap its fixed overlay behind other sections.

**Assets, documentation and verification**

- `public/editorial/hero-grid.png`
- `public/editorial/trail.png`
- `public/editorial/slides.png`
- `public/editorial/story.png`
- `public/editorial/ASSET-PROMPTS.md`
- `HOMEPAGE-REDESIGN.md`
- `verification/approved-design.mjs`
- `verification/approved-results.json`
- `verification/approved-desktop-1440.png`
- `verification/approved-desktop-390.png`
- `verification/approved-live-1440.png`
- `verification/approved-live-390.png`
- `verification/approved-ai-1440.png`
- `verification/approved-ai-390.png`

## Architecture preserved

Backend files, Firebase initialization, credential files, Firestore data and AI-service files are unchanged. Product fetching remains `GET http://localhost:4000/api/products`. Visual search remains the real multipart FastAPI request and CLIP inference. No dependencies, route framework, authentication or checkout were added. The existing project/component structure remains in place.
