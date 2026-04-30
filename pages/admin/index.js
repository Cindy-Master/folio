import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { useSettings } from '../../lib/useSettings'
import { t } from '../../lib/i18n'


function ProfileEditor({ profile, onSave }) {
  const [form, setForm] = useState(profile)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const fileRef = useRef()

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const data = await res.json()
      onSave(data)
      setMsg('已保存')
      setTimeout(() => setMsg(''), 2000)
    }
    setSaving(false)
  }

  async function handleAvatarUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/avatar', { method: 'POST', body: fd })
    if (res.ok) {
      const data = await res.json()
      update('avatar', data.src + '?t=' + Date.now())
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 transition-colors">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">个人资料</h2>

      <div className="flex items-center gap-4 mb-6">
        <img
          src={form.avatar}
          alt="avatar"
          className="w-20 h-20 rounded-full object-cover border border-gray-200"
        />
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current.click()}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
          >
            更换头像
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        <label className="block">
          <span className="text-sm text-gray-600 dark:text-gray-400">名称</span>
          <input
            value={form.name || ''}
            onChange={(e) => update('name', e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-gray-900 dark:focus:border-gray-400 focus:outline-none text-sm transition-colors"
          />
        </label>
        <label className="block">
          <span className="text-sm text-gray-600 dark:text-gray-400">签名</span>
          <input
            value={form.quote || ''}
            onChange={(e) => update('quote', e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-gray-900 dark:focus:border-gray-400 focus:outline-none text-sm transition-colors"
          />
        </label>
        <label className="block">
          <span className="text-sm text-gray-600 dark:text-gray-400">简介</span>
          <textarea
            value={form.bio || ''}
            onChange={(e) => update('bio', e.target.value)}
            rows={3}
            placeholder="关于你自己的介绍，可以为空  "
            className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-gray-900 focus:outline-none text-sm resize-none"
          />
        </label>
        <label className="block">
          <span className="text-sm text-gray-600 dark:text-gray-400">邮箱</span>
          <input
            value={form.email || ''}
            onChange={(e) => update('email', e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-gray-900 dark:focus:border-gray-400 focus:outline-none text-sm transition-colors"
          />
        </label>
        <label className="block">
          <span className="text-sm text-gray-600 dark:text-gray-400">位置</span>
          <input
            value={form.location || ''}
            onChange={(e) => update('location', e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-gray-900 dark:focus:border-gray-400 focus:outline-none text-sm transition-colors"
          />
        </label>
        <label className="block">
          <span className="text-sm text-gray-600 dark:text-gray-400">网站</span>
          <input
            value={form.website || ''}
            onChange={(e) => update('website', e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-gray-900 dark:focus:border-gray-400 focus:outline-none text-sm transition-colors"
          />
        </label>
        <label className="block">
          <span className="text-sm text-gray-600 dark:text-gray-400">兴趣标签（逗号分隔）</span>
          <input
            value={(form.interests || []).join(', ')}
            onChange={(e) =>
              update(
                'interests',
                e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
              )
            }
            className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-gray-900 dark:focus:border-gray-400 focus:outline-none text-sm transition-colors"
          />
        </label>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors cursor-pointer"
        >
          {saving ? '保存中...' : '保存'}
        </button>
        {msg && <span className="text-sm text-green-600">{msg}</span>}
      </div>
    </div>
  )
}

function CollectionManager({ collections, onRefresh }) {
  const [showCreate, setShowCreate] = useState(false)
  const [newForm, setNewForm] = useState({ title: '', slug: '', description: '', location: '', date: '', custom: {} })
  const [creating, setCreating] = useState(false)

  function updateNew(key, value) {
    setNewForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleCreate() {
    if (!newForm.title || !newForm.slug) return
    setCreating(true)
    const res = await fetch('/api/collections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newForm),
    })
    if (res.status === 409) {
      alert('URL 标识已存在，请换一个')
      setCreating(false)
      return
    }
    setNewForm({ title: '', slug: '', description: '', location: '', date: '', custom: {} })
    setShowCreate(false)
    setCreating(false)
    onRefresh()
  }

  async function handleDelete(slug, title) {
    if (!confirm(`确定要删除「${title}」？此操作不可恢复。`)) return
    await fetch('/api/collections', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    })
    onRefresh()
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          摄影集 ({collections.length})
        </h2>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer"
        >
          {showCreate ? '取消' : '+ 新建'}
        </button>
      </div>

      {showCreate && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
          <div className="grid gap-3">
            <input
              placeholder="标题，如：Street Stories"
              value={newForm.title}
              onChange={(e) => {
                const val = e.target.value
                updateNew('title', val)
                if (!newForm.slug || newForm.slug === slugify(newForm.title)) {
                  updateNew('slug', slugify(val))
                }
              }}
              className={inputCls}
            />
            <input placeholder="URL 标识，如：street-stories" value={newForm.slug} onChange={(e) => updateNew('slug', e.target.value)} className={inputCls} />
            <input placeholder="描述（可选）" value={newForm.description} onChange={(e) => updateNew('description', e.target.value)} className={inputCls} />
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="拍摄地点（可选）" value={newForm.location} onChange={(e) => updateNew('location', e.target.value)} className={inputCls} />
              <input placeholder="拍摄日期（可选）" value={newForm.date} onChange={(e) => updateNew('date', e.target.value)} className={inputCls} />
            </div>
            <CustomFieldsEditor fields={newForm.custom} onChange={(c) => updateNew('custom', c)} />
            <button
              onClick={handleCreate}
              disabled={creating || !newForm.title || !newForm.slug}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {creating ? '创建中...' : '创建'}
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {collections.map((col) => (
          <CollectionItem
            key={col.slug}
            collection={col}
            onDelete={() => handleDelete(col.slug, col.title)}
            onRefresh={onRefresh}
          />
        ))}
        {collections.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-8">
            还没有摄影集，点击上方「+ 新建」创建一个
          </p>
        )}
      </div>
    </div>
  )
}

function CustomFieldsEditor({ fields, onChange }) {
  const entries = Object.entries(fields || {})

  function updateKey(oldKey, newKey) {
    const updated = {}
    for (const [k, v] of Object.entries(fields)) {
      updated[k === oldKey ? newKey : k] = v
    }
    onChange(updated)
  }

  function updateValue(key, value) {
    onChange({ ...fields, [key]: value })
  }

  function addField() {
    onChange({ ...fields, '': '' })
  }

  function removeField(key) {
    const updated = { ...fields }
    delete updated[key]
    onChange(updated)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500">自定义字段</span>
        <button
          onClick={addField}
          className="text-xs text-gray-500 hover:text-gray-800 cursor-pointer"
        >
          + 添加字段
        </button>
      </div>
      {entries.length > 0 ? (
        <div className="grid gap-2">
          {entries.map(([key, value], i) => (
            <div key={i} className="flex gap-2 items-start">
              <input
                placeholder="字段名"
                value={key}
                onChange={(e) => updateKey(key, e.target.value)}
                className="w-1/3 px-2 py-1.5 rounded border border-gray-200 focus:border-gray-900 focus:outline-none text-xs"
              />
              <input
                placeholder="值"
                value={value}
                onChange={(e) => updateValue(key, e.target.value)}
                className="flex-1 px-2 py-1.5 rounded border border-gray-200 focus:border-gray-900 focus:outline-none text-xs"
              />
              <button
                onClick={() => removeField(key)}
                className="px-2 py-1.5 text-xs text-red-400 hover:text-red-600 cursor-pointer"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-300">暂无自定义字段</p>
      )}
    </div>
  )
}

const inputCls = 'mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-gray-900 dark:focus:border-gray-400 focus:outline-none text-sm transition-colors'
const inputSmCls = 'mt-1 w-full px-3 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-gray-900 dark:focus:border-gray-400 focus:outline-none text-sm transition-colors'

function CollectionItem({ collection, onDelete, onRefresh }) {
  const [expanded, setExpanded] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [localPhotos, setLocalPhotos] = useState(collection.photos)
  const [orderChanged, setOrderChanged] = useState(false)
  const [savingOrder, setSavingOrder] = useState(false)

  useEffect(() => { setLocalPhotos(collection.photos); setOrderChanged(false) }, [collection.photos])
  const [form, setForm] = useState({
    title: collection.title,
    description: collection.description || '',
    location: collection.location || '',
    date: collection.date || '',
    custom: collection.custom || {},
  })
  const [saving, setSaving] = useState(false)
  const [editingPhoto, setEditingPhoto] = useState(null)
  const fileRef = useRef()

  function updateForm(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleUpload(e) {
    const files = e.target.files
    if (!files.length) return
    setUploading(true)

    const fd = new FormData()
    fd.append('slug', collection.slug)
    for (const file of files) {
      fd.append('files', file)
    }

    await fetch('/api/upload', { method: 'POST', body: fd })
    fileRef.current.value = ''
    setUploading(false)
    onRefresh()
  }

  async function handleSaveCollection() {
    setSaving(true)
    await fetch('/api/collections', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: collection.slug, ...form }),
    })
    setSaving(false)
    setEditing(false)
    onRefresh()
  }

  async function handleRemovePhoto(index) {
    if (!confirm('确定要删除这张照片？')) return
    await fetch('/api/photos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: collection.slug, index }),
    })
    onRefresh()
  }

  async function handleSavePhoto(photoIndex, updates) {
    await fetch('/api/photos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: collection.slug, index: photoIndex, ...updates }),
    })
    setEditingPhoto(null)
    onRefresh()
  }

  function handleMovePhoto(index, direction) {
    const target = index + direction
    if (target < 0 || target >= localPhotos.length) return
    const swapped = [...localPhotos]
    const temp = swapped[index]
    swapped[index] = swapped[target]
    swapped[target] = temp
    setLocalPhotos(swapped)
    setOrderChanged(true)
  }

  async function handleSaveOrder() {
    setSavingOrder(true)
    // Build index mapping from original to current order
    const order = localPhotos.map((p) => collection.photos.indexOf(p))
    await fetch('/api/photos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: collection.slug, order }),
    })
    setSavingOrder(false)
    setOrderChanged(false)
    onRefresh()
  }

  function startEditing() {
    setForm({
      title: collection.title,
      description: collection.description || '',
      location: collection.location || '',
      date: collection.date || '',
      custom: collection.custom || {},
    })
    setEditing(true)
  }

  return (
    <div className="border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          {collection.photos[0] && (
            <img src={collection.photos[0].src} alt="" className="w-10 h-10 rounded object-cover" />
          )}
          <div>
            <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">{collection.title}</span>
            <span className="text-gray-400 text-xs ml-2">{collection.photos.length} 张</span>
            {collection.description && (
              <span className="text-gray-400 text-xs ml-1">· {collection.description}</span>
            )}
          </div>
        </div>
        <span className="text-gray-400 text-sm">{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          {editing && (
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 mb-3">编辑摄影集信息</h4>
              <div className="grid gap-3">
                <label className="block">
                  <span className="text-xs text-gray-500">标题</span>
                  <input value={form.title} onChange={(e) => updateForm('title', e.target.value)} className={inputCls} />
                </label>
                <label className="block">
                  <span className="text-xs text-gray-500">描述</span>
                  <input value={form.description} onChange={(e) => updateForm('description', e.target.value)} className={inputCls} />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-xs text-gray-500">拍摄地点</span>
                    <input value={form.location} onChange={(e) => updateForm('location', e.target.value)} className={inputCls} placeholder="如：上海" />
                  </label>
                  <label className="block">
                    <span className="text-xs text-gray-500">拍摄日期</span>
                    <input value={form.date} onChange={(e) => updateForm('date', e.target.value)} className={inputCls} placeholder="如：2025-03" />
                  </label>
                </div>
                <CustomFieldsEditor fields={form.custom} onChange={(c) => updateForm('custom', c)} />
                <div className="flex gap-2 pt-1">
                  <button onClick={handleSaveCollection} disabled={saving} className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 disabled:opacity-50 transition-colors cursor-pointer">
                    {saving ? '保存中...' : '保存'}
                  </button>
                  <button onClick={() => setEditing(false)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors cursor-pointer">
                    取消
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
            <button onClick={() => fileRef.current.click()} disabled={uploading} className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 disabled:opacity-50 transition-colors cursor-pointer">
              {uploading ? '上传中...' : '上传照片'}
            </button>
            <button onClick={editing ? () => setEditing(false) : startEditing} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors cursor-pointer">
              {editing ? '收起编辑' : '编辑信息'}
            </button>
            {orderChanged && (
              <button onClick={handleSaveOrder} disabled={savingOrder} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-500 disabled:opacity-50 transition-colors cursor-pointer">
                {savingOrder ? '保存中...' : '保存排序'}
              </button>
            )}
            <button onClick={onDelete} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition-colors cursor-pointer">
              删除摄影集
            </button>
          </div>

          {localPhotos.length > 0 ? (
            <div className="grid gap-3">
              {localPhotos.map((photo, index) => (
                <PhotoItem
                  key={`${index}-${photo.src}`}
                  photo={photo}
                  index={index}
                  total={localPhotos.length}
                  isCover={index === 0}
                  isEditing={editingPhoto === index}
                  onEdit={() => setEditingPhoto(editingPhoto === index ? null : index)}
                  onSave={(updates) => handleSavePhoto(index, updates)}
                  onDelete={() => handleRemovePhoto(index)}
                  onMoveUp={() => handleMovePhoto(index, -1)}
                  onMoveDown={() => handleMovePhoto(index, 1)}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-4">暂无照片，点击上方按钮上传</p>
          )}
        </div>
      )}
    </div>
  )
}

function PhotoItem({ photo, index, total, isCover, isEditing, onEdit, onSave, onDelete, onMoveUp, onMoveDown }) {
  const [form, setForm] = useState({
    title: photo.title || '',
    description: photo.description || '',
    location: photo.location || '',
    date: photo.date || '',
    camera: photo.camera || '',
    note: photo.note || '',
    custom: photo.custom || {},
  })
  const [saving, setSaving] = useState(false)

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  // Build info tags for display mode
  const infoTags = [
    photo.location,
    photo.date,
    photo.camera,
  ].filter(Boolean)

  const customEntries = Object.entries(photo.custom || {})

  return (
    <div className={`flex gap-4 p-3 rounded-lg border transition-colors ${isCover ? 'border-gray-900 dark:border-gray-400 bg-gray-50 dark:bg-gray-800' : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'}`}>
      {/* Sort buttons */}
      <div className="flex flex-col items-center justify-center gap-1 shrink-0">
        <button onClick={onMoveUp} disabled={index === 0} className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer disabled:cursor-default transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15" /></svg>
        </button>
        <span className="text-xs text-gray-300">{index + 1}</span>
        <button onClick={onMoveDown} disabled={index === total - 1} className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer disabled:cursor-default transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
        </button>
      </div>
      {/* Thumbnail */}
      <div className="relative shrink-0">
        <img src={photo.src} alt={photo.title} className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg" />
        {isCover && <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-gray-900 text-white text-[10px] rounded">Cover</span>}
      </div>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="text-xs text-gray-500">名称</span>
                <input value={form.title} onChange={(e) => update('title', e.target.value)} className={inputSmCls} />
              </label>
              <label className="block">
                <span className="text-xs text-gray-500">拍摄地点</span>
                <input value={form.location} onChange={(e) => update('location', e.target.value)} className={inputSmCls} placeholder="如：上海外滩" />
              </label>
            </div>
            <label className="block">
              <span className="text-xs text-gray-500">简介</span>
              <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={2} className={`${inputSmCls} resize-none`} />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="text-xs text-gray-500">拍摄日期</span>
                <input value={form.date} onChange={(e) => update('date', e.target.value)} className={inputSmCls} placeholder="如：2025-03-15" />
              </label>
              <label className="block">
                <span className="text-xs text-gray-500">相机/镜头</span>
                <input value={form.camera} onChange={(e) => update('camera', e.target.value)} className={inputSmCls} placeholder="如：Fuji X100V" />
              </label>
            </div>
            <label className="block">
              <span className="text-xs text-gray-500">作者寄语</span>
              <textarea value={form.note} onChange={(e) => update('note', e.target.value)} rows={2} className={`${inputSmCls} resize-none`} placeholder="拍摄时的心情、故事..." />
            </label>
            <CustomFieldsEditor fields={form.custom} onChange={(c) => update('custom', c)} />
            <div className="flex gap-2 pt-1">
              <button onClick={handleSave} disabled={saving} className="px-3 py-1 bg-gray-900 text-white rounded text-xs hover:bg-gray-800 disabled:opacity-50 transition-colors cursor-pointer">
                {saving ? '保存中...' : '保存'}
              </button>
              <button onClick={onEdit} className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200 transition-colors cursor-pointer">
                取消
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm font-medium text-gray-900 truncate">{photo.title || '未命名'}</p>
            {photo.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{photo.description}</p>}
            {infoTags.length > 0 && (
              <p className="text-xs text-gray-400 mt-1">{infoTags.join('  ')}</p>
            )}
            {photo.note && <p className="text-xs text-gray-400 mt-1 italic line-clamp-1">&ldquo;{photo.note}&rdquo;</p>}
            {customEntries.length > 0 && (
              <p className="text-xs text-gray-300 mt-1">
                {customEntries.map(([k, v]) => `${k}: ${v}`).join(' · ')}
              </p>
            )}
            <p className="text-xs text-gray-300 mt-1 truncate">{photo.src.split('/').pop()}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 shrink-0">
        <button onClick={onEdit} className="px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors cursor-pointer">
          {isEditing ? '收起' : '编辑'}
        </button>
        <button onClick={onDelete} className="px-3 py-1.5 text-xs bg-red-50 text-red-500 rounded hover:bg-red-100 transition-colors cursor-pointer">
          删除
        </button>
      </div>
    </div>
  )
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function AdminPanel() {
  const { locale, theme, toggleLocale, toggleTheme, mounted } = useSettings()
  const [profile, setProfile] = useState(null)
  const [collections, setCollections] = useState([])
  const [tab, setTab] = useState('collections')
  const router = useRouter()

  function fetchData() {
    fetch('/api/profile').then((r) => r.json()).then(setProfile)
    fetch('/api/collections').then((r) => r.json()).then(setCollections)
  }

  useEffect(() => {
    fetchData()
  }, [])

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center transition-colors">
        <p className="text-gray-400">{t(locale, 'loading')}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Header */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
              &larr; {t(locale, 'viewWebsite')}
            </a>
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{t(locale, 'admin')}</span>
          </div>
          <div className="flex items-center gap-3">
            {mounted && (
              <>
                <button onClick={toggleLocale} className="text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer px-2 py-1 rounded border border-gray-200 dark:border-gray-700">
                  {locale === 'zh' ? 'EN' : '中文'}
                </button>
                <button onClick={toggleTheme} className="text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer px-2 py-1 rounded border border-gray-200 dark:border-gray-700">
                  {theme === 'light' ? t(locale, 'darkMode') : t(locale, 'lightMode')}
                </button>
              </>
            )}
            <button onClick={handleLogout} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors cursor-pointer">
              {t(locale, 'logout')}
            </button>
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-6">
          <button
            onClick={() => setTab('collections')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              tab === 'collections'
                ? 'border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
            }`}
          >
            {t(locale, 'collectionManage')}
          </button>
          <button
            onClick={() => setTab('profile')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              tab === 'profile'
                ? 'border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
            }`}
          >
            {t(locale, 'profile')}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {tab === 'collections' ? (
          <CollectionManager collections={collections} onRefresh={fetchData} />
        ) : (
          <ProfileEditor profile={profile} onSave={(data) => setProfile(data)} />
        )}
      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-center">
        <a href="https://github.com/Cindy-Master/folio" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          Cindy 为爱制作
        </a>
      </div>
    </div>
  )
}

export function getServerSideProps(ctx) {
  const { isAuthenticated } = require('../../lib/auth')
  if (!isAuthenticated(ctx.req)) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    }
  }
  return { props: {} }
}
