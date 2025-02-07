import { create } from 'zustand'
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware'
import { config } from '../config/config'
import apiClient from '../lib/api-client'

const API_BASE_URL = config.apiBaseUrl

// Response types
interface ApiResponse<T> {
    status: 'success' | 'error'
    message?: string
    data?: T
}

interface LoginResponse {
    user: User
    accessToken: string
}

interface RegisterResponse {
    user: User
    accessToken: string
}

// User interface
interface User {
    id: number
    username: string
    main_currency: string
    email: string
}

// Auth state interface
interface AuthState {
    user: User | null
    token: string | null
    login: (email: string, password: string) => Promise<{ user: User; token: string }>
    register: (username: string, email: string, main_currency: string, password: string) => Promise<{ status: string; message: string }>
    logout: () => void
}

// Auth store creation
const createAuthStore = (set: any) => ({
    user: null,
    token: null,

    login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
        try {
            const response = await apiClient.post<ApiResponse<LoginResponse>>('/users/login', {
                email,
                password
            })

            const { status, data } = response.data

            if (status === 'success' && data) {
                const { user, accessToken } = data
                set({ user, token: accessToken })
                return { user, token: accessToken }
            }

            throw new Error('Login failed: Invalid response from server')
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Login failed: ${error.message}`)
            }
            throw new Error('Login failed: An unexpected error occurred')
        }
    },

    register: async (
        username: string,
        email: string,
        main_currency: string,
        password: string
    ): Promise<{ status: string; message: string }> => {
        try {
            const response = await apiClient.post<ApiResponse<RegisterResponse>>('/users/register', {
                username,
                email,
                main_currency,
                password
            })

            const { status, message, data } = response.data

            if (status === 'success' && data) {
                set({ user: data.user, token: data.accessToken })
                return { status, message: message || 'Registration successful' }
            }

            throw new Error(message || 'Registration failed: Invalid response from server')
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Registration failed: ${error.message}`)
            }
            throw new Error('Registration failed: An unexpected error occurred')
        }
    },

    logout: () => {
        set({ user: null, token: null })
    }
})

// Persist configuration
const persistConfig: PersistOptions<AuthState> = {
    name: 'auth-storage',
    storage: createJSONStorage(() => window.localStorage),
    // Optionally add partialize to only persist certain fields
    partialize: (state) => ({
        user: state.user,
        token: state.token,
        login: state.login,
        register: state.register,
        logout: state.logout
    })
}

// Create and export the store
export const useAuthStore = create<AuthState>()(
    persist(createAuthStore, persistConfig)
)