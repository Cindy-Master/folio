const { isAuthenticated } = require('../../lib/auth')

export default function handler(req, res) {
  if (isAuthenticated(req)) {
    return res.status(200).json({ authenticated: true })
  }
  return res.status(401).json({ authenticated: false })
}
