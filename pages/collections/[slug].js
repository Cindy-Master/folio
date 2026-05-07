import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { useSettings } from '../../lib/useSettings'
import { t } from '../../lib/i18n'

function Lightbox({ photos, currentIndex, onClose, onPrev, onNext }) {
  const photo = photos[currentIndex]
  const [lightBg, setLightBg] = useState(false)

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'b' || e.key === 'B') setLightBg((v) => !v)
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrev, onNext])

  const bgClass = lightBg ? 'bg-white' : 'bg-black/90'
  const textClass = lightBg ? 'text-gray-800' : 'text-white/90'
  const textMuted = lightBg ? 'text-gray-500' : 'text-white/60'
  const textFaint = lightBg ? 'text-gray-400' : 'text-white/40'
  const btnClass = lightBg ? 'text-gray-400 hover:text-gray-800 hover:bg-gray-100' : 'text-white/70 hover:text-white hover:bg-white/10'
  const navClass = lightBg ? 'bg-gray-200/50 hover:bg-gray-200' : 'bg-white/10 hover:bg-white/25'
  const navStroke = lightBg ? '#333' : 'white'

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center lightbox-overlay transition-colors ${bgClass}`} onClick={onClose}>
      {/* Close */}
      <button onClick={onClose} className={`absolute top-4 right-4 z-10 text-3xl leading-none cursor-pointer w-10 h-10 flex items-center justify-center rounded-full transition-colors ${btnClass}`}>&times;</button>

      {/* Counter */}
      <div className={`absolute top-4 left-1/2 -translate-x-1/2 text-sm font-medium tracking-wider ${textMuted}`}>{currentIndex + 1} / {photos.length}</div>

      {/* Background toggle */}
      <button
        onClick={(e) => { e.stopPropagation(); setLightBg((v) => !v) }}
        className={`absolute top-4 left-4 z-10 text-xs cursor-pointer px-2 py-1 rounded transition-colors ${lightBg ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
      >
        {lightBg ? 'B' : 'W'}
      </button>

      {/* Prev */}
      <button onClick={(e) => { e.stopPropagation(); onPrev() }} className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full transition-colors cursor-pointer ${navClass}`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={navStroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
      </button>

      {/* Image */}
      <img src={photo.src} alt={photo.title} className="max-h-[90vh] max-w-[90vw] object-contain select-none lightbox-image" onClick={(e) => e.stopPropagation()} />

      {/* Next */}
      <button onClick={(e) => { e.stopPropagation(); onNext() }} className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full transition-colors cursor-pointer ${navClass}`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={navStroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
      </button>

      {/* Photo info */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center max-w-xl px-4">
        {photo.title && <p className={`text-sm font-medium ${textClass}`}>{photo.title}</p>}
        {photo.description && <p className={`text-xs mt-1 ${textMuted}`}>{photo.description}</p>}
        {(photo.location || photo.date || photo.camera) && (
          <p className={`text-xs mt-1 ${textFaint}`}>{[photo.location, photo.date, photo.camera].filter(Boolean).join(' · ')}</p>
        )}
        {photo.note && <p className={`text-xs mt-1 italic ${textFaint}`}>&ldquo;{photo.note}&rdquo;</p>}
      </div>
    </div>
  )
}

function FilmStripView({ photos, filmBg, onPhotoClick }) {
  const isDark = filmBg === 'dark'
  const stripBg = isDark ? 'bg-gray-900' : 'bg-gray-100'
  const holeBg = isDark ? 'bg-gray-700' : 'bg-gray-300'
  const numColor = isDark ? 'text-white/40' : 'text-gray-400'
  const holeCount = Math.max(photos.length * 2, 12)

  return (
    <div className={`relative ${stripBg} rounded-lg overflow-hidden`}>
      {/* Top sprocket holes */}
      <div className="flex justify-between px-3 py-[5px]">
        {Array.from({ length: holeCount }).map((_, i) => (
          <div key={i} className={`w-[6px] h-[4px] ${holeBg} rounded-[1px]`} />
        ))}
      </div>

      {/* Photos */}
      <div className="overflow-x-auto film-strip-scroll">
        <div className="flex gap-[6px] px-3 py-1 min-w-max">
          {photos.map((photo, i) => (
            <div key={i} className="shrink-0 relative group cursor-pointer" onClick={() => onPhotoClick(i)}>
              <img
                src={photo.src}
                alt={photo.title}
                className="w-[150px] h-[100px] sm:w-[180px] sm:h-[120px] object-cover rounded-[2px] group-hover:brightness-110 transition-all"
              />
              <span className={`absolute bottom-1 right-1.5 text-[8px] font-mono ${numColor}`}>
                {String(i + 1).padStart(3, '0')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom sprocket holes */}
      <div className="flex justify-between px-3 py-[5px]">
        {Array.from({ length: holeCount }).map((_, i) => (
          <div key={i} className={`w-[6px] h-[4px] ${holeBg} rounded-[1px]`} />
        ))}
      </div>
    </div>
  )
}

export default function CollectionPage({ collection, profile }) {
  const { locale, theme, toggleLocale, toggleTheme, mounted } = useSettings()
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'film'
  const [filmBg, setFilmBg] = useState('dark') // 'dark' | 'light'

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

      {/* Collection header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <div className="flex items-start justify-between">
          <div>
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

          {/* View controls */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 text-xs cursor-pointer transition-colors ${viewMode === 'grid' ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                {locale === 'zh' ? '网格' : 'Grid'}
              </button>
              <button
                onClick={() => setViewMode('film')}
                className={`px-3 py-1.5 text-xs cursor-pointer transition-colors ${viewMode === 'film' ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                {locale === 'zh' ? '胶卷' : 'Film'}
              </button>
            </div>
            {viewMode === 'film' && (
              <button
                onClick={() => setFilmBg(filmBg === 'dark' ? 'light' : 'dark')}
                className="text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700"
              >
                {filmBg === 'dark' ? (locale === 'zh' ? '白底' : 'Light') : (locale === 'zh' ? '黑底' : 'Dark')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Photo content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        {viewMode === 'film' ? (
          <FilmStripView photos={collection.photos} filmBg={filmBg} onPhotoClick={openLightbox} />
        ) : (
          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {collection.photos.map((photo, index) => (
              <img key={index} src={photo.src} alt={photo.title} onClick={() => openLightbox(index)} className="w-full rounded-lg break-inside-avoid cursor-pointer photo-card" />
            ))}
          </div>
        )}
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
