# Deployment preparation review

Branch: `feature/complete-platform`. Based on commit
`779b5014a9749c9e616b683e8677a5c297825b7a`. Preparation changes are uncommitted
and unpushed, ready for review. No main merge or remote changes occurred.

## Files

Modified:

- `.gitignore`: ignore backend compiled output.
- `README.md`: link deployment instructions.
- `backend/.env.example`: empty server-only credential variable and comments.
- `backend/package.json`: production build/start and verification scripts.
- `backend/tsconfig.json`: emit source modules into `dist`, exclude test/script folders.
- `backend/src/firebase.ts`: use credential loader and sanitized initialization errors.

Created:

- `backend/src/serviceAccount.ts`: environment-first credentials with robust local fallback.
- `backend/tests/serviceAccount.test.ts`: precedence, cwd, missing/invalid input and safe errors.
- `ai-service/start.py`: platform PORT and network binding startup wrapper.
- `ai-service/test_start.py`: port/binding validation tests.
- `frontend/vercel.json`: client-route rewrite excluding API prefixes.
- `DEPLOYMENT.md`: setup, environment, packaging and infrastructure instructions.
- `DEPLOYMENT-PREPARATION-REPORT.md`: this review record.

No application features, visual styles, routes, backend product logic, model,
catalog or ranking logic were changed. No dependency versions were changed.

## Commands and credential strategy

| Service | Build | Start |
| --- | --- | --- |
| Backend (cwd backend) | `npm run build` | `npm start` / `node dist/index.js` |
| Frontend (cwd frontend) | `npm run build` | Vercel serves `dist` |
| AI (cwd ai-service) | Install existing requirements; no embedding build | `python start.py` |

The AI wrapper runs Uvicorn on `0.0.0.0`, platform `PORT` (8000 fallback) and one
worker. It resolves the application directory from its own path. `/health` and
configurable `CORS_ORIGINS` remain available. Model/catalog file paths are unchanged.

The backend parses nonempty `FIREBASE_SERVICE_ACCOUNT_JSON` first, validates
required service-account fields and passes them to Firebase Admin `cert`.
Otherwise it reads the ignored local file at a module-relative backend path,
valid from both source and compiled directories. Missing/invalid credentials
stop startup with sanitized messages. Invalid nonempty environment credentials
never silently fall back. Neither values nor private keys are logged.

## Production environment

Backend: secret `FIREBASE_SERVICE_ACCOUNT_JSON`, `CORS_ORIGINS`, platform `PORT`.

AI: `CORS_ORIGINS`, platform `PORT`, plus a suitable environment/model cache for
the existing OpenCLIP pretrained weights. No invented model configuration is added.

Frontend: build-time `VITE_API_URL`, `VITE_AI_API_URL` set to actual HTTPS service
origins. Existing production code never falls back to visitor localhost.
Optional auth web configuration: `VITE_FIREBASE_API_KEY`,
`VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`,
`VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`,
`VITE_FIREBASE_APP_ID`. Admin credentials must never enter these public variables.

## SPA routing

Vercel project root must be `frontend`; output is `dist`. Rewrite configuration
covers `/shop`, `/product/HX-01A`, `/technology`, `/visual-search` and unknown
client routes. `/api`, `/search`, `/health` and `/catalog` endpoint prefixes are
excluded. Actual API requests use separately configured service origins; no proxy
or production origin has been invented. Configuration assertions pass. Live
Vercel refresh verification is pending an actual deployment.

## Asset sizes

| Group | Count | Bytes | Approx. MiB |
| --- | --- | --- | --- |
| Hero video | 1 | 1,330,982 | 1.27 |
| Presentation WebPs | 8 | 423,972 | 0.40 |
| Editorial images (PNG/WebP originals/variants) | 12 | 9,783,443 | 9.33 |
| AI catalog JPEGs | 10 | 13,601,640 | 12.97 |
| Catalog embeddings JSON | 1 | 113,688 | 0.11 |
| Product mapping JSON | 1 | 1,408 | <0.01 |

No model weight files are stored in the repository. Existing OpenCLIP weights
are loaded/downloaded through the model library. Their deployment cache size and
the runtime's memory/startup profile were not measured here. PyTorch dependencies,
model download, cold start and inference are more substantial constraints than
these static assets. No assets were removed or compressed during this task.

The previous branch publication audit found no reachable historical blobs above
GitHub's 100 MiB limit. No new large media was introduced in this preparation.
Provider-specific limits must be checked after choosing a hosting plan.

## Security and integrity

Tracked and publishable paths were scanned: no real environment files, Admin
credential files, node_modules, Python environments, private-key/token signatures
were detected. Ignore checks confirm protection for local credentials, environment
files, dependencies and `backend/dist`. Empty `.env.example` templates are intended
to be tracked. Previous reachable-history scans were clean; this task introduced
no actual credentials. Smoke tests passed real credentials privately through
child-process environment only, never into logs or repository files.

No Firestore writes occurred; smoke tests used only `GET /api/products`. No seed
script was run. No embeddings were rebuilt. SHA256 remains:

- `catalog/products.json`: `CA3A0BCF299F7839F6B5C70988129747C5CCB7FE719D28DD1CB0A053B2D73EC9`
- `ai-service/product_mapping.json`: `FBDF000298DB73BB78210EF116B2AD2995550BC9330689E98E01DA9AC82CFA08`
- `ai-service/catalog_embeddings.json`: `F301835B9D02B474C6BB6B69EDB37D85C828BAF783E8137841A3C53D347994A1`

## Verification

| Check | Result |
| --- | --- |
| Frontend lint | PASS |
| Frontend TypeScript, including existing tests | PASS |
| Frontend production build | PASS, 120 modules |
| Backend TypeScript | PASS |
| Backend production build | PASS; Node ESM `.js` imports |
| Backend tests | 15/15 PASS (11 existing + 4 credential cases) |
| AI tests | 8/8 PASS (6 existing + 2 launcher cases) |
| Compiled backend, local fallback, unrelated cwd | PASS; four real Firestore products |
| Compiled backend, environment credential, unrelated cwd | PASS; four real Firestore products |
| AI actual launcher/import/startup | PASS; `/health` ready on assigned port |
| SPA/API exclusion assertions | PASS |

Temporary smoke-test servers were stopped by their parent test. Existing service
processes were not stopped. The existing OpenCLIP QuickGELU warning remains;
no model configuration or vectors were changed to suppress it.

## Remaining deployment blockers

1. Select/provision frontend, backend and long-lived AI hosting and actual HTTPS URLs.
2. Supply backend secret and set both CORS allowlists and frontend build variables.
3. Retain the backend's sibling AI registry/embeddings JSON files in its package.
4. Provide compatible Python dependencies, model download/cache access and measured
   memory/startup resources, with an appropriate startup health-check grace period.
5. Verify hosted deep links, genuine product reads/uploads, CORS and error handling.
6. Review public inference abuse controls/rate limits, monitoring and resource limits.

Auth config and official catalog enrichment remain separate existing limitations.
This task prepares deployment; it does not claim those features are production-ready.
Review these changes before authorizing commit/push or an actual deployment.
