'use client'

import { usePathname, useRouter } from 'next/navigation'
import { i18n } from '../../i18n-config'
import { useState, useEffect } from 'react'

const LanguageSwitcher = () => {
    const router = useRouter()
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLocale = e.target.value
        const currentPath = pathname.split('/').slice(2).join('/') || '/'
        localStorage.setItem('lang', newLocale)
        router.push(`/${newLocale}${currentPath}`)
    }

    const currentLocale = pathname.split('/')[1] || i18n.defaultLocale

    if (!mounted) return null

    return (
        <select
            onChange={changeLanguage}
            defaultValue={currentLocale}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
        >
            <option value="lo" className="font-['Noto_Sans_Lao']">ລາວ</option>
            <option value="en" className="font-['Arial']">English</option>
            <option value="th" className="font-['Sarabun']">ไทย</option>
            <option value="jp" className="font-['Noto_Sans_JP']">日本語</option>
        </select>
    )
}

export default LanguageSwitcher