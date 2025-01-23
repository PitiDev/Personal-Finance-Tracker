'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import Alert from '@/components/Alert'
import { Locale } from '../../../i18n-config'
import { Dictionary } from '@/types/dictionary'
import { Loader2, UserPlus, Mail, Lock, User } from 'lucide-react'

export default function RegisterForm({ dictionary, lang }: { dictionary: Dictionary; lang: Locale }) {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [selectedCurrency, setSelectedCurrency] = useState('')
    const [currencies, setCurrencies] = useState([])
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { register } = useAuthStore()
    const router = useRouter()

    const validateForm = () => {
        if (!username || !email || !password) {
            setError(dictionary.allFieldsRequired)
            return false
        }
        if (password.length < 6) {
            setError(dictionary.passwordMinLength)
            return false
        }
        return true
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccessMessage('')

        if (!validateForm()) return

        setIsLoading(true)
        try {
            await register(username, email, selectedCurrency, password)
            setSuccessMessage('Registration successful')
            setTimeout(() => {
                router.push('/dashboard')
            }, 2000)
        } catch (error) {
            console.error('Registration failed:', error)
            setError(dictionary.registrationFailed)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
            <div className="w-full max-w-md p-4">
                {/* Alerts */}
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-sm">
                    {successMessage && (
                        <Alert
                            message={successMessage}
                            type="success"
                            onClose={() => setSuccessMessage('')}
                        />
                    )}
                    {error && (
                        <Alert
                            message={error}
                            type="error"
                            onClose={() => setError('')}
                        />
                    )}
                </div>

                <form
                    onSubmit={handleRegister}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-lg px-8 pt-6 pb-8 mb-4 transition-all"
                >
                    <div className="flex justify-center mb-6">
                        <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
                            <UserPlus className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>

                    <h2 className="text-2xl text-center mb-6 text-gray-900 dark:text-white font-bold">
                        {dictionary.createAccount}
                    </h2>

                    <div className="mb-4 relative">
                        <label
                            htmlFor="username"
                            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                        >
                            {dictionary.username}
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="pl-10 shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                placeholder={dictionary.username}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="mb-4 relative">
                        <label
                            htmlFor="email"
                            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                        >
                            {dictionary.email}
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="pl-10 shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                placeholder={dictionary.email}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="mb-4 relative">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {dictionary.mainCurrency}
                        </label>
                        <select
                            value={selectedCurrency}
                            onChange={(e) => setSelectedCurrency(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="" disabled> {dictionary.mainCurrency}</option>
                            <option value="LAK">LAK</option>
                            <option value="THB">THB</option>
                            <option value="USD">USD</option>
                            <option value="JPY">JPY</option>
                        </select>
                    </div>

                    <div className="mb-6 relative">
                        <label
                            htmlFor="password"
                            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                        >
                            {dictionary.password}
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="pl-10 shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                placeholder={dictionary.password}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg dark:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed min-w-[120px]"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                    {dictionary.registering}
                                </>
                            ) : (
                                dictionary.register
                            )}
                        </button>
                        <Link
                            href={`/${lang}/login`}
                            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        >
                            {dictionary.alreadyHaveAccount}
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}