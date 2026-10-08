# Temporary presentation imagery

Temporary presentation imagery is used until official HEXSHOES product
photography is available. These generated concepts are not official product
photographs, specifications, color variants, ownership evidence or AI mappings.

`src/data/sampleProductImages.ts` is the isolated frontend-only display registry:

| Real storefront ID | Display-only asset |
| --- | --- |
| HX-01A | products/runner.webp |
| HX-02F | products/trail.webp |
| HX-03C | products/slide.webp |
| HX-04E | products/mono.webp |

Each entry has `isSampleImage: true`. Real catalog images take precedence.
Samples are selected at rendering time by ProductImage, never copied into API
responses, product records, cart line images, Firestore or CLIP assignments.
AI references continue to use the real AI catalog. Sample alt text and the
product-gallery caption identify presentation imagery.

## Generation provenance

Generated with the built-in imagegen tool on 8 October 2026, one call per image.
The four original PNGs were inspected and compressed to 1000 px WebP, quality 88.
500 px variants, quality 86, support responsive cards and compact result images;
the product gallery requests the larger presentation image where appropriate.

Shared prompt:

> Use case: product-mockup. Create a premium photorealistic studio footwear
> presentation image for a sample footwear website. Subject: one [SUBJECT],
> generic unbranded concept, not an existing HEXSHOES product and not claimed as
> official. Full shoe visible at three-quarter side angle, pointing right,
> centered with generous breathing room. Square image, pale warm gray seamless
> studio backdrop and soft restrained contact shadow, subtle directional studio
> lighting. Sophisticated fashion editorial catalog photography, realistic
> materials, clean high-end detail. No text, no logos, no watermark, no extra
> objects or second shoe. This is temporary display-only sample imagery.

Subjects:

- runner: cream and charcoal low-profile performance running sneaker
- trail: dark charcoal technical trail boot with textured sole
- slide: minimal black single-strap slide sandal
- mono: monochrome off-white low-profile knit sneaker

No official product facts are inferred from these images. Approved photography
belongs in `public/products/<ID>/` and must follow the separate canonical catalog
approval workflow before product data or AI mappings are changed.
