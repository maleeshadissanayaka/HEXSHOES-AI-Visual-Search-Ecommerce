import express from 'express'
import cors from 'cors'
import { db } from './firebase.js'

const app = express()
const PORT = 4000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'HEXSHOES backend is running' })
})

app.get('/api/products', async (req, res) => {
  const snapshot = await db.collection('products').get()
  const products = snapshot.docs.map(doc => doc.data())
  res.json(products)

})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})