import { create } from 'zustand'
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware'
import { config } from '../config/config'
import apiClient from '../lib/api-client'

const API_BASE_URL = config.apiBaseUrl

interface User {
    id: number
    username: string
    email: string
}

interface AuthState {
    user: User | null
    token: string | null
    login: (email: string, password: string) => Promise<void>
    register: (username: string, email: string, password: string) => Promise<{ status: string; message: string } | undefined>
    logout: () => void
}

type AuthStore = ReturnType<typeof createAuthStore>

const createAuthStore = (set: any) => ({
    user: null,
    token: null,
    login: async (email: string, password: string) => {
        try {
            console.log('API URL:', `${API_BASE_URL}/users/login`)

            const response = await apiClient.post('/users/login', { email, password })
            const { status, data } = response.data
            if (status === 'success') {
                const { user, accessToken } = data
                set({ user, token: accessToken })
                return { user, token: accessToken }  // Explicitly return the state
            } else {
                throw new Error('Login failed')
            }
        } catch (error) {
            console.error('Login error:', error)
            throw error
        }
    },
    register: async (username: string, email: string, password: string) => {
        try {
            const response = await apiClient.post('/users/register', { username, email, password })
            const { status, message, data } = response.data
            if (status === 'success') {
                // Assuming the API also returns user data and token on successful registration
                // If not, you might need to perform a login action after registration
                if (data && data.user && data.accessToken) {
                    set({ user: data.user, token: data.accessToken })
                }
                return { status, message }
            } else {
                throw new Error(message || 'Registration failed')
            }
        } catch (error) {
            console.error('Registration error:', error)
            throw error
        }
    },
    logout: () => {
        set({ user: null, token: null })
    }
})

const persistConfig: PersistOptions<AuthState> = {
    name: 'auth-storage',
    storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? window.localStorage : undefined
    )
}

export const useAuthStore = create<AuthState>()(
    persist(createAuthStore, persistConfig)
)