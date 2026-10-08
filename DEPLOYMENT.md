# HEXSHOES deployment preparation

Deploy the reviewed `feature/complete-platform` branch without merging `main`.
This configuration prepares the existing services; it does not provision hosting.

## Express / Firestore backend

Install from the backend directory with `npm ci`, including development dependencies
in the build stage. Run `npm run build`, then `npm start` (`node dist/index.js`).
Compiled imports retain their `.js` extensions under Node ESM. Set the platform's
Node runtime to one compatible with the locked dependencies (Node 22 or newer).

Required production configuration:

- `FIREBASE_SERVICE_ACCOUNT_JSON`: the **complete** Firebase Admin service-account
  JSON, held in the backend platform's secret store. Preserve JSON escaping such
  as `\n` in the private key. Do not add it to the repository or frontend variables.
- `CORS_ORIGINS`: comma-separated actual HTTPS frontend origins, including any
  explicitly approved preview origins. There is no invented production default.
- `PORT`: provided by the hosting platform; local default is 4000.

Nonempty environment credentials take priority. Invalid environment JSON fails
startup rather than silently using another account. Empty/unset credentials use
the ignored `backend/serviceAccountKey.json` locally. The fallback resolves from
the module location and works from both `src/` and `dist/`, regardless of cwd.
Missing/invalid credentials produce sanitized errors without secret contents.

**Deploy from the repository root**, using backend as the command working directory,
or package the same relative layout. The backend requires the sibling
`ai-service/product_mapping.json` and `ai-service/catalog_embeddings.json` for its
existing registry validation. A backend-only source export omitting those files
will fail. No Python runtime/model is needed by the Node service.

Do not run `seed.ts` during deployment. Builds and startup do not write Firestore.

## FastAPI / CLIP service

Install `ai-service/requirements.txt` in an isolated Python environment, then run:

```sh
cd ai-service
python start.py
```

The entrypoint runs Uvicorn with `0.0.0.0`, the platform's `PORT` (default 8000),
one worker and an absolute app directory. It can also be launched with an absolute
path to `start.py` from another cwd. Set `CORS_ORIGINS` to the actual HTTPS frontend
origins. It remains configurable through the process environment; the launcher
does not automatically load a local `.env` file.

Equivalent POSIX deployment command:

```sh
uvicorn api:app --host 0.0.0.0 --port "${PORT:-8000}" --workers 1
```

Keep `api.py`, `registry.py`, `catalog_images/`, `catalog_embeddings.json` and
`product_mapping.json` together. Catalog/static/registry paths remain relative to
`api.py`. `GET /health` reports readiness after model loading and catalog validation.

OpenCLIP ViT-B-32 and pretrained OpenAI weights load at process startup. PyTorch,
weights and inference require more memory and cold-start time than the Node backend.
No measured memory budget or startup SLA is claimed. Use a long-lived Python
service with sufficient resources and a health-check startup grace period established
by measurement; do not package this as a lightweight Vercel frontend function.
One worker avoids duplicating the in-memory model across workers.

Weights are not stored in this repository. The deployment needs outbound access
on first load or a pre-populated compatible model cache. Check platform disk/cache
persistence and package support. Preserve the existing model and QuickGELU warning
baseline. Do not rebuild embeddings as part of deployment.

## Vite frontend / Vercel

Use repository branch `feature/complete-platform`, Vercel root directory
`frontend`, install command `npm ci`, build command `npm run build`, and output
directory `dist`. `frontend/vercel.json` rewrites client routes to `index.html`.
It excludes `/api`, `/search`, `/health` and `/catalog` endpoint prefixes; it
introduces no API proxy. Actual backend and AI calls use their configured origins.
Verify refreshed `/shop`, `/product/HX-01A`, `/technology`, `/visual-search` and
an unknown route on the deployed host before release.

Required **build-time public** variables:

- `VITE_API_URL`: deployed Express HTTPS origin.
- `VITE_AI_API_URL`: deployed FastAPI HTTPS origin.

The existing frontend uses localhost fallbacks only in development/local preview.
Missing origins on a public production host resolve to relative requests, never
to a visitor's localhost. Both variables must be supplied for working integrations.
Rebuild after changing Vite variables; they are embedded in public browser assets.

Optional Firebase **web client** configuration (authentication remains disabled
when incomplete): `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`,
`VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`,
`VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`.
These are separate from Admin credentials. Configure authorized domains and
providers only when enabling authentication.

## Asset inventory and constraints

- Local hero MP4: 1,330,982 bytes (about 1.27 MiB).
- Presentation WebP files: four 1000px and four 500px images; 423,972 bytes total.
- Editorial originals/variants: inspect the inventory in the preparation report;
  retained original PNGs increase the static deployment footprint.
- AI catalog contains ten high-resolution JPEG references. They remain unchanged.
- Embeddings and mapping JSON are small; model weights are downloaded separately.

No compression/deletion is performed by this preparation. Provider-specific build,
disk, bandwidth, memory and request-timeout limits must be checked against the
chosen plan. Static media is suitable for separate frontend hosting; a reliable
long-lived inference service is the principal infrastructure requirement.

## Security and release review

Real `.env` files, Admin credentials, dependencies, Python environments and backend
build output are ignored. Commit only empty/commented `.env.example` templates.
Supply secrets through platform settings, never `VITE_*`. This preparation does
not change data ownership, mappings, model behavior, checkout or UI.

Before public release, review HTTPS origins, provider resources/model cache,
inference abuse protection/rate limits, monitoring and secret access permissions.
CORS is a browser allowlist, not API authorization or rate limiting. Existing
checkout/contact/newsletter limitations and unmapped AI references remain explicit.
No production URLs, credentials, official product photos or policy facts are invented.

References: [Firebase Admin setup](https://firebase.google.com/docs/admin/setup),
[Vercel Vite SPA configuration](https://vercel.com/docs/frameworks/frontend/vite).
