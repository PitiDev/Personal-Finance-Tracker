import { useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '../components/layout/ThemeToggle'
import LanguageSwitcher from './LanguageSwitcher'
import { Wallet, Menu, X } from 'lucide-react'
import { getDictionary } from '../../get-dictionary'
import { i18n, Locale } from '../../i18n-config'

interface NavbarProps {
  lang: Locale;
}

export function Navbar({ lang }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: 'Home', href: `/${lang}` },
    { name: 'Features', href: `/${lang}/features` },
    { name: 'Pricing', href: `/${lang}/pricing` },
    { name: 'About Us', href: `/${lang}/about` },
  ]

  return (
    <nav className="fixed w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href={`/${lang}`} className="flex items-center">
              <Wallet className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                FinanceTracker
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-500 
                         dark:hover:text-blue-400 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block px-3 py-2 text-gray-600 dark:text-gray-300 
                       hover:text-blue-500 dark:hover:text-blue-400 
                       hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md
                       transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

export function Footer({ lang }: NavbarProps) {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Company
            </h3>
            <div className="mt-4 space-y-4">
              <Link
                href={`/${lang}/about`}
                className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white block"
              >
                About Us
              </Link>
              <Link
                href={`/${lang}/features`}
                className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white block"
              >
                Features
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Legal
            </h3>
            <div className="mt-4 space-y-4">
              <Link
                href={`/${lang}/privacy`}
                className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white block"
              >
                Privacy
              </Link>
              <Link
                href={`/${lang}/terms`}
                className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white block"
              >
                Terms
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Security
            </h3>
            <div className="mt-4 space-y-4">
              <Link
                href={`/${lang}/security`}
                className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white block"
              >
                Security Center
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Resources
            </h3>
            <div className="mt-4 space-y-4">
              <a
                href="https://github.com/PitiDev/Personal-Finance-Tracker"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white block"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-8 text-center">
          <p className="text-base text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} FinanceTracker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}