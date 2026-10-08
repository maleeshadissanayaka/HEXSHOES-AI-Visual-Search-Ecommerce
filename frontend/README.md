# HEXSHOES Frontend

React + TypeScript + Vite application for the HEXSHOES AI-powered footwear discovery platform.

See [the project README](../README.md) for architecture, setup, environment variables, real AI workflow, security boundaries and feature status.

```powershell
npm ci
npm run dev
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Copy `.env.example` to ignored `.env` when configuring services. Firebase Auth stays disabled until public web-app values are supplied. Never place Admin credentials in this frontend.
