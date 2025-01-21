'use client'

import { usePathname, useRouter } from 'next/navigation'
import { i18n } from '../../i18n-config'
import { useState, useEffect } from 'react'
import { Globe, ChevronDown } from 'lucide-react'

interface LanguageOption {
    value: string
    label: string
    font: string
}

const languageOptions: LanguageOption[] = [
    { value: 'lo', label: 'ລາວ', font: 'font-noto-lao' },
    { value: 'en', label: 'English', font: 'font-arial' },
    { value: 'th', label: 'ไทย', font: 'font-sarabun' },
    { value: 'jp', label: '日本語', font: 'font-noto-jp' }
]

const LanguageSwitcher = () => {
    const router = useRouter()
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => setMounted(true), [])

    const changeLanguage = (newLocale: string) => {
        const currentPath = pathname.split('/').slice(2).join('/') || '/'
        localStorage.setItem('lang', newLocale)
        router.push(`/${newLocale}${currentPath}`)
        setIsOpen(false)
    }

    const currentLocale = pathname.split('/')[1] || i18n.defaultLocale
    const currentLanguage = languageOptions.find(lang => lang.value === currentLocale)

    if (!mounted) {
        return (
            <div className="w-36 h-10 rounded-lg bg-transparent" />
        )
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-3 py-2 
                   bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
                   border border-gray-200 dark:border-gray-700 
                   hover:border-blue-500 dark:hover:border-blue-400
                   rounded-lg shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500 
                   transition-all duration-200"
                aria-label="Select language"
            >
                <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    <span className={`${currentLanguage?.font} text-gray-800 dark:text-gray-200`}>
                        {currentLanguage?.label}
                    </span>
                </div>
                <ChevronDown
                    className={`w-4 h-4 text-gray-600 dark:text-gray-300 transition-transform duration-200
                     ${isOpen ? 'transform rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="absolute mt-1 w-full py-1 
                      bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm
                      border border-gray-200 dark:border-gray-700 
                      rounded-lg shadow-lg 
                      transition-all duration-200 z-50">
                    {languageOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => changeLanguage(option.value)}
                            className={`${option.font} w-full px-3 py-2 text-left
                         text-gray-800 dark:text-gray-200
                         hover:bg-blue-50 dark:hover:bg-blue-900/30
                         ${currentLocale === option.value ? 'bg-blue-50 dark:bg-blue-900/30' : ''}
                         transition-colors duration-150`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default LanguageSwitcher