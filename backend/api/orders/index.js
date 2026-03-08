import prisma from '../../../src/prismaClient.js'
import cookie from 'cookie'
import jwt from 'jsonwebtoken'

function getUserIdFromReq(req) {
  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {}
  const token = cookies.sid
  if (!token) return null
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret')
    return payload.userId
  } catch (e) {
    return null
  }
}

export default async function handler(req, res) {
  const userId = getUserIdFromReq(req)
  if (!userId) return res.status(401).json({ error: 'unauthenticated' })

  if (req.method === 'GET') {
    try {
      const orders = await prisma.order.findMany({ where: { userId }, include: { items: true } })
      return res.status(200).json({ ok: true, orders })
    } catch (err) {
      console.error('GET /api/orders error', err)
      return res.status(500).json({ error: 'server error' })
    }
  }

  if (req.method === 'POST') {
    try {
      const { items, totalCents } = req.body
      if (!Array.isArray(items) || !items.length) return res.status(400).json({ error: 'no items' })

      const order = await prisma.order.create({
        data: {
          userId: Number(userId),
          totalCents: Number(totalCents) || items.reduce((s,i)=>s + (i.unitCents||0) * (i.quantity||0), 0),
          status: 'pending',
          items: { create: items.map(it => ({ productId: Number(it.productId), quantity: Number(it.quantity), unitCents: Number(it.unitCents) })) }
        },
        include: { items: true }
      })

      return res.status(201).json({ ok: true, order })
    } catch (err) {
      console.error('POST /api/orders error', err)
      return res.status(500).json({ error: 'server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
