const fs = require('fs')
const path = require('path')
const { isAuthenticated } = require('../../lib/auth')
const { addPhotoToCollection } = require('../../lib/data')

const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.bmp', '.tiff'])
const MAX_SIZE = 20 * 1024 * 1024 // 20MB

module.exports = handler
module.exports.config = { api: { bodyParser: false } }

function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let total = 0
    req.on('data', (chunk) => {
      total += chunk.length
      if (total > MAX_SIZE) return reject(new Error('Upload too large (max 20MB)'))
      chunks.push(chunk)
    })
    req.on('end', () => {
      const buffer = Buffer.concat(chunks)
      const contentType = req.headers['content-type'] || ''
      const boundaryMatch = contentType.match(/boundary=(.+)/)
      if (!boundaryMatch) return reject(new Error('No boundary found'))

      const boundary = boundaryMatch[1]
      const parts = []
      const boundaryBuffer = Buffer.from(`--${boundary}`)

      let start = buffer.indexOf(boundaryBuffer) + boundaryBuffer.length + 2
      while (start < buffer.length) {
        let end = buffer.indexOf(boundaryBuffer, start)
        if (end === -1) break

        const part = buffer.slice(start, end - 2)
        const headerEnd = part.indexOf('\r\n\r\n')
        if (headerEnd === -1) { start = end + boundaryBuffer.length + 2; continue }

        const headerStr = part.slice(0, headerEnd).toString()
        const body = part.slice(headerEnd + 4)

        const nameMatch = headerStr.match(/name="([^"]+)"/)
        const filenameMatch = headerStr.match(/filename="([^"]+)"/)

        parts.push({
          name: nameMatch ? nameMatch[1] : '',
          filename: filenameMatch ? filenameMatch[1] : null,
          data: filenameMatch ? body : body.toString(),
        })

        start = end + boundaryBuffer.length + 2
      }

      resolve(parts)
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
    const parts = await parseMultipart(req)

    const slugPart = parts.find((p) => p.name === 'slug')
    const titlePart = parts.find((p) => p.name === 'title')
    const fileParts = parts.filter((p) => p.name === 'files' && p.filename)

    if (!slugPart || !fileParts.length) {
      return res.status(400).json({ error: 'slug and files are required' })
    }

    const slug = slugPart.data.toString().trim()
    const dir = path.join(process.cwd(), 'public', 'photos', 'collections', slug)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

    const uploaded = []
    for (const file of fileParts) {
      const base = file.filename.replace(/[^a-zA-Z0-9._-]/g, '_')
      const ext = path.extname(base).toLowerCase()
      const name = path.basename(base, ext)

      // Validate file type
      if (!ALLOWED_EXT.has(ext)) {
        continue // skip unsupported files
      }

      const safeName = `${name}_${Date.now()}${ext}`
      fs.writeFileSync(path.join(dir, safeName), file.data)

      const title = titlePart ? titlePart.data.toString().trim() : ''
      const photo = addPhotoToCollection(slug, safeName, title)
      uploaded.push(photo)
    }

    return res.status(200).json({ uploaded })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
