'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ThemeToggle } from '../components/layout/ThemeToggle'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { getDictionary } from '../../get-dictionary'
import { i18n, Locale } from '../../i18n-config'
import {
  LogIn,
  UserPlus,
  Wallet,
  PiggyBank,
  ArrowRight,
  Loader2
} from 'lucide-react'

interface Dictionary {
  appTitle: string
  appDescription: string
  login: string
  register: string
}

export default function Home({ lang }: { lang: Locale }) {
  const router = useRouter()
  const [dictionary, setDictionary] = useState<Dictionary>({
    appTitle: '',
    appDescription: '',
    login: '',
    register: ''
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDictionary = async () => {
      try {
        setIsLoading(true)
        const fetchedDictionary = await getDictionary(lang)
        setDictionary(fetchedDictionary)
      } catch (error) {
        console.error('Failed to fetch dictionary:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDictionary()
  }, [lang])

  useEffect(() => {
    const handleLanguageInit = () => {
      try {
        const storedLang = localStorage.getItem('lang')
        if (!storedLang) {
          localStorage.setItem('lang', i18n.defaultLocale)
          router.push(`/${i18n.defaultLocale}`)
        } else if (storedLang !== lang) {
          router.push(`/${storedLang}`)
        }
      } catch (error) {
        console.error('Failed to handle language initialization:', error)
        router.push(`/${i18n.defaultLocale}`)
      }
    }

    handleLanguageInit()
  }, [lang, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen font-lao flex items-center justify-center bg-white dark:bg-gray-900 transition-colors">
      <div className="absolute top-4 right-4 flex items-center space-x-4">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <div className="text-center px-4 max-w-2xl">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Wallet className="h-16 w-16 text-blue-500" />
            <PiggyBank className="h-8 w-8 text-green-500 absolute -right-4 -bottom-2 animate-bounce" />
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
          {dictionary.appTitle}
        </h1>

        <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
          {dictionary.appDescription}
        </p>

        <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center items-center">
          <Link
            href={`/${lang}/login`}
            className="group w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 
                     bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                     dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            <LogIn className="h-5 w-5 mr-2" />
            {dictionary.login}
            <ArrowRight className="h-5 w-5 ml-2 opacity-0 group-hover:opacity-100 
                                 transform translate-x-0 group-hover:translate-x-1 
                                 transition-all duration-200" />
          </Link>

          <Link
            href={`/${lang}/register`}
            className="group w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 
                     border-2 border-blue-500 text-blue-500 rounded-lg
                     hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 
                     dark:hover:bg-blue-900/20 transition-colors"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            {dictionary.register}
            <ArrowRight className="h-5 w-5 ml-2 opacity-0 group-hover:opacity-100 
                                 transform translate-x-0 group-hover:translate-x-1 
                                 transition-all duration-200" />
          </Link>
        </div>
      </div>
    </div>
  )
}