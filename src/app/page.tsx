'use client'

import Link from 'next/link'
import { ThemeToggle } from '../components/layout/ThemeToggle'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { getDictionary } from '../../get-dictionary'
import { i18n, Locale } from '../../i18n-config'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function Home({ lang }: { lang: Locale }) {
  const router = useRouter()
  const [dictionary, setDictionary] = useState({
    appTitle: '',
    appDescription: '',
    login: '',
    register: ''
  })

  useEffect(() => {
    // Fetch dictionary on client-side
    async function fetchDictionary() {
      const fetchedDictionary = await getDictionary(lang)
      setDictionary(fetchedDictionary)
    }
    fetchDictionary()
  }, [lang])

  useEffect(() => {
    // Handle language storage on client-side
    const storedLang = localStorage.getItem('lang')
    if (!storedLang) {
      localStorage.setItem('lang', 'en')
      router.push(`/${i18n.defaultLocale}`)
    } else {
      router.push(`/${storedLang}`)
    }
  }, [])

  return (
    <div className="min-h-screen font-lao flex items-center justify-center bg-white dark:bg-gray-900 transition-colors">
      <div className="absolute top-4 right-4 flex items-center space-x-4">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
          {dictionary.appTitle}
        </h1>
        <p className="text-xl mb-6 text-gray-600 dark:text-gray-300">
          {dictionary.appDescription}
        </p>
        <div className="space-x-4">
          <Link
            href={`/${lang}/login`}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 
                       dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            {dictionary.login}
          </Link>
          <Link
            href={`/${lang}/register`}
            className="px-6 py-2 border border-blue-500 text-blue-500 rounded 
                       hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 
                       dark:hover:bg-blue-900/20 transition-colors"
          >
            {dictionary.register}
          </Link>
        </div>
      </div>
    </div>
  )
}