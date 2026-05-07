import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { useSettings } from '../lib/useSettings'
import { t } from '../lib/i18n'

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
          {main && <img src={main.src} alt={main.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
        </div>
        <div className="relative overflow-hidden">
          {side1 && <img src={side1.src} alt={side1.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
        </div>
        <div className="relative overflow-hidden">
          {side2 && <img src={side2.src} alt={side2.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
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

function FilmStripRow({ collection, locale, onPhotoClick, photoIndexOffset }) {
  return (
    <div className="flex gap-0 items-stretch bg-[#111] rounded-lg overflow-hidden border border-[#222]">
      {/* Left info panel */}
      <div className="shrink-0 w-48 p-5 flex flex-col justify-center border-r border-[#222]">
        <p className="text-[#c9a84c] text-[10px] tracking-[3px] uppercase font-mono mb-1">{collection.title}</p>
        <h3 className="text-white text-lg font-bold tracking-wide mb-2" style={{ fontFamily: "'Georgia', serif" }}>
          {collection.title}
        </h3>
        <p className="text-[#666] text-[10px] font-mono mb-1">
          {collection.photos.length} {locale === 'zh' ? '张' : 'EXP'}
        </p>
        {collection.location && (
          <p className="text-[#555] text-[10px] font-mono mb-3">{collection.location}</p>
        )}
        <Link href={`/collections/${collection.slug}`} className="text-[#c9a84c] text-[10px] tracking-[2px] uppercase font-mono hover:text-[#e0c068] transition-colors">
          {locale === 'zh' ? '查看详情' : 'VIEW DETAILS'} &rarr;
        </Link>
      </div>

      {/* Film strip */}
      <div className="flex-1 film-strip">
        {/* Top sprocket label */}
        <div className="flex items-center h-[18px] px-2 relative z-[3]">
          <span className="text-[8px] text-[#666] font-mono tracking-[2px] uppercase ml-1">{collection.title}</span>
        </div>

        {/* Photos scroll */}
        <div className="film-strip-scroll">
          <div className="flex gap-[3px] px-1 pb-0">
            {collection.photos.map((photo, i) => (
              <div key={i} className="shrink-0 flex flex-col items-center">
                <span className="text-[7px] text-[#555] font-mono mb-[2px]">
                  {String(i + 1).padStart(3, '0')}
                </span>
                <img
                  src={photo.src}
                  alt={photo.title}
                  onClick={() => onPhotoClick(photoIndexOffset + i)}
                  className="w-[120px] h-[80px] object-cover cursor-pointer hover:brightness-110 transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom sprocket space */}
        <div className="h-[14px] relative z-[3]" />
      </div>
    </div>
  )
}

function FilmView({ collections, locale, onPhotoClick, allPhotos }) {
  let offset = 0

  return (
    <div className="bg-[#0a0a0a] -mx-4 sm:-mx-6 px-4 sm:px-6 py-10 rounded-xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[#666] text-[10px] tracking-[3px] uppercase font-mono mb-2">ANALOG ARCHIVE</p>
          <h2 className="text-white text-3xl font-bold mb-2" style={{ fontFamily: "'Georgia', serif" }}>
            {locale === 'zh' ? '胶卷档案' : 'Film Archive'}
          </h2>
          <p className="text-[#555] text-xs tracking-[1px] font-mono uppercase">
            {locale === 'zh' ? '胶片定格的瞬间' : 'A collection of moments, captured on film.'}
          </p>
        </div>
        <div className="border border-[#333] rounded px-4 py-3 text-center">
          <p className="text-[#666] text-[8px] tracking-[2px] uppercase font-mono">{locale === 'zh' ? '总帧数' : 'TOTAL FRAMES'}</p>
          <p className="text-white text-2xl font-bold font-mono">{allPhotos.length}</p>
          <p className="text-[#555] text-[9px] font-mono">{collections.length} {locale === 'zh' ? '卷' : 'ROLLS'}</p>
        </div>
      </div>

      {/* Film strips */}
      <div className="flex flex-col gap-4">
        {collections.map((col) => {
          const row = (
            <FilmStripRow
              key={col.id}
              collection={col}
              locale={locale}
              onPhotoClick={onPhotoClick}
              photoIndexOffset={offset}
            />
          )
          offset += col.photos.length
          return row
        })}
      </div>

      {/* Footer */}
      <div className="mt-10 text-center">
        <p className="text-[#333] text-[10px] tracking-[4px] uppercase font-mono">
          FILM IS NOT DEAD
        </p>
      </div>
    </div>
  )
}

export default function Home({ profile, collections }) {
  const { locale, theme, toggleLocale, toggleTheme, mounted } = useSettings()
  const [tab, setTab] = useState('collections')
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const allPhotos = collections.flatMap((c) => c.photos)

  const closeLightbox = () => setLightboxIndex(null)
  const goPrev = useCallback(() => { setLightboxIndex((i) => (i === 0 ? allPhotos.length - 1 : i - 1)) }, [allPhotos.length])
  const goNext = useCallback(() => { setLightboxIndex((i) => (i === allPhotos.length - 1 ? 0 : i + 1)) }, [allPhotos.length])

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

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800 sticky top-[65px] bg-white dark:bg-gray-950 z-40 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-8">
          <button onClick={() => setTab('photos')} className={`pb-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${tab === 'photos' ? 'border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100' : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}>
            {t(locale, 'photos')} {allPhotos.length}
          </button>
          <button onClick={() => setTab('collections')} className={`pb-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${tab === 'collections' ? 'border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100' : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}>
            {t(locale, 'collections')} {collections.length}
          </button>
          <button onClick={() => setTab('film')} className={`pb-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${tab === 'film' ? 'border-[#c9a84c] text-[#c9a84c]' : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}>
            {t(locale, 'filmView')}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {tab === 'collections' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((c) => <CollectionCard key={c.id} collection={c} locale={locale} />)}
          </div>
        ) : tab === 'film' ? (
          <FilmView
            collections={collections}
            locale={locale}
            allPhotos={allPhotos}
            onPhotoClick={(index) => setLightboxIndex(index)}
          />
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {allPhotos.map((photo, index) => (
              <img key={index} src={photo.src} alt={photo.title} onClick={() => setLightboxIndex(index)} className="w-full rounded-lg break-inside-avoid cursor-pointer photo-card" />
            ))}
          </div>
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
