import cookie from 'cookie'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  // clear cookie
  const serialized = cookie.serialize('sid', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', expires: new Date(0), path: '/' })
  res.setHeader('Set-Cookie', serialized)
  res.status(200).json({ ok: true })
}
