'use client'

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { useAuthStore } from '@/store/authStore';
import {
    Loader2,
    LogOut,
    BanknoteIcon,
    CircleDollarSign,
    Calendar,
    Mail,
    User,
    Building,
    Percent,
    Clock,
    Plus,
} from 'lucide-react';
import { getDictionary } from '../../../../../get-dictionary';
import { Locale } from '../../../i18n-config';
import AddLoanModal from '@/components/ui/ModalAddLoan';

interface Loan {
    loan_id: number;
    user_id: number;
    account_id: number;
    title: string;
    total_amount: string;
    currency: string;
    remaining_amount: string;
    interest_rate: string;
    loan_type: string;
    start_date: string;
    end_date: string;
    status: string;
    borrower_name: string;
    contact_info: string;
    description: string;
    created_at: string;
    updated_at: string;
    account_name: string;
    progress_percentage: string;
}

export default function LoanPage() {
    const router = useRouter();
    const params = useParams();
    const lang = params.lang as Locale;
    const { user, token, logout } = useAuthStore();
    const [dictionary, setDictionary] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);
    const [loans, setLoans] = useState<Loan[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const initializePage = async () => {
        try {
            const dict = await getDictionary(lang);
            setDictionary(dict);

            // Check authentication
            const { user, token } = useAuthStore.getState();
            if (!user || !token) {
                router.push(`/${lang}/login`);
                return;
            }

            // Fetch loans
            const response = await fetch('https://api.sabaimoney.com/api/loans', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch loans');
            }

            const data = await response.json();
            setLoans(data.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to initialize loan page:', error);
            setError(error instanceof Error ? error.message : 'An error occurred');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        initializePage();
    }, [lang, router]);

    const handleLogout = () => {
        logout();
        router.push(`/${lang}/login`);
    };

    const formatAmount = (amount: string) => {
        return new Intl.NumberFormat(lang, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(parseFloat(amount));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(lang, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-400';
            case 'completed':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-400';
            case 'overdue':
                return 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400';
        }
    };

    const getLoanTypeIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'borrowed':
                return <CircleDollarSign className="w-5 h-5 text-blue-500" />;
            case 'lent':
                return <CircleDollarSign className="w-5 h-5 text-green-500" />;
            default:
                return <BanknoteIcon className="w-5 h-5 text-gray-500" />;
        }
    };

    const handleClick = (loanId: number) => {
        router.push(`/${lang}/loan/${loanId}`);
    };


    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-2">
                        <BanknoteIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {dictionary.loans?.title || 'Loans'}
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        {/* <span className="text-gray-600 dark:text-gray-300 transition-colors">
                            {user?.username}
                        </span> */}
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            {dictionary.loans.actions.add}
                        </button>
                    </div>
                </div>

                {/* Loans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {loans.map((loan) => (
                        <div
                            key={loan.loan_id}
                            onClick={() => handleClick(loan.loan_id)}
                            className="bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-lg p-6 backdrop-blur-sm cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    {getLoanTypeIcon(loan.loan_type)}
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                            {loan.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                                            {dictionary.loans?.types[loan.loan_type]}
                                        </p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(loan.status)}`}>
                                    {loan.status}
                                </div>
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {loan.description}
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {dictionary.loans?.fields.totalAmount}
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {loan.currency}  {formatAmount(loan.total_amount)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {dictionary.loans?.fields.remainingAmount}
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {loan.currency} {formatAmount(loan.remaining_amount)}
                                    </p>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {dictionary.loans?.fields.progress}
                                    </span>
                                    <span className="text-gray-900 dark:text-white">
                                        {parseFloat(loan.progress_percentage).toFixed(1)}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${loan.progress_percentage}%`
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center">
                                    <Percent className="w-4 h-4 text-gray-400 mr-2" />
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {dictionary.loans?.fields.interestRate}
                                    </span>
                                    <span className="ml-2 text-gray-900 dark:text-white">
                                        {loan.interest_rate}%
                                    </span>
                                </div>

                                <div className="flex items-center">
                                    <Building className="w-4 h-4 text-gray-400 mr-2" />
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {dictionary.loans?.fields.account}
                                    </span>
                                    <span className="ml-2 text-gray-900 dark:text-white">
                                        {loan.account_name}
                                    </span>
                                </div>

                                <div className="flex items-center">
                                    <User className="w-4 h-4 text-gray-400 mr-2" />
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {dictionary.loans?.fields.borrower}
                                    </span>
                                    <span className="ml-2 text-gray-900 dark:text-white">
                                        {loan.borrower_name}
                                    </span>
                                </div>

                                <div className="flex items-center">
                                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {dictionary.loans?.fields.contact}
                                    </span>
                                    <span className="ml-2 text-gray-900 dark:text-white">
                                        {loan.contact_info}
                                    </span>
                                </div>

                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {dictionary.loans?.fields.period}
                                    </span>
                                    <span className="ml-2 text-gray-900 dark:text-white">
                                        {formatDate(loan.start_date)} - {formatDate(loan.end_date)}
                                    </span>
                                </div>

                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {dictionary.loans?.fields.lastUpdated}
                                    </span>
                                    <span className="ml-2 text-gray-900 dark:text-white">
                                        {formatDate(loan.updated_at)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {loans.length === 0 && !error && (
                    <div className="text-center py-12">
                        <BanknoteIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                            No Loans Found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            You currently don't have any active loans.
                        </p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-12">
                        <div className="text-red-500">
                            <h3 className="text-xl font-medium mb-2">Error</h3>
                            <p>{error}</p>
                        </div>
                    </div>
                )}
            </div>

            <AddLoanModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={() => {
                    setIsAddModalOpen(false);
                    initializePage();
                }}
                token={token!}
                dictionary={dictionary}
            />

        </div>
    );
}