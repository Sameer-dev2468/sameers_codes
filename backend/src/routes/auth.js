import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../prismaClient.js'

const DEV_AUTH = process.env.DEV_AUTH === 'true'
const devUsers = new Map()

const router = express.Router()

const JWT_EXPIRES_IN = '7d'

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body
    if (!email || !password) return res.status(400).json({ error: 'email and password required' })

    if (DEV_AUTH) {
      if (devUsers.has(email)) return res.status(409).json({ error: 'email already registered' })
      const passwordHash = await bcrypt.hash(password, 10)
      const id = devUsers.size + 1
      const user = { id, email, passwordHash, name, createdAt: new Date() }
      devUsers.set(email, user)
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: JWT_EXPIRES_IN })
      res.cookie('sid', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 })
      return res.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(409).json({ error: 'email already registered' })

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({ data: { email, passwordHash, name } })

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: JWT_EXPIRES_IN })

    res.cookie('sid', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 })
    res.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'email and password required' })

    if (DEV_AUTH) {
      const user = devUsers.get(email)
      if (!user) return res.status(401).json({ error: 'invalid credentials' })
      const ok = await bcrypt.compare(password, user.passwordHash)
      if (!ok) return res.status(401).json({ error: 'invalid credentials' })
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: JWT_EXPIRES_IN })
      res.cookie('sid', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 })
      return res.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ error: 'invalid credentials' })

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ error: 'invalid credentials' })

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: JWT_EXPIRES_IN })
    res.cookie('sid', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 })

    res.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

router.post('/logout', (req, res) => {
  res.clearCookie('sid')
  res.json({ ok: true })
})

router.get('/me', async (req, res) => {
  try {
    const token = req.cookies && req.cookies.sid
    if (!token) return res.json({ ok: false })
    let payload
    try { payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret') } catch(e) { return res.json({ ok: false }) }
    if (DEV_AUTH) {
      // read from in-memory dev store
      const user = Array.from(devUsers.values()).find(u => u.id === payload.userId)
      if (!user) return res.json({ ok: false })
      return res.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } })
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user) return res.json({ ok: false })
    res.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

export default router
