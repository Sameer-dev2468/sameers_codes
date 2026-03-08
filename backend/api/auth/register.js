import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import prisma from '../../../src/prismaClient.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  try {
    const { email, password, name } = req.body
    if (!email || !password) return res.status(400).json({ error: 'email and password required' })

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(409).json({ error: 'email already registered' })

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({ data: { email, passwordHash, name } })

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' })
    const serialized = cookie.serialize('sid', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60, path: '/' })
    res.setHeader('Set-Cookie', serialized)

    res.status(200).json({ ok: true, user: { id: user.id, email: user.email, name: user.name } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
}
