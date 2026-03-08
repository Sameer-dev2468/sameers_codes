import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import prisma from '../../../src/prismaClient.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()
  try {
    const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {}
    const token = cookies.sid
    if (!token) return res.status(200).json({ ok: false })
    let payload
    try { payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret') } catch (e) { return res.status(200).json({ ok: false }) }
    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user) return res.status(200).json({ ok: false })
    res.status(200).json({ ok: true, user: { id: user.id, email: user.email, name: user.name } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
}
