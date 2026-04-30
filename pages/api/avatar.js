const fs = require('fs')
const path = require('path')
const { isAuthenticated } = require('../../lib/auth')

const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'])

module.exports = handler
module.exports.config = { api: { bodyParser: false } }

function parseFile(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => {
      const buffer = Buffer.concat(chunks)
      const contentType = req.headers['content-type'] || ''
      const boundaryMatch = contentType.match(/boundary=(.+)/)
      if (!boundaryMatch) return reject(new Error('No boundary'))

      const boundary = boundaryMatch[1]
      const boundaryBuffer = Buffer.from(`--${boundary}`)

      let start = buffer.indexOf(boundaryBuffer) + boundaryBuffer.length + 2
      let end = buffer.indexOf(boundaryBuffer, start)
      if (end === -1) return reject(new Error('No file found'))

      const part = buffer.slice(start, end - 2)
      const headerEnd = part.indexOf('\r\n\r\n')
      if (headerEnd === -1) return reject(new Error('Malformed'))

      const headerStr = part.slice(0, headerEnd).toString()
      const body = part.slice(headerEnd + 4)
      const filenameMatch = headerStr.match(/filename="([^"]+)"/)

      resolve({
        filename: filenameMatch ? filenameMatch[1] : 'avatar.jpg',
        data: body,
      })
    })
    req.on('error', reject)
  })
}

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const file = await parseFile(req)
    const ext = (path.extname(file.filename) || '.jpg').toLowerCase()

    if (!ALLOWED_EXT.has(ext)) {
      return res.status(400).json({ error: 'Unsupported file type' })
    }

    // Clean up old avatar files
    const avatarDir = path.join(process.cwd(), 'public', 'photos')
    for (const f of fs.readdirSync(avatarDir)) {
      if (/^avatar\./i.test(f)) {
        fs.unlinkSync(path.join(avatarDir, f))
      }
    }

    const dest = path.join(avatarDir, `avatar${ext}`)
    fs.writeFileSync(dest, file.data)

    return res.status(200).json({ src: `/photos/avatar${ext}` })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
