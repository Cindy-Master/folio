const { isAuthenticated } = require('../../lib/auth')
const { getProfile, updateProfile } = require('../../lib/data')

module.exports = function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(getProfile())
  }

  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'PUT') {
    const updated = updateProfile(req.body)
    return res.status(200).json(updated)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
