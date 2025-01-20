'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { Locale } from '../../../i18n-config'


export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuthStore()
    const router = useRouter()
    const getLang = localStorage.getItem('lang')

    const validateForm = () => {
        let isValid = true
        setEmailError('')
        setPasswordError('')

        if (!email) {
            setEmailError('Email is required')
            isValid = false
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Email is invalid')
            isValid = false
        }

        if (!password) {
            setPasswordError('Password is required')
            isValid = false
        } else if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters')
            isValid = false
        }

        return isValid
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return
        setError('')
        setIsLoading(true)
        try {
            await login(email, password)
            console.log("login successful: ", getLang)
            // You can add a success message here if you want
            // setSuccessMessage('Login successful!')
            router.push(`/${getLang}/dashboard`)
        } catch (error) {
            console.error('Login failed:', error)
            setError('Invalid email or password. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
            <div className="w-full max-w-md">
                <form
                    onSubmit={handleLogin}
                    className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4"
                >
                    <h2 className="text-2xl text-center mb-6 text-gray-900 dark:text-white">
                        Login
                    </h2>

                    {error && (
                        <div className="mb-4 text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700 dark:border-gray-600 ${emailError ? 'border-red-500' : ''
                                }`}
                            placeholder="Enter your email"
                        />
                        {emailError && <p className="text-red-500 text-xs italic">{emailError}</p>}
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="password"
                            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700 dark:border-gray-600 ${passwordError ? 'border-red-500' : ''
                                }`}
                            placeholder="Enter your password"
                        />
                        {passwordError && <p className="text-red-500 text-xs italic">{passwordError}</p>}
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                        <Link
                            href="/register"
                            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                        >
                            Create Account
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}