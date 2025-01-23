'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { useAuthStore } from '@/store/authStore';
import {
    Loader2,
    UserCircle2,
    Clock,
    LogOut,
    Mail,
    User,
    BarChart2,
    Tag,
    Calendar,
    Lock,
    Check,
    AlertCircle
} from 'lucide-react';
import { getDictionary } from '../../../../../get-dictionary';
import { Locale } from '../../../i18n-config';
import ChangePasswordModal from '@/components/ui/ModalChangePassword';

interface UserProfile {
    user_id: number;
    username: string;
    email: string;
    main_currency: string;
    created_at: string;
    transaction_count: number;
    custom_category_count: number;
}

interface AlertMessage {
    type: 'success' | 'error';
    message: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const params = useParams();
    const lang = params.lang as Locale;
    const { user, token, logout } = useAuthStore();
    const [dictionary, setDictionary] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedCurrency, setSelectedCurrency] = useState<string>('');
    const [alert, setAlert] = useState<AlertMessage | null>(null);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const initializePage = async () => {
            try {
                const dict = await getDictionary(lang);
                setDictionary(dict);

                const { user, token } = useAuthStore.getState();
                if (!user || !token) {
                    router.push(`/${lang}/login`);
                    return;
                }

                const response = await fetch('http://localhost:4000/api/users/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch profile');
                }

                const data = await response.json();
                setProfile(data.data);
                setSelectedCurrency(data.data.main_currency || '');
            } catch (error) {
                console.error('Profile initialization failed:', error);
                setError(error instanceof Error ? error.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        initializePage();
    }, [lang, router]);

    const handleCurrencyChange = async (newCurrency: string) => {
        try {
            setIsUpdating(true);
            const response = await fetch('http://localhost:4000/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    main_currency: newCurrency,
                    username: profile?.username,
                    email: profile?.email
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update currency');
            }

            setSelectedCurrency(newCurrency);
            if (profile) {
                setProfile({ ...profile, main_currency: newCurrency });
            }

            setAlert({
                type: 'success',
                message: 'Currency updated successfully'
            });

            // Auto-hide alert after 3 seconds
            setTimeout(() => setAlert(null), 3000);
        } catch (error) {
            console.error('Error updating currency:', error);
            setAlert({
                type: 'error',
                message: 'Failed to update currency'
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleLogout = () => {
        logout();
        router.push(`/${lang}/login`);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
                <div className="text-red-500 text-center">
                    <h2 className="text-2xl font-bold mb-2">Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-2">
                        <UserCircle2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Profile
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />

                    </div>
                </div>

                {profile && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Basic Information */}
                        <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-lg p-6 backdrop-blur-sm">
                            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
                                <User className="w-5 h-5 mr-2" />
                                Basic Information
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">Username</label>
                                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                                        {profile.username}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">Email</label>
                                    <div className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                                        <Mail className="w-4 h-4 mr-2 text-gray-500" />
                                        {profile.email}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">Member Since</label>
                                    <div className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                        {formatDate(profile.created_at)}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Currency
                                    </label>
                                    <select
                                        value={selectedCurrency}
                                        onChange={(e) => handleCurrencyChange(e.target.value)}
                                        disabled={isUpdating}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="" disabled>Select main currency</option>
                                        <option value="LAK">LAK</option>
                                        <option value="THB">THB</option>
                                        <option value="USD">USD</option>
                                        <option value="JPY">JPY</option>
                                    </select>
                                    {isUpdating && (
                                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Updating currency...
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={() => setIsChangePasswordModalOpen(true)}
                                        className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 
                                                 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                    >
                                        <Lock className="w-4 h-4 mr-2" />
                                        Change Password
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Account Statistics */}
                        <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-lg p-6 backdrop-blur-sm">
                            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
                                <BarChart2 className="w-5 h-5 mr-2" />
                                Account Statistics
                            </h2>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Clock className="w-8 h-8 text-blue-500 dark:text-blue-400 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Total Transactions
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {profile.transaction_count}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Tag className="w-8 h-8 text-green-500 dark:text-green-400 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Custom Categories
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {profile.custom_category_count}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <ChangePasswordModal
                isOpen={isChangePasswordModalOpen}
                onClose={() => setIsChangePasswordModalOpen(false)}
                onSuccess={() => {
                    // Handle success, e.g., update the UI or show a success message
                }}
            />
        </div>
    );
}