import '../styles/globals.css'
import Head from 'next/head'
import { useEffect } from 'react'

function MyApp({ Component, pageProps }) {
  // Apply saved theme on mount to prevent flash
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light'
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [])

  return (
    <>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <title>Folio</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
