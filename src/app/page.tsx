'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ThemeToggle } from '../components/layout/ThemeToggle'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { getDictionary } from '../../get-dictionary'
import { i18n, Locale } from '../../i18n-config'
import Image from 'next/image'
import {
  LogIn,
  UserPlus,
  Wallet,
  PiggyBank,
  ArrowRight,
  Loader2,
  Calculator,
  BarChart3,
  Menu,
  X,
  Play

} from 'lucide-react'
import { Footer, Navbar } from '@/components/Navigation'
import { useTheme } from 'next-themes'

interface Dictionary {
  appTitle: string
  appDescription: string
  login: string
  register: string
}

export default function Home({ lang }: { lang: Locale }) {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [dictionary, setDictionary] = useState<Dictionary>({
    appTitle: '',
    appDescription: '',
    login: '',
    register: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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


  const navigation = [
    { name: 'Home', href: `/${lang}` },
    { name: 'Features', href: `/${lang}/features` },
    { name: 'Pricing', href: `/${lang}/pricing` },
    { name: 'About Us', href: `/${lang}/about` },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="relative">
          <div className="relative w-32 h-32 sm:w-40">
            <Image
              src={theme === 'dark' ? '/logo_sabaimoney.png' : '/logo_sabaimoney_dark.png'}
              alt="Personal Finance Logo"
              fill
              className="object-contain animate-pulse"
              priority
            />
          </div>
          <BarChart3 className="h-8 w-8 text-green-500 absolute -right-4 -bottom-2 animate-bounce" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
      {/* Navigation */}
      <Navbar lang={lang} />

      {/* Main Content with Finance/AI Background */}
      <main className="flex-grow relative finance-ai-bg">
        {/* Background Elements */}
        <div className="finance-grid"></div>

        {/* Chart Lines */}
        <div className="chart-line"></div>
        <div className="chart-line"></div>
        <div className="chart-line"></div>

        {/* Binary Data Streams */}
        <div className="data-stream"></div>
        <div className="data-stream"></div>

        {/* Currency Symbols */}
        <div className="currency-symbols">
          <div className="currency-symbol text-2xl font-bold">$</div>
          <div className="currency-symbol text-2xl font-bold">₭</div>
          <div className="currency-symbol text-2xl font-bold">¥</div>
          <div className="currency-symbol text-2xl font-bold">₿</div>
        </div>

        {/* Neural Network */}
        <div className="neural-network">
          <div className="neural-connection"></div>
          <div className="neural-connection"></div>
          <div className="neural-connection"></div>
        </div>

        {/* Add this new gradient overlay */}
        <div className="gradient-overlay"></div>

        {/* Content Container */}
        <div className="relative z-10 flex items-center justify-center min-h-[calc(20vh-4rem)] px-4 py-16">
          <div className="text-center max-w-2xl">
            <div className="glass-content rounded-2xl p-8">
              <div className="flex justify-center mb-0">
                <div className="relative w-32 h-32 sm:w-40">
                  <Image
                    src={theme === 'dark' ? '/logo_sabaimoney.png' : '/logo_sabaimoney_dark.png'}
                    alt="Personal Finance Logo"
                    fill
                    className="object-contain"
                    priority
                  />
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
        </div>

        {/* // Add this section right after your hero section in the main content */}
        <div className="relative z-10 py-24 bg-gradient-to-b from-transparent via-white/70 to-white dark:via-gray-900/80 dark:to-gray-900">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Mobile App Preview */}
              <div className="lg:w-1/2 relative">
                <div className="relative w-[280px] h-[580px] mx-auto">
                  {/* Phone Frame */}
                  <div className="absolute inset-0 bg-gray-900 rounded-[1.5rem] border-8 border-gray-800 shadow-5xl overflow-hidden">
                    {/* App Screen Content */}
                    <div className="relative h-full bg-gradient-to-b from-blue-500 to-purple-600 p-5">
                      {/* Status Bar */}
                      <div className="flex justify-between text-white text-xs mb-8">
                        <span>9:41</span>
                        <div className="flex gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5z" />
                            <path d="M8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7z" />
                            <path d="M14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                          </svg>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414z" />
                            <path fillRule="evenodd" d="M14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414z" />
                            <path fillRule="evenodd" d="M12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415z" />
                          </svg>
                        </div>
                      </div>

                      {/* App Content Preview */}
                      <div className="space-y-4">
                        <div className="h-24 bg-white/20 rounded-xl animate-pulse"></div>
                        <div className="h-32 bg-white/20 rounded-xl animate-pulse delay-100"></div>
                        <div className="h-24 bg-white/20 rounded-xl animate-pulse delay-200"></div>
                      </div>
                    </div>
                  </div>

                  {/* Phone Notch */}
                  <div className="absolute top-0 inset-x-0 h-6 bg-gray-800 rounded-t-[3rem]">
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full"></div>
                  </div>
                </div>
                <h1 className='text-center pt-3 text-xl mb-8 text-gray-600 dark:text-gray-300'>Mobile App Coming Soon</h1>

                {/* Floating Elements */}
                <div className="absolute -top-8 -left-8 w-16 h-16 bg-blue-500 rounded-full blur-xl opacity-60 animate-pulse"></div>
                <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-purple-500 rounded-full blur-xl opacity-60 animate-pulse delay-300"></div>
              </div>


              {/* App Features */}
              <div className="lg:w-1/2 space-y-8">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Manage Your Finances On The Go
                </h2>

                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Take control of your financial future with our powerful mobile app. Track expenses, manage investments, and achieve your financial goals - all from your pocket.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Real-time Tracking</h3>
                      <p className="text-gray-600 dark:text-gray-300">Monitor your expenses and income in real-time with instant notifications.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Smart Analytics</h3>
                      <p className="text-gray-600 dark:text-gray-300">Get insights into your spending patterns with AI-powered analysis.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Secure & Private</h3>
                      <p className="text-gray-600 dark:text-gray-300">Your data is protected with bank-grade security and encryption.</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <a href="#" className="flex items-center px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">

                    App Store
                  </a>
                  <a href="#" className="flex items-center px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">

                    Play Store
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <Footer lang={lang} />


    </div>
  )
}