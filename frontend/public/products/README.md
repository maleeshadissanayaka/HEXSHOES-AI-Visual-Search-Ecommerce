# Approved product photography

Each canonical product has its own folder: HX-01A, HX-02F, HX-03C, HX-04E.
These folders intentionally contain no photographs until images are approved.

- Use one primary image per product, for example `HX-01A-primary.webp`.
- Optional gallery images can use `HX-01A-gallery-01.webp`, etc.
- Every filename must include its canonical product ID.
- Add only approved images confirmed to depict that exact product. Generated
  campaign art, stock images and visually similar shoes are not product evidence.
- Set `image` in `catalog/products.json` to the primary public URL, for example
  `/products/HX-01A/HX-01A-primary.webp`; list optional public URLs in `images`.
- Create AI catalog mappings from these approved images, with recorded evidence
  and the canonical product ID. Do not infer that any existing shoe1–shoe10 image
  belongs to a store product.

`.gitkeep` preserves otherwise empty directories and is not an image.
