const { login, getTokenCookieName } = require('../../lib/auth')

module.exports = function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { password } = req.body
  const token = login(password)

  if (!token) {
    return res.status(401).json({ error: 'Invalid password' })
  }

  res.setHeader(
    'Set-Cookie',
    `${getTokenCookieName()}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`
  )

  return res.status(200).json({ ok: true })
}
