const fs = require('fs')
const path = require('path')

const DATA_DIR = path.join(process.cwd(), 'data')
const PHOTOS_DIR = path.join(process.cwd(), 'public', 'photos', 'collections')
const BACKUP_DIR = path.join(process.cwd(), 'backup')

function backupFile(srcPath) {
  if (!fs.existsSync(srcPath)) return
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const destDir = path.join(BACKUP_DIR, stamp)
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })
  fs.copyFileSync(srcPath, path.join(destDir, path.basename(srcPath)))
}

function backupDir(dirPath) {
  if (!fs.existsSync(dirPath)) return
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const destDir = path.join(BACKUP_DIR, stamp, path.basename(dirPath))
  fs.mkdirSync(destDir, { recursive: true })
  for (const file of fs.readdirSync(dirPath)) {
    const src = path.join(dirPath, file)
    if (fs.statSync(src).isFile()) fs.copyFileSync(src, path.join(destDir, file))
  }
}

function readJSON(filename) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, filename), 'utf-8'))
}

function writeJSON(filename, data) {
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2), 'utf-8')
}

function getProfile() {
  return readJSON('profile.json')
}

function updateProfile(updates) {
  const profile = readJSON('profile.json')
  const updated = { ...profile, ...updates }
  writeJSON('profile.json', updated)
  return updated
}

function getCollections() {
  return readJSON('collections.json')
}

function getCollection(slug) {
  const collections = readJSON('collections.json')
  return collections.find((c) => c.slug === slug) || null
}

function createCollection({ title, slug, description, location, date, custom }) {
  const collections = readJSON('collections.json')
  if (collections.some((c) => c.slug === slug)) {
    return { error: 'slug_exists' }
  }

  const id = String(Date.now())
  const dirPath = path.join(PHOTOS_DIR, slug)
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true })

  const newCollection = {
    id, slug, title,
    description: description || '',
    location: location || '',
    date: date || '',
    custom: custom || {},
    photos: [],
  }
  collections.push(newCollection)
  writeJSON('collections.json', collections)
  return newCollection
}

function updateCollection(slug, updates) {
  const collections = readJSON('collections.json')
  const index = collections.findIndex((c) => c.slug === slug)
  if (index === -1) return null

  const old = collections[index]
  let photos = old.photos

  // If slug changed, rename directory and update photo paths
  if (updates.slug && updates.slug !== old.slug) {
    const oldDir = path.join(PHOTOS_DIR, old.slug)
    const newDir = path.join(PHOTOS_DIR, updates.slug)
    if (fs.existsSync(oldDir)) fs.renameSync(oldDir, newDir)

    const oldPrefix = `/photos/collections/${old.slug}/`
    const newPrefix = `/photos/collections/${updates.slug}/`
    photos = photos.map((p) => ({ ...p, src: p.src.replace(oldPrefix, newPrefix) }))
  }

  // Merge custom fields
  let custom = old.custom || {}
  if (updates.custom !== undefined) {
    const merged = { ...custom, ...updates.custom }
    custom = Object.fromEntries(
      Object.entries(merged).filter(([k, v]) => !(v === '' && updates.custom[k] === ''))
    )
  }

  // Only allow known fields to be updated
  const allowed = ['title', 'description', 'location', 'date', 'slug']
  const safeUpdates = {}
  for (const key of allowed) {
    if (updates[key] !== undefined) safeUpdates[key] = updates[key]
  }

  collections[index] = { ...old, ...safeUpdates, custom, photos }
  writeJSON('collections.json', collections)
  return collections[index]
}

function deleteCollection(slug) {
  const collections = readJSON('collections.json')
  const index = collections.findIndex((c) => c.slug === slug)
  if (index === -1) return false

  const dirPath = path.join(PHOTOS_DIR, slug)
  backupDir(dirPath)
  if (fs.existsSync(dirPath)) fs.rmSync(dirPath, { recursive: true })

  collections.splice(index, 1)
  writeJSON('collections.json', collections)
  return true
}

function addPhotoToCollection(slug, filename, title) {
  const collections = readJSON('collections.json')
  const col = collections.find((c) => c.slug === slug)
  if (!col) return null

  const photo = {
    src: `/photos/collections/${slug}/${filename}`,
    title: title || filename.replace(/\.[^.]+$/, ''),
    description: '',
    location: '',
    date: '',
    camera: '',
    note: '',
    custom: {},
  }
  col.photos.push(photo)
  writeJSON('collections.json', collections)
  return photo
}

function updatePhoto(slug, photoIndex, updates) {
  const collections = readJSON('collections.json')
  const col = collections.find((c) => c.slug === slug)
  if (!col) return null
  if (photoIndex < 0 || photoIndex >= col.photos.length) return null

  const photo = col.photos[photoIndex]

  // Only update known fields
  const fields = ['title', 'description', 'location', 'date', 'camera', 'note']
  const fieldUpdates = {}
  for (const key of fields) {
    if (updates[key] !== undefined) fieldUpdates[key] = updates[key]
  }

  let newCustom = photo.custom || {}
  if (updates.custom !== undefined) {
    const merged = { ...newCustom, ...updates.custom }
    newCustom = Object.fromEntries(
      Object.entries(merged).filter(([k, v]) => !(v === '' && updates.custom[k] === ''))
    )
  }

  col.photos[photoIndex] = { ...photo, ...fieldUpdates, custom: newCustom }
  writeJSON('collections.json', collections)
  return col.photos[photoIndex]
}

function removePhotoFromCollection(slug, photoIndex) {
  const collections = readJSON('collections.json')
  const col = collections.find((c) => c.slug === slug)
  if (!col) return false
  if (photoIndex < 0 || photoIndex >= col.photos.length) return false

  const photo = col.photos[photoIndex]
  const filePath = path.join(process.cwd(), 'public', photo.src)
  backupFile(filePath)
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

  col.photos.splice(photoIndex, 1)
  writeJSON('collections.json', collections)
  return true
}

function reorderPhotos(slug, newOrder) {
  const collections = readJSON('collections.json')
  const col = collections.find((c) => c.slug === slug)
  if (!col) return false

  const oldPhotos = [...col.photos]
  col.photos = newOrder.map((i) => oldPhotos[i]).filter(Boolean)
  writeJSON('collections.json', collections)
  return true
}

module.exports = {
  getProfile, updateProfile,
  getCollections, getCollection, createCollection, updateCollection, deleteCollection,
  addPhotoToCollection, updatePhoto, removePhotoFromCollection, reorderPhotos,
}
