import prisma from '../../../src/prismaClient.js'

export default async function handler(req, res) {
  const { id } = req.query || {}
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  if (!id) return res.status(400).json({ error: 'missing id' })
  try {
    const product = await prisma.product.findUnique({ where: { id: Number(id) } })
    if (!product) return res.status(404).json({ error: 'not found' })
    res.status(200).json({ ok: true, product })
  } catch (err) {
    console.error('GET /api/products/[id] error', err)
    res.status(500).json({ error: 'server error' })
  }
}
