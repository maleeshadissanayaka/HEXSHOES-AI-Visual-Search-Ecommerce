# Canonical catalog draft

`products.json` is the proposed catalog, not an import or an approved live update.
It preserves the four canonical Firestore IDs and the names/descriptions/prices
confirmed through the read-only Express product API during this phase. USD is
preserved from its existing explicit dollar-price compatibility contract.
Legacy seed tags do not prove product code, color, category, gender, or image
ownership, so these facts remain unresolved. Null means unverified; empty arrays
contain no verified entries. False must not be substituted for an unknown flag.

The manifest is not wired into the storefront. The site still reads Firestore
and preserves its existing photography placeholders and honest empty variants
and collections. Optional gallery images are not required to launch a product.

From `E:\hexshoes\backend`:

```powershell
node --import tsx scripts/validateCatalog.ts
node --import tsx scripts/validateCatalog.ts --require-images
node --import tsx scripts/previewCatalog.ts
```

Validation reports errors without rewriting or normalizing any data. Default
draft validation accepts explicitly missing photos and warns about unresolved
facts. `--require-images` checks launch readiness; gallery images or an AI mapping
also require a primary image. Product image URLs must refer to existing files in
the corresponding approved public folder, with the product ID in the filename.
The validator checks registry evidence/agreement, duplicate assignments, and
coverage across registry entries, embedding filenames, and actual AI image files.
Unmapped catalog references are reported as unresolved, not silently discarded.

The Firestore preview uses the existing server-only Admin configuration and only
reads `products`. It compares raw Firestore fields, so legacy `$128.00` and the
proposed numeric `128` appear as a real storage-format change. It prints each
exact proposed document payload, existing field presence/value, changed fields,
unresolved fields, and extra existing fields that a hypothetical merge preserves.
Explicit nulls/empty arrays are proposed values, not omitted fields. No writer,
write switch, seeding, order, auth, or embedding operation is included. Run the
preview again after edits; approval and any later write implementation are separate.

## Future approved-image flow (not executed)

1. Obtain approval that a supplied photograph depicts a specific canonical ID.
2. Add that primary image and optional gallery images under
   `frontend/public/products/<ID>/`; update manifest URLs only with approved facts.
3. Assign an AI catalog filename to the approved source image and record its
   confirmation reference in the shared `ai-service/product_mapping.json` registry.
4. After explicit authorization, prepare matching normalized embeddings from
   those approved images. Filename coverage validation must pass before activation.
5. Keep the manifest, image file, embedding filename and verified registry ID in
   agreement; preview the proposed Firestore values for approval.
6. After separately approved updates, restart backend/AI and verify genuine
   upload → FastAPI → CLIP → ranked canonical product ID → `/product/:id`.

Current `shoe1.jpg`–`shoe10.jpg` remain unmapped. Filename numbering, vague visual
similarity and legacy product tags are not mapping evidence. No embeddings have
been rebuilt for this phase.
