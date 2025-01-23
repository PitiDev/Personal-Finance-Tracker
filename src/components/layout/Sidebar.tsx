'use client'

import { useEffect, useState } from 'react'
import { useParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
    Users,
    FolderTree,
    Receipt,
    PieChart,
    Wallet,
    PiggyBank,
    BanknoteIcon,
    ArrowRightLeft,
    LogOut,
    Menu,
    ChevronLeft,
    Sun,
    Moon,
    Info
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { getDictionary } from '../../../get-dictionary'
import { Locale } from '../../../i18n-config'
import { useTheme } from 'next-themes'

interface SidebarProps {
    onToggle?: (isOpen: boolean) => void
}

const menuItems = [

    {
        key: "dashboard",
        icon: PieChart,
        href: "/dashboard"
    },

    {
        key: "categories",
        icon: FolderTree,
        href: "/categories"
    },
    {
        key: "transactions",
        icon: Receipt,
        href: "/transactions"
    },
    {
        key: "budgets",
        icon: PieChart,
        href: "/budgets"
    },
    {
        key: "account",
        icon: Wallet,
        href: "/account"
    },
    {
        key: "saving",
        icon: PiggyBank,
        href: "/saving"
    },
    {
        key: "loan",
        icon: BanknoteIcon,
        href: "/loan"
    },
    {
        key: "transferAmount",
        icon: ArrowRightLeft,
        href: "/transfer"
    },
    {
        key: "userManagement",
        icon: Users,
        href: "/users"
    },
    {
        key: "about",
        icon: Info,
        href: "/about"
    },
]

export default function Sidebar({ onToggle }: SidebarProps) {
    const pathname = usePathname()
    const params = useParams()
    const lang = params.lang as Locale
    const { user, logout } = useAuthStore()
    const [dictionary, setDictionary] = useState<any>({})
    const [isOpen, setIsOpen] = useState(true)
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Handle theme mounting
    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const loadDictionary = async () => {
            const dict = await getDictionary(lang)
            setDictionary(dict)
        }
        loadDictionary()
    }, [lang])

    useEffect(() => {
        onToggle?.(isOpen)
    }, [isOpen, onToggle])

    if (!user || !dictionary.sidebar) return null

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed top-4 z-50 p-2 rounded-lg",
                    "transition-all duration-300 ease-in-out",
                    "md:hidden",
                    isOpen ? "left-[240px]" : "left-4",
                    "bg-white dark:bg-gray-900",
                    "text-gray-900 dark:text-white",
                    "hover:bg-gray-100 dark:hover:bg-gray-800",
                )}
            >
                {isOpen ? <ChevronLeft size={24} /> : <Menu size={24} />}
            </button>

            {/* Desktop Toggle Button (shown when sidebar is collapsed) */}
            <button
                onClick={() => setIsOpen(true)}
                className={cn(
                    "fixed top-4 left-4 z-50 p-2 rounded-lg",
                    "transition-all duration-300 ease-in-out",
                    "hidden md:flex",
                    isOpen && "md:hidden",
                    "bg-white dark:bg-gray-900",
                    "text-gray-900 dark:text-white",
                    "hover:bg-gray-100 dark:hover:bg-gray-800",
                )}
            >
                <Menu size={24} />
            </button>

            {/* Mobile Overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/50 z-30 md:hidden",
                    "transition-opacity duration-300 ease-in-out",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-40 h-screen overflow-x-hidden",
                    "transition-[width] duration-300 ease-in-out",
                    isOpen ? "w-64" : "w-0 md:w-16",
                    "group",
                    "bg-white dark:bg-gray-900",
                )}
            >
                <div className={cn("flex flex-col h-full w-64")}>
                    {/* Header */}
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className={cn(
                                "text-xl font-bold whitespace-nowrap",
                                "transition-opacity duration-300 ease-in-out",
                                !isOpen && "opacity-0 group-hover:opacity-100",
                                "text-gray-900 dark:text-white"
                            )}>
                                {dictionary.sidebar.title}
                            </h1>
                            {/* Theme Toggle and Close Button Container */}
                            <div className="flex items-center gap-2">
                                {mounted && (
                                    <button
                                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                        className={cn(
                                            "p-1.5 rounded-lg",
                                            "text-gray-500 hover:text-gray-900",
                                            "dark:text-gray-400 dark:hover:text-white",
                                            "transition-colors duration-200",
                                            !isOpen && "opacity-0 hidden group-hover:opacity-100 group-hover:block"
                                        )}
                                    >
                                        {/* {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />} */}
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "hidden md:flex p-1.5 rounded-lg",
                                        "text-gray-500 hover:text-gray-900",
                                        "dark:text-gray-400 dark:hover:text-white",
                                        "transition-all duration-300 ease-in-out",
                                        !isOpen && "opacity-0"
                                    )}
                                >
                                    <ChevronLeft size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Navigation Menu */}
                        <nav className="space-y-1">
                            {menuItems.map((item, index) => {
                                const Icon = item.icon
                                const isActive = pathname === `/${lang}${item.href}`

                                return (
                                    <Link
                                        key={index}
                                        href={`/${lang}${item.href}`}
                                        className={cn(
                                            "flex items-center gap-3 py-2 px-4 rounded-lg",
                                            "transition-colors duration-300 ease-in-out",
                                            isActive
                                                ? "bg-gray-100 text-blue-600 dark:bg-gray-800 dark:text-blue-400"
                                                : "text-gray-600 dark:text-gray-400",
                                            "hover:bg-gray-100 dark:hover:bg-gray-800",
                                            "hover:text-gray-900 dark:hover:text-white"
                                        )}
                                        onClick={() => {
                                            if (window.innerWidth < 768) {
                                                setIsOpen(false)
                                            }
                                        }}
                                    >
                                        <Icon className="w-5 h-5 min-w-[20px]" />
                                        <span className={cn(
                                            "transition-opacity duration-300 ease-in-out whitespace-nowrap",
                                            !isOpen && "opacity-0 group-hover:opacity-100"
                                        )}>
                                            {dictionary.sidebar.menu[item.key]}
                                        </span>
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>

                    {/* Footer with Logout */}
                    <div className="mt-auto p-4">
                        <button
                            onClick={() => {
                                logout()
                                window.location.href = `/${lang}/login`
                            }}
                            className={cn(
                                "flex items-center gap-3 py-2 px-4 rounded-lg w-full",
                                "transition-colors duration-300 ease-in-out",
                                "text-red-600 dark:text-red-400",
                                "hover:bg-red-50 dark:hover:bg-red-900/20"
                            )}
                        >
                            <LogOut className="w-5 h-5 min-w-[20px]" />
                            <span className={cn(
                                "transition-opacity duration-300 ease-in-out whitespace-nowrap",
                                !isOpen && "opacity-0 group-hover:opacity-100"
                            )}>
                                {dictionary.sidebar.logout}
                            </span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )

}