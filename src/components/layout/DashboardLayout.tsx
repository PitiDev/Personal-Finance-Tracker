'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import Sidebar from './Sidebar'
import { cn } from '@/lib/utils'

export default function DashboardLayout({
    children
}: {
    children: React.ReactNode
}) {
    const { user, token } = useAuthStore()
    const router = useRouter()
    const pathname = usePathname()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    // Listen to sidebar state changes
    const handleSidebarToggle = (isOpen: boolean) => {
        setIsSidebarOpen(isOpen)
    }

    useEffect(() => {
        const { user, token } = useAuthStore.getState()
        const isLoggedIn = !!user && !!token

        setIsAuthenticated(isLoggedIn)

        // if (!isLoggedIn && !pathname.includes('/login')) {
        //     router.push('/login')
        // }

    }, [pathname, router])

    if (!isAuthenticated) {
        return <div className="min-h-screen bg-gray-50 dark:bg-gray-900">{children}</div>
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar onToggle={handleSidebarToggle} />
            <main className={cn(
                "flex-1 transition-all duration-300 bg-gray-50 dark:bg-gray-900",
                isSidebarOpen ? "ml-64" : "ml-16",
                "md:px-0" // Add padding on desktop
            )}>
                <div className={cn(
                    "container mx-auto transition-all duration-300",
                    isSidebarOpen ? "max-w-[calc(100vw-256px)]" : "max-w-full"
                )}>
                    {children}
                </div>
            </main>
        </div>
    )
}