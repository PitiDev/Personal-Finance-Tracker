'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import Alert from '@/components/Alert'
import { Locale } from '../../../i18n-config'
import { Dictionary } from '@/types/dictionary'

interface RegisterFormProps {
    dictionary: {
        registering: string
        register: string
        alreadyHaveAccount: string
        allFieldsRequired: string
        passwordMinLength: string
        registrationFailed: string
    }
    lang: Locale
}

export default function RegisterForm({ dictionary, lang }: { dictionary: Dictionary; lang: Locale }) {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
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
            const response = await register(username, email, password)
            if (response && response.status === "success") {
                setSuccessMessage(response.message)
                setTimeout(() => {
                    router.push('/dashboard')
                }, 2000)
            } else {
                setError(dictionary.registrationFailed)
            }
        } catch (error) {
            console.error('Registration failed:', error)
            setError(dictionary.registrationFailed)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-colors">
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

            <div className="w-full max-w-md">
                <form
                    onSubmit={handleRegister}
                    className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4 transition-colors"
                >
                    <h2 className="text-2xl text-center mb-6 text-gray-900 dark:text-white">
                        {dictionary.createAccount}
                    </h2>

                    <div className="mb-4">
                        <label
                            htmlFor="username"
                            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 transition-colors"
                        >
                            {dictionary.username}
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700 dark:border-gray-600 transition-colors"
                            placeholder={dictionary.username}
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 transition-colors"
                        >
                            {dictionary.email}
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700 dark:border-gray-600 transition-colors"
                            placeholder={dictionary.email}
                        />
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="password"
                            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 transition-colors"
                        >
                            {dictionary.password}
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700 dark:border-gray-600 transition-colors"
                            placeholder={dictionary.password}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                            disabled={isLoading}
                        >
                            {isLoading ? dictionary.registering : dictionary.register}
                        </button>
                        <Link
                            href={`/${lang}/login`}
                            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-500 transition-colors"
                        >
                            {dictionary.alreadyHaveAccount}
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}