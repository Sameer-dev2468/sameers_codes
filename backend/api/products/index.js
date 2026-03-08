import prisma from '../../../src/prismaClient.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
    res.status(200).json({ ok: true, products })
  } catch (err) {
    console.error('GET /api/products error', err)
    res.status(500).json({ error: 'server error' })
  }
}
