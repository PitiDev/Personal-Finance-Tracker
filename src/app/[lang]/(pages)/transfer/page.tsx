'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Loader2, RefreshCw, ArrowRightLeft, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { getDictionary } from '../../../../../get-dictionary'
import { Locale } from '../../../i18n-config'
import TransferForm from '@/components/transfers/TransferForm'
import TransferHistory from '@/components/transfers/TransferHistory'

export default function TransfersPage() {
    const router = useRouter()
    const params = useParams()
    const lang = params.lang as Locale

    const { user, token, logout } = useAuthStore()
    const [dictionary, setDictionary] = useState<any>({})
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const initializeTransfersPage = async () => {
            try {
                // Load dictionary
                const dict = await getDictionary(lang)
                setDictionary(dict)

                // Check authentication
                await new Promise(resolve => setTimeout(resolve, 100))
                const { user, token } = useAuthStore.getState()
                if (!user || !token) {
                    router.push(`/${lang}/login`)
                } else {
                    setIsLoading(false)
                }
            } catch (error) {
                console.error('Transfers page initialization failed:', error)
            }
        }

        initializeTransfersPage()
    }, [lang, router])

    const handleLogout = () => {
        logout()
        router.push(`/${lang}/login`)
    }

    if (isLoading || !dictionary.transfers) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-2">
                        <ArrowRightLeft className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {dictionary.transfers.title}
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        <span className="text-gray-600 dark:text-gray-300 transition-colors">
                            {user?.username}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            {dictionary.transfers.logout}
                        </button>
                    </div>
                </div>

                {/* Transfer Form and History */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <TransferForm dictionary={dictionary.transfers} />
                    <TransferHistory dictionary={dictionary.transfers} />
                </div>
            </div>
        </div>
    )
}