import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { db } from './firebase.js'
import { productFromDocument } from './productContract.js'
import { loadProductImageRegistry, applyProductImageRegistry } from './productImageRegistry.js'
const app = express()
const productImageRegistry = loadProductImageRegistry()
const port = Number(process.env.PORT || 4000)
const origins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173').split(',').map(value => value.trim()).filter(Boolean)
app.disable('x-powered-by')
app.use(cors({ origin: (origin, callback) => callback(null, !origin || origins.includes(origin)), methods: ['GET'] }))
app.use(express.json({ limit: '32kb' }))
app.get('/', (_req, res) => res.json({ message: 'HEXSHOES backend is running' }))
app.get('/api/products', async (_req, res) => {
  try {
    const snapshot = await db.collection('products').get()
    res.json(applyProductImageRegistry(snapshot.docs.map(doc => productFromDocument(doc.id, doc.data())), productImageRegistry))
  } catch {
    res.status(503).json({ error: { code: 'CATALOG_UNAVAILABLE', message: 'The product catalog is temporarily unavailable.' } })
  }
})
app.use((_req, res) => res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Endpoint not found.' } }))
app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = typeof error === 'object' && error !== null && 'status' in error && error.status === 400 ? 400 : 500
  res.status(status).json({ error: { code: 'REQUEST_FAILED', message: status === 400 ? 'Invalid request body.' : 'Request could not be completed.' } })
})
app.listen(port, () => console.log(`HEXSHOES API listening on port ${port}`))
