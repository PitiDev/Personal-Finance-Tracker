'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useRouter, useParams } from 'next/navigation'
import { Locale } from '../../../i18n-config'
import { getDictionary } from '../../../../../get-dictionary'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [dictionary, setDictionary] = useState<any>({})
    const [pageLoading, setPageLoading] = useState(true)

    const { login } = useAuthStore()
    const router = useRouter()
    const params = useParams()
    const lang = params.lang as Locale

    useEffect(() => {
        async function loadDictionary() {
            try {
                const loadedDictionary = await getDictionary(lang)
                setDictionary(loadedDictionary)
            } catch (error) {
                console.error('Failed to load dictionary:', error)
            } finally {
                setPageLoading(false)
            }
        }
        loadDictionary()
    }, [lang])

    const validateForm = () => {
        let isValid = true
        setEmailError('')
        setPasswordError('')

        if (!email) {
            setEmailError(dictionary.emailRequired || 'Email is required')
            isValid = false
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError(dictionary.emailInvalid || 'Email is invalid')
            isValid = false
        }

        if (!password) {
            setPasswordError(dictionary.passwordRequired || 'Password is required')
            isValid = false
        } else if (password.length < 6) {
            setPasswordError(dictionary.passwordLength || 'Password must be at least 6 characters')
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
            router.push(`/${lang}/dashboard`)
        } catch (error) {
            console.error('Login failed:', error)
            setError(dictionary.loginError || 'Invalid email or password. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    if (pageLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
            <div className="w-full max-w-md p-4">
                <form
                    onSubmit={handleLogin}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-lg px-8 pt-6 pb-8 mb-4 transition-all"
                >
                    <div className="flex justify-center mb-6">
                        <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
                            <LogIn className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>

                    <h2 className="text-2xl text-center mb-6 text-gray-900 dark:text-white font-bold">
                        {dictionary.login || 'Login'}
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <div className="mb-4 relative">
                        <label
                            htmlFor="email"
                            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                        >
                            {dictionary.email || 'Email'}
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                                className={`pl-10 shadow appearance-none border rounded-lg w-full py-2 px-3 
                                          text-gray-700 dark:text-white bg-white dark:bg-gray-700 
                                          border-gray-300 dark:border-gray-600 
                                          focus:border-blue-500 dark:focus:border-blue-400 
                                          focus:ring-2 focus:ring-blue-500/20 outline-none 
                                          transition-all disabled:opacity-50 
                                          ${emailError ? 'border-red-500 focus:border-red-500' : ''}`}
                                placeholder={dictionary.enterEmail || 'Enter your email'}
                            />
                        </div>
                        {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                    </div>

                    <div className="mb-6 relative">
                        <label
                            htmlFor="password"
                            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                        >
                            {dictionary.password || 'Password'}
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                                className={`pl-10 pr-10 shadow appearance-none border rounded-lg w-full py-2 px-3 
                                          text-gray-700 dark:text-white bg-white dark:bg-gray-700 
                                          border-gray-300 dark:border-gray-600 
                                          focus:border-blue-500 dark:focus:border-blue-400 
                                          focus:ring-2 focus:ring-blue-500/20 outline-none 
                                          transition-all disabled:opacity-50
                                          ${passwordError ? 'border-red-500 focus:border-red-500' : ''}`}
                                placeholder={dictionary.enterPassword || 'Enter your password'}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 
                                         hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none
                                         disabled:opacity-50 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 
                                     text-white font-bold py-2 px-6 rounded-lg 
                                     dark:bg-blue-600 dark:hover:bg-blue-700 
                                     transition-all duration-200 
                                     disabled:opacity-70 disabled:cursor-not-allowed
                                     min-w-[144px]"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                    {dictionary.signingIn || 'Signing In...'}
                                </>
                            ) : (
                                <>
                                    <LogIn className="mr-2" size={20} />
                                    {dictionary.signIn || 'Sign In'}
                                </>
                            )}
                        </button>
                        <Link
                            href={`/${lang}/register`}
                            className={`inline-block align-baseline font-bold text-sm 
                                      text-blue-500 hover:text-blue-700 
                                      dark:text-blue-400 dark:hover:text-blue-300 
                                      transition-colors ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            {dictionary.createAccount || 'Create Account'}
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}