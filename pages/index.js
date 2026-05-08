import Link from 'next/link'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useSettings } from '../lib/useSettings'
import { t } from '../lib/i18n'

const PAGE_SIZE = 12

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

  const bg = lightBg ? 'bg-white' : 'bg-black'
  const txt = lightBg ? 'text-gray-800' : 'text-white/90'
  const muted = lightBg ? 'text-gray-500' : 'text-white/60'
  const faint = lightBg ? 'text-gray-400' : 'text-white/40'
  const btn = lightBg ? 'text-gray-400 hover:text-gray-800 hover:bg-gray-100' : 'text-white/70 hover:text-white hover:bg-white/10'
  const nav = lightBg ? 'bg-gray-200/50 hover:bg-gray-200' : 'bg-white/10 hover:bg-white/25'
  const stroke = lightBg ? '#333' : 'white'

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center lightbox-overlay transition-colors ${bg}`} onClick={onClose}>
      <button onClick={onClose} className={`absolute top-4 right-4 z-10 text-3xl leading-none cursor-pointer w-10 h-10 flex items-center justify-center rounded-full transition-colors ${btn}`}>&times;</button>
      <div className={`absolute top-4 left-1/2 -translate-x-1/2 text-sm font-medium tracking-wider ${muted}`}>{currentIndex + 1} / {photos.length}</div>
      <button onClick={(e) => { e.stopPropagation(); setLightBg((v) => !v) }} className={`absolute top-4 left-4 z-10 text-xs cursor-pointer px-2 py-1 rounded transition-colors ${lightBg ? 'bg-gray-200 text-gray-600' : 'bg-white/10 text-white/60'}`}>
        {lightBg ? 'B' : 'W'}
      </button>
      <button onClick={(e) => { e.stopPropagation(); onPrev() }} className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full transition-colors cursor-pointer ${nav}`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
      </button>
      <img src={photo.src} alt={photo.title} className="max-h-[90vh] max-w-[90vw] object-contain select-none lightbox-image" onClick={(e) => e.stopPropagation()} />
      <button onClick={(e) => { e.stopPropagation(); onNext() }} className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full transition-colors cursor-pointer ${nav}`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
      </button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center max-w-xl px-4">
        {photo.title && <p className={`text-sm font-medium ${txt}`}>{photo.title}</p>}
        {photo.description && <p className={`text-xs mt-1 ${muted}`}>{photo.description}</p>}
        {(photo.location || photo.date || photo.camera) && (
          <p className={`text-xs mt-1 ${faint}`}>{[photo.location, photo.date, photo.camera].filter(Boolean).join(' · ')}</p>
        )}
        {photo.note && <p className={`text-xs mt-1 italic ${faint}`}>&ldquo;{photo.note}&rdquo;</p>}
      </div>
    </div>
  )
}

function ProfileHeader({ profile, locale }) {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
      <div className="shrink-0">
        <img src={profile.avatar} alt={profile.name} className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-2 border-gray-100 dark:border-gray-700" />
      </div>
      <div className="text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">{profile.name}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 italic mb-2">&ldquo;{profile.quote}&rdquo;</p>
        {profile.bio && <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{profile.bio}</p>}
        {profile.email && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            <span className="mr-2 text-gray-400 dark:text-gray-500">{t(locale, 'email')}</span>{profile.email}
          </p>
        )}
        {profile.location && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            <span className="mr-2 text-gray-400 dark:text-gray-500">{t(locale, 'location')}</span>{profile.location}
          </p>
        )}
        {profile.website && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span className="mr-2 text-gray-400 dark:text-gray-500">{t(locale, 'website')}</span>
            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-300 underline hover:text-black dark:hover:text-white">
              {profile.website.replace(/^https?:\/\//, '')}
            </a>
          </p>
        )}
        <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
          <span className="font-semibold text-sm text-gray-700 dark:text-gray-300 mr-1 leading-7">{t(locale, 'interests')}</span>
          {profile.interests.map((tag) => (
            <span key={tag} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function CollectionCard({ collection, locale }) {
  const photos = collection.photos
  const main = photos[0]
  const side1 = photos[1]
  const side2 = photos[2]

  return (
    <Link href={`/collections/${collection.slug}`} className="group block">
      <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-[4/3] grid grid-cols-3 grid-rows-2 gap-0.5 collection-card">
        <div className="col-span-2 row-span-2 relative overflow-hidden">
          {main && <img src={main.src} alt={main.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
        </div>
        <div className="relative overflow-hidden">
          {side1 && <img src={side1.src} alt={side1.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
        </div>
        <div className="relative overflow-hidden">
          {side2 && <img src={side2.src} alt={side2.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
        </div>
      </div>
      <h3 className="mt-3 text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">{collection.title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {collection.photos.length} {t(locale, 'images')}
        {collection.description && ` · ${collection.description}`}
      </p>
      {(collection.location || collection.date) && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{[collection.location, collection.date].filter(Boolean).join(' · ')}</p>
      )}
    </Link>
  )
}

function useInfiniteScroll(total) {
  const [count, setCount] = useState(PAGE_SIZE)
  const loaderRef = useRef(null)

  useEffect(() => {
    const el = loaderRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setCount((c) => Math.min(c + PAGE_SIZE, total)) },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [total])

  // Reset when total changes (tab switch)
  useEffect(() => { setCount(PAGE_SIZE) }, [total])

  return { count, loaderRef, hasMore: count < total }
}

export default function Home({ profile, collections }) {
  const { locale, theme, toggleLocale, toggleTheme, mounted } = useSettings()
  const [tab, setTab] = useState('collections')
  const [viewMode, setViewMode] = useState('cards') // 'cards' | 'film'
  const [filmBg, setFilmBg] = useState('dark') // 'dark' | 'light'
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const allPhotos = collections.flatMap((c) => c.photos)

  const photoScroll = useInfiniteScroll(allPhotos.length)

  const closeLightbox = () => setLightboxIndex(null)
  const goPrev = useCallback(() => { setLightboxIndex((i) => (i === 0 ? allPhotos.length - 1 : i - 1)) }, [allPhotos.length])
  const goNext = useCallback(() => { setLightboxIndex((i) => (i === allPhotos.length - 1 ? 0 : i + 1)) }, [allPhotos.length])

  const isDarkFilm = filmBg === 'dark'
  const stripBg = isDarkFilm ? 'bg-gray-900' : 'bg-gray-100 dark:bg-gray-200'
  const holeBg = isDarkFilm ? 'bg-gray-700' : 'bg-gray-300'
  const numColor = isDarkFilm ? 'text-white/40' : 'text-gray-500'

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      {/* Nav */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-0 z-50 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{profile.name}</span>
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

      {/* Profile */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <ProfileHeader profile={profile} locale={locale} />
      </div>

      {/* Tabs + view controls */}
      <div className="border-b border-gray-200 dark:border-gray-800 sticky top-[65px] bg-white dark:bg-gray-950 z-40 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex gap-8">
            <button onClick={() => setTab('photos')} className={`pb-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${tab === 'photos' ? 'border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100' : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}>
              {t(locale, 'photos')} {allPhotos.length}
            </button>
            <button onClick={() => setTab('collections')} className={`pb-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${tab === 'collections' ? 'border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100' : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}>
              {t(locale, 'collections')} {collections.length}
            </button>
          </div>
          {/* View mode toggle - only on collections tab */}
          {tab === 'collections' && (
            <div className="flex items-center gap-2 pb-2">
              <div className="flex rounded border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button onClick={() => setViewMode('cards')} className={`px-2 py-1 text-[10px] cursor-pointer transition-colors ${viewMode === 'cards' ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                  {locale === 'zh' ? '卡片' : 'Cards'}
                </button>
                <button onClick={() => setViewMode('film')} className={`px-2 py-1 text-[10px] cursor-pointer transition-colors ${viewMode === 'film' ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                  {locale === 'zh' ? '胶卷' : 'Film'}
                </button>
              </div>
              {viewMode === 'film' && (
                <button onClick={() => setFilmBg(isDarkFilm ? 'light' : 'dark')} className="text-[10px] text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer px-1.5 py-1 rounded border border-gray-200 dark:border-gray-700 transition-colors">
                  {isDarkFilm ? (locale === 'zh' ? '白底' : 'Light') : (locale === 'zh' ? '黑底' : 'Dark')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {tab === 'collections' ? (
          viewMode === 'film' ? (
            /* Film strip view */
            <div className="flex flex-col gap-6">
              {collections.map((col) => {
                const offset = collections.slice(0, collections.indexOf(col)).reduce((s, c) => s + c.photos.length, 0)
                const holeCount = Math.max(col.photos.length * 2, 14)
                return (
                  <div key={col.id}>
                    <div className="flex items-baseline justify-between mb-2">
                      <Link href={`/collections/${col.slug}`} className="group flex items-baseline gap-2">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors">{col.title}</h3>
                        <span className="text-xs text-gray-400 dark:text-gray-500">{col.photos.length} {t(locale, 'images')}</span>
                      </Link>
                      {col.location && <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">{col.location}</span>}
                    </div>
                    <div className={`relative ${stripBg} rounded-lg overflow-hidden transition-colors`}>
                      <div className="flex justify-between px-3 py-[5px]">
                        {Array.from({ length: holeCount }).map((_, i) => <div key={i} className={`w-[6px] h-[4px] ${holeBg} rounded-[1px]`} />)}
                      </div>
                      <div className="overflow-x-auto film-strip-scroll">
                        <div className="flex gap-[6px] px-3 py-1 min-w-max">
                          {col.photos.map((photo, i) => (
                            <div key={i} className="shrink-0 relative group cursor-pointer" onClick={() => setLightboxIndex(offset + i)}>
                              <img src={photo.src} alt={photo.title} loading="lazy" className="w-[150px] h-[100px] sm:w-[180px] sm:h-[120px] object-cover rounded-[2px] group-hover:brightness-110 transition-all" />
                              <span className={`absolute bottom-1 right-1.5 text-[8px] font-mono ${numColor}`}>{String(i + 1).padStart(3, '0')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between px-3 py-[5px]">
                        {Array.from({ length: holeCount }).map((_, i) => <div key={i} className={`w-[6px] h-[4px] ${holeBg} rounded-[1px]`} />)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* Cards view */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((c) => <CollectionCard key={c.id} collection={c} locale={locale} />)}
            </div>
          )
        ) : (
          /* Photos tab with infinite scroll */
          <>
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {allPhotos.slice(0, photoScroll.count).map((photo, index) => (
                <img key={index} src={photo.src} alt={photo.title} loading="lazy" onClick={() => setLightboxIndex(index)} className="w-full rounded-lg break-inside-avoid cursor-pointer photo-card" />
              ))}
            </div>
            {photoScroll.hasMore && (
              <div ref={photoScroll.loaderRef} className="text-center py-8">
                <span className="text-sm text-gray-400">{locale === 'zh' ? '加载更多...' : 'Loading more...'}</span>
              </div>
            )}
          </>
        )}
      </div>

      {lightboxIndex !== null && <Lightbox photos={allPhotos} currentIndex={lightboxIndex} onClose={closeLightbox} onPrev={goPrev} onNext={goNext} />}
    </div>
  )
}

export function getServerSideProps() {
  const fs = require('fs')
  const path = require('path')
  const dataDir = path.join(process.cwd(), 'data')
  const profile = JSON.parse(fs.readFileSync(path.join(dataDir, 'profile.json'), 'utf-8'))
  const collections = JSON.parse(fs.readFileSync(path.join(dataDir, 'collections.json'), 'utf-8'))
  return { props: { profile, collections } }
}
