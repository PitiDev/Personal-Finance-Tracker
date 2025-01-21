'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { ChevronLeft, ChevronRight, RefreshCw, LogOut, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { getDictionary } from '../../../../../get-dictionary';
import { Locale } from '../../../i18n-config';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

interface Transaction {
    transaction_id: number;
    user_id: number;
    account_id: number;
    category_id: number;
    amount: string;
    type: 'expense' | 'income';
    description: string;
    transaction_date: string;
    created_at: string;
    updated_at: string;
    category_name: string;
    category_type: string;
}

interface PaginationInfo {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

const API_URL = 'http://localhost:4000/api/transactions';

export default function TransactionsPage() {
    const router = useRouter();
    const params = useParams();
    const lang = params.lang as Locale;

    const { user, token, logout } = useAuthStore();
    const [dictionary, setDictionary] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>({
        total: 0,
        page: 1,
        limit: 10,
        total_pages: 1,
    });

    const fetchTransactions = useCallback(async (page: number) => {
        setIsLoading(true);
        console.log('Fetching transactions for page:', page);
        console.log('Using token:', token);
        try {
            const response = await axios.get(API_URL, {
                headers: { 'Authorization': `Bearer ${token}` },
                params: { page, limit: 10 },
            });

            console.log('API Response:', response.data);

            const { transactions, pagination } = response.data.data;
            setTransactions(transactions);
            setPagination(pagination);
        } catch (error) {
            console.error('Failed to fetch transactions', error);
            if (axios.isAxiosError(error)) {
                console.error('Axios Error Details:', {
                    response: error.response?.data,
                    status: error.response?.status,
                    headers: error.response?.headers,
                    request: error.request,
                    message: error.message,
                });
            } else {
                console.error('Unexpected Error:', error);
            }
            toast.error(dictionary.transactions?.fetchError || 'Failed to load transactions');
        } finally {
            setIsLoading(false);
        }
    }, [token, dictionary]);

    useEffect(() => {
        const initializeTransactionsPage = async () => {
            try {
                const dict = await getDictionary(lang);
                setDictionary(dict);

                await new Promise(resolve => setTimeout(resolve, 100));
                const { user, token } = useAuthStore.getState();
                if (!user || !token) {
                    router.push(`/${lang}/login`);
                } else {
                    fetchTransactions(1);
                }
            } catch (error) {
                console.error('Transactions page initialization failed:', error);
            }
        };

        initializeTransactionsPage();
    }, [lang, router, fetchTransactions]);

    const handleRefresh = () => {
        fetchTransactions(pagination.page);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= pagination.total_pages) {
            fetchTransactions(newPage);
        }
    };

    const handleLogout = () => {
        logout();
        router.push(`/${lang}/login`);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (isLoading || !dictionary.transactions) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-2">
                        <DollarSign className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {dictionary.transactions.title}
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
                            {dictionary.transactions.logout}
                        </button>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {dictionary.transactions.recentTransactions}
                        </h2>
                        <button
                            onClick={handleRefresh}
                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-3">{dictionary.transactions.date}</th>
                                    <th className="px-6 py-3">{dictionary.transactions.description}</th>
                                    <th className="px-6 py-3">{dictionary.transactions.category}</th>
                                    <th className="px-6 py-3">{dictionary.transactions.amount}</th>
                                    <th className="px-6 py-3">{dictionary.transactions.type}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction) => (
                                    <tr key={transaction.transaction_id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                        <td className="px-6 py-4">{formatDate(transaction.transaction_date)}</td>
                                        <td className="px-6 py-4">{transaction.description}</td>
                                        <td className="px-6 py-4">{transaction.category_name}</td>
                                        <td className="px-6 py-4">{parseFloat(transaction.amount).toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${transaction.type === 'income' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                }`}>
                                                {transaction.type}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-4">
                        <div className="text-sm text-gray-700 dark:text-gray-400">
                            Showing {transactions.length} of {pagination.total} transactions
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className="px-3 py-1 rounded bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 disabled:opacity-50"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-sm text-gray-700 dark:text-gray-400">
                                Page {pagination.page} of {pagination.total_pages}
                            </span>
                            <button
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page === pagination.total_pages}
                                className="px-3 py-1 rounded bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 disabled:opacity-50"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}