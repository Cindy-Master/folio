const { getTokenCookieName } = require('../../lib/auth')

module.exports = function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  res.setHeader(
    'Set-Cookie',
    `${getTokenCookieName()}=; Path=/; HttpOnly; Max-Age=0`
  )

  return res.status(200).json({ ok: true })
}
