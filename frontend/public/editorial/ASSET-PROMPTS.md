# Campaign asset provenance

Generated with the built-in imagegen tool using the imagegen skill. No CLI/API fallback was used. The hero used the user's approved screenshot as a composition reference. The UI itself is implemented in React/CSS; these files contain only campaign artwork. Outputs were copied into the project from the tool's generated-image directory. Original generated files were preserved.

These are marketing illustrations rather than verified photographs of physical products.

## `frontend/public/editorial/hero-grid.png`

Final prompt:

> Use case: photorealistic-natural. Asset type: responsive premium footwear homepage HERO BACKGROUND PHOTOGRAPH ONLY. Use the supplied approved website screenshot as composition reference ONLY: recreate its hero scene without any website UI. A low ground-level camera on wet dark city pavement, concrete brutalist architecture, golden side light from far right, a person's black jogger cuff and LARGE white performance running sneaker mid-stride with visible black tread, shoe occupies center-right (around 68% across), left 45 percent is dark empty pavement/building suitable for HTML text. Photoreal editorial campaign texture, cinematic charcoal/off-white palette, realistic shoe and anatomy, shallow depth of field. Wide landscape about 2.4:1 ratio. NO text, logos, words, typography, icons, buttons, interface, borders or watermarks anywhere. Do not render the whole website. Only the clean hero photograph.

## `frontend/public/editorial/trail.png`

Final prompt:

> Use case: photorealistic-natural. Website category background photograph only, wide landscape 2:1. A pair of black charcoal hiking boots with restrained amber stitching on wet slate rocks, low angle, dusk forest and mountain light, strong premium editorial product detail. Boots fill frame right and center, darker space at lower left for HTML title. No text, no logos, no UI, no typography, no watermarks. Match dark cinematic footwear art direction, realistic materials.

## `frontend/public/editorial/slides.png`

Final prompt:

> Use case: photorealistic-natural. Website category background photograph only, wide landscape 2:1. A pair of minimal sculpted black charcoal single-strap slide sandals resting on rough concrete pavement in a brutalist city setting. Low camera height, premium footwear editorial photo, golden side light, strong realistic material texture, restrained palette. Darker empty lower left for HTML title. No text, logos, UI, typography, watermarks.

## `frontend/public/editorial/story.png`

Final prompt:

> Use case: photorealistic-natural. Wide landscape 2.4:1 background for premium footwear brand Our Story section. A lone person in black jacket and trousers with black backpack standing on rugged rocky ridge overlooking a city in a mountain valley at golden sunset. Human standing around 70 percent across frame, entire silhouette and hiking shoes visible, cinematic warm horizon, detailed dark rocks in foreground, left 45 percent shadowed and uncluttered for HTML copy. Photoreal editorial lifestyle campaign. No text, logos, UI, typography or watermarks.

## Optimized delivery variants

The `.webp` and `-800.webp` derivatives were encoded locally from the existing PNG campaign artwork at 1600/800 px with WebP quality 86. They preserve the approved composition; no artwork was regenerated. PNG originals remain as provenance/reference material.
