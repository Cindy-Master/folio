const { isAuthenticated } = require('../../lib/auth')
const { removePhotoFromCollection, reorderPhotos, updatePhoto } = require('../../lib/data')

export default function handler(req, res) {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'DELETE') {
    const { slug, index } = req.body
    if (!slug || index === undefined) {
      return res.status(400).json({ error: 'slug and index are required' })
    }
    const ok = removePhotoFromCollection(slug, index)
    if (!ok) return res.status(404).json({ error: 'Photo not found' })
    return res.status(200).json({ ok: true })
  }

  if (req.method === 'PUT') {
    const { slug, index, order, title, description, location, date, camera, note, custom } = req.body

    // Reorder photos
    if (order) {
      if (!slug) return res.status(400).json({ error: 'slug is required' })
      const ok = reorderPhotos(slug, order)
      if (!ok) return res.status(404).json({ error: 'Collection not found' })
      return res.status(200).json({ ok: true })
    }

    // Update single photo metadata by index
    if (index !== undefined) {
      if (!slug) return res.status(400).json({ error: 'slug is required' })
      const fields = {}
      if (title !== undefined) fields.title = title
      if (description !== undefined) fields.description = description
      if (location !== undefined) fields.location = location
      if (date !== undefined) fields.date = date
      if (camera !== undefined) fields.camera = camera
      if (note !== undefined) fields.note = note
      if (custom !== undefined) fields.custom = custom

      const photo = updatePhoto(slug, index, fields)
      if (!photo) return res.status(404).json({ error: 'Photo not found' })
      return res.status(200).json(photo)
    }

    return res.status(400).json({ error: 'index or order is required' })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
