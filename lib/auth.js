const crypto = require('crypto')

const TOKEN_COOKIE = 'admin_token'

function getSecret() {
  return process.env.ADMIN_PASSWORD || 'admin123'
}

function sign(payload) {
  const hmac = crypto.createHmac('sha256', getSecret())
  hmac.update(payload)
  return hmac.digest('hex')
}

function createToken() {
  const payload = Date.now().toString()
  const sig = sign(payload)
  return `${payload}.${sig}`
}

function verifyToken(token) {
  if (!token || !token.includes('.')) return false
  const [payload, sig] = token.split('.')
  const expected = sign(payload)
  if (sig !== expected) return false
  // Token valid for 7 days
  const age = Date.now() - parseInt(payload, 10)
  return age < 7 * 24 * 60 * 60 * 1000
}

function login(password) {
  if (password === getSecret()) {
    return createToken()
  }
  return null
}

function isAuthenticated(req) {
  const cookie = req.headers.cookie || ''
  const match = cookie.match(new RegExp(`${TOKEN_COOKIE}=([^;]+)`))
  if (!match) return false
  return verifyToken(match[1])
}

function getTokenCookieName() {
  return TOKEN_COOKIE
}

module.exports = { login, isAuthenticated, getTokenCookieName }
