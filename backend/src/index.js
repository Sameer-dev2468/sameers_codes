import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.js'

const app = express()

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

// handle malformed JSON bodies with a friendly error
app.use((err, req, res, next) => {
  if (err && err.type === 'entity.parse.failed') {
    console.error('Invalid JSON received:', err.message)
    return res.status(400).json({ error: 'Invalid JSON' })
  }
  next(err)
})
app.use(cookieParser())

app.use('/api/auth', authRoutes)

app.get('/api/health', (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'development' })
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Backend listening on http://localhost:${port}`))
