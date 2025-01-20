'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { useAuthStore } from '@/store/authStore'

export default function DashboardPage() {
    const router = useRouter()
    const { user, token, logout } = useAuthStore()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            // Wait a bit for the store to hydrate
            await new Promise(resolve => setTimeout(resolve, 100))
            const { user, token } = useAuthStore.getState()
            if (!user || !token) {
                router.push('/login')
            } else {
                setIsLoading(false)
            }
        }
        checkAuth()
    }, [router])

    const handleLogout = () => {
        logout()
        router.push('/login')
    }

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Dashboard
                    </h1>
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        <span className="text-gray-600 dark:text-gray-300 transition-colors">
                            Welcome, {user?.username}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                        Quick Overview
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <DashboardWidget title="Total Balance" value="$5,420.75" color="green" />
                        <DashboardWidget title="Monthly Income" value="$3,250.00" color="blue" />
                        <DashboardWidget title="Monthly Expenses" value="$2,180.50" color="red" />
                    </div>
                </div>

                {/* Placeholder for future components */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                        Recent Transactions
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Transaction list will be displayed here.
                    </p>
                </div>
            </div>
        </div>
    )
}

type WidgetColor = 'green' | 'blue' | 'red'

interface DashboardWidgetProps {
    title: string
    value: string
    color: WidgetColor
}

function DashboardWidget({ title, value, color }: DashboardWidgetProps) {
    const colorClasses: Record<WidgetColor, string> = {
        green: 'text-green-600 dark:text-green-400',
        blue: 'text-blue-600 dark:text-blue-400',
        red: 'text-red-600 dark:text-red-400',
    }

    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm transition-colors">
                {title}
            </h3>
            <p className={`text-2xl font-bold ${colorClasses[color]} transition-colors`}>
                {value}
            </p>
        </div>
    )
}