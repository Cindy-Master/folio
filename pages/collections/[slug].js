import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { useSettings } from '../../lib/useSettings'
import { t } from '../../lib/i18n'

function Lightbox({ photos, currentIndex, onClose, onPrev, onNext }) {
  const photo = photos[currentIndex]

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrev, onNext])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 lightbox-overlay" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 z-10 text-white/70 hover:text-white text-3xl leading-none cursor-pointer w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">&times;</button>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium tracking-wider">{currentIndex + 1} / {photos.length}</div>
      <button onClick={(e) => { e.stopPropagation(); onPrev() }} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 transition-colors cursor-pointer">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
      </button>
      <img src={photo.src} alt={photo.title} className="max-h-[90vh] max-w-[90vw] object-contain select-none lightbox-image" onClick={(e) => e.stopPropagation()} />
      <button onClick={(e) => { e.stopPropagation(); onNext() }} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 transition-colors cursor-pointer">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
      </button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center max-w-xl px-4">
        {photo.title && <p className="text-white/90 text-sm font-medium">{photo.title}</p>}
        {photo.description && <p className="text-white/60 text-xs mt-1">{photo.description}</p>}
        {(photo.location || photo.date || photo.camera) && (
          <p className="text-white/40 text-xs mt-1">{[photo.location, photo.date, photo.camera].filter(Boolean).join(' · ')}</p>
        )}
        {photo.note && <p className="text-white/50 text-xs mt-1 italic">&ldquo;{photo.note}&rdquo;</p>}
      </div>
    </div>
  )
}

export default function CollectionPage({ collection, profile }) {
  const { locale, theme, toggleLocale, toggleTheme, mounted } = useSettings()
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const openLightbox = (index) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const goPrev = useCallback(() => { setLightboxIndex((i) => (i === 0 ? collection.photos.length - 1 : i - 1)) }, [collection.photos.length])
  const goNext = useCallback(() => { setLightboxIndex((i) => (i === collection.photos.length - 1 ? 0 : i + 1)) }, [collection.photos.length])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-0 z-50 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-sm">
              &larr; {t(locale, 'back')}
            </Link>
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{profile.name}</span>
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
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{collection.title}</h1>
        {collection.description && <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">{collection.description}</p>}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400 dark:text-gray-500">
          <span>{collection.photos.length} {t(locale, 'photos').toLowerCase()}</span>
          {collection.location && <span>{collection.location}</span>}
          {collection.date && <span>{collection.date}</span>}
          {Object.entries(collection.custom || {}).map(([k, v]) => (
            <span key={k}>{k}: {v}</span>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {collection.photos.map((photo, index) => (
            <img key={index} src={photo.src} alt={photo.title} onClick={() => openLightbox(index)} className="w-full rounded-lg break-inside-avoid cursor-pointer photo-card" />
          ))}
        </div>
      </div>

      {lightboxIndex !== null && <Lightbox photos={collection.photos} currentIndex={lightboxIndex} onClose={closeLightbox} onPrev={goPrev} onNext={goNext} />}
    </div>
  )
}

export function getServerSideProps({ params }) {
  const fs = require('fs')
  const path = require('path')
  const dataDir = path.join(process.cwd(), 'data')
  const profile = JSON.parse(fs.readFileSync(path.join(dataDir, 'profile.json'), 'utf-8'))
  const collections = JSON.parse(fs.readFileSync(path.join(dataDir, 'collections.json'), 'utf-8'))
  const collection = collections.find((c) => c.slug === params.slug)
  if (!collection) { return { notFound: true } }
  return { props: { collection, profile } }
}
