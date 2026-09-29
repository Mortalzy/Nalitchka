import express from 'express'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createStore, transfer } from './data.js'

const app = express()
const store = createStore()
const here = dirname(fileURLToPath(import.meta.url))
const publicDir = join(here, 'public')
app.disable('x-powered-by')
app.use(express.json({limit: '16kb'}))
app.get('/api/health', (_req, res) => res.json({status: 'ok'}))
app.get('/api/dashboard', (_req, res) => res.json({accounts: store.accounts, transactions: store.transactions}))
app.post('/api/transfers', (req, res) => {
  const result = transfer(store, req.body ?? {})
  if (result.error) return res.status(result.status).json({error: result.error})
  res.status(201).json(result)
})
app.use(express.static(publicDir))
app.get('/{*path}', (_req, res) => res.sendFile(join(publicDir, 'index.html')))
app.use((err, _req, res, _next) => res.status(400).json({error: err instanceof SyntaxError ? 'Некорректный JSON' : 'Ошибка запроса'}))
const port = Number(process.env.PORT) || 3001
app.listen(port, '0.0.0.0', () => console.log(`Nalitchka API: http://localhost:${port}`))
