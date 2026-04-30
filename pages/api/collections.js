const { isAuthenticated } = require('../../lib/auth')
const { getCollections, createCollection, updateCollection, deleteCollection } = require('../../lib/data')

module.exports = function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(getCollections())
  }

  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'POST') {
    const { title, slug, description, location, date, custom } = req.body
    if (!title || !slug) {
      return res.status(400).json({ error: 'title and slug are required' })
    }
    const col = createCollection({ title, slug, description, location, date, custom })
    if (col.error === 'slug_exists') {
      return res.status(409).json({ error: 'Collection with this slug already exists' })
    }
    return res.status(201).json(col)
  }

  if (req.method === 'PUT') {
    const { slug, title, description, location, date, custom, slug: newSlug } = req.body
    if (!slug) {
      return res.status(400).json({ error: 'slug is required' })
    }
    const updates = {}
    if (title !== undefined) updates.title = title
    if (description !== undefined) updates.description = description
    if (location !== undefined) updates.location = location
    if (date !== undefined) updates.date = date
    if (custom !== undefined) updates.custom = custom
    if (newSlug !== undefined && newSlug !== slug) updates.slug = newSlug

    const col = updateCollection(slug, updates)
    if (!col) return res.status(404).json({ error: 'Collection not found' })
    return res.status(200).json(col)
  }

  if (req.method === 'DELETE') {
    const { slug } = req.body
    if (!slug) {
      return res.status(400).json({ error: 'slug is required' })
    }
    const ok = deleteCollection(slug)
    if (!ok) return res.status(404).json({ error: 'Collection not found' })
    return res.status(200).json({ ok: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
