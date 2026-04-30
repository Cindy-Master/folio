import { useState, useEffect, useCallback } from 'react'

// Default values must match server-side render
const DEFAULT_LOCALE = 'zh'
const DEFAULT_THEME = 'light'

export function useSettings() {
  const [locale, setLocale] = useState(DEFAULT_LOCALE)
  const [theme, setTheme] = useState(DEFAULT_THEME)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') || DEFAULT_LOCALE
    const savedTheme = localStorage.getItem('theme') || DEFAULT_THEME
    setLocale(savedLocale)
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    setMounted(true)
  }, [])

  const toggleLocale = useCallback(() => {
    setLocale((prev) => {
      const next = prev === 'zh' ? 'en' : 'zh'
      localStorage.setItem('locale', next)
      return next
    })
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', next)
      document.documentElement.classList.toggle('dark', next === 'dark')
      return next
    })
  }, [])

  // Before mount, return defaults so SSR matches client initial render
  if (!mounted) {
    return {
      locale: DEFAULT_LOCALE,
      theme: DEFAULT_THEME,
      toggleLocale: () => {},
      toggleTheme: () => {},
      mounted: false,
    }
  }

  return { locale, theme, toggleLocale, toggleTheme, mounted }
}
