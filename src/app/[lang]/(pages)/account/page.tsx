'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { useAuthStore } from '@/store/authStore'
import { AddAccountModal } from '@/components/ui/ModalAddAccount'
import { toast } from 'sonner'
import Swal from 'sweetalert2'

import {
    Loader2,
    LayoutDashboard,
    LogOut,
    Wallet,
    Building2,
    PlusCircle,
    ArrowUpRight,
    ArrowDownRight,
    AlertCircle,
    Trash2
} from 'lucide-react'
import { getDictionary } from '../../../../../get-dictionary'
import { Locale } from '../../../i18n-config'
import { DeleteAccountModal } from '@/components/ui/ModalDeleteAccount'

interface Account {
    account_id: number;
    user_id: number;
    account_name: string;
    account_type: string;
    balance: string;
    currency: string;
    is_active: number;
    created_at: string;
    updated_at: string;
    transaction_count: number;
    total_income: string | null;
    total_expenses: string | null;
}

interface NewAccount {
    account_name: string;
    account_type: string;
    initial_balance: number;
    currency: string;
}

const useAccountData = (token: string) => {
    const [data, setData] = useState<Account[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAccounts = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/accounts', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch accounts');
            }

            const result = await response.json();
            setData(result.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchAccounts();
        }
    }, [token]);

    return { data, error, isLoading, refetch: fetchAccounts };
};


// Utility function for currency formatting
const formatCurrency = (amount: string | null, currency: string) => {
    if (!amount) return '-';
    const num = parseFloat(amount);

    if (currency === 'LAK') {
        return new Intl.NumberFormat('lo-LA', {
            style: 'currency',
            currency: 'LAK',
            maximumFractionDigits: 0
        }).format(num);
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(num);
};


function AccountCard({ account, dictionary, onDelete }: {
    account: Account;
    dictionary: any;
    onDelete: (id: number) => void
}) {
    const getAccountIcon = () => {
        switch (account.account_type.toLowerCase()) {
            case 'bank':
                return <Building2 className="w-6 h-6" />;
            default:
                return <Wallet className="w-6 h-6" />;
        }
    };

    return (
        <div className="bg-white/80 dark:bg-gray-800/80 shadow-lg rounded-lg overflow-hidden backdrop-blur-sm
        transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400">
                            {getAccountIcon()}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {account.account_name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                                {dictionary.accountPage.accountTypes[account.account_type.toLowerCase()]}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => onDelete(account.account_id)}
                        className="p-2 text-gray-400 hover:text-red-500 dark:text-gray-500 
                     dark:hover:text-red-400 transition-colors rounded-lg
                     hover:bg-red-50 dark:hover:bg-red-900/20"
                        aria-label="Delete account"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>

                </div>

                <div className="mt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {dictionary.accountPage.accountSummary.currentBalance}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatCurrency(account.balance, account.currency)}
                    </p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                            <ArrowUpRight className="w-4 h-4 text-green-500" />
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {dictionary.accountPage.accountSummary.income}
                                </p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {formatCurrency(account.total_income, account.currency)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <ArrowDownRight className="w-4 h-4 text-red-500" />
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {dictionary.accountPage.accountSummary.expenses}
                                </p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {formatCurrency(account.total_expenses, account.currency)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-blue-500/20"></span>
                        {account.transaction_count} {dictionary.accountPage.accountSummary.transactions}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AccountsPage() {
    const router = useRouter();
    const params = useParams();
    const lang = params.lang as Locale;

    const { user, token, logout } = useAuthStore();
    const [dictionary, setDictionary] = useState<any>({});
    const { data: accounts, error: accountsError, isLoading: accountsLoading, refetch } = useAccountData(token || '');
    const [isLoading, setIsLoading] = useState(true);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const initializePage = async () => {
            try {
                const dict = await getDictionary(lang);
                setDictionary(dict);

                await new Promise(resolve => setTimeout(resolve, 100));
                const { user, token } = useAuthStore.getState();
                if (!user || !token) {
                    router.push(`/${lang}/login`);
                } else {
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Page initialization failed:', error);
            }
        };

        initializePage();
    }, [lang, router]);

    const handleLogout = () => {
        logout();
        router.push(`/${lang}/login`);
    };

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleAddAccount = async (accountData: NewAccount) => {
        try {
            const response = await fetch('http://localhost:4000/api/accounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(accountData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create account');
            }

            await refetch(); // Refresh the accounts list
        } catch (error) {
            console.error('Error creating account:', error);
            throw error; // Re-throw to be handled by the modal
        }
    };

    const handleDeleteClick = (account: Account) => {
        setAccountToDelete(account);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!accountToDelete) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`http://localhost:4000/api/accounts/${accountToDelete.account_id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            console.log('response delete: ', result.status);

            if (result.status === 'error') {
                // throw new Error('Failed to delete account');
                await Swal.fire({
                    customClass: {
                        popup: 'dark:bg-gray-800 dark:text-white',
                        confirmButton: 'bg-red-500 hover:bg-red-600',
                        cancelButton: 'bg-gray-500 hover:bg-gray-600'
                    },
                    icon: 'error',
                    title: dictionary.accountPage.deleteAccount.cannotDeleteTitle,
                    text: dictionary.accountPage.deleteAccount.transactionsExistError,
                });

                setDeleteModalOpen(false);
                return;
            }

            await refetch(); // Refresh the accounts list
            setDeleteModalOpen(false);
            setAccountToDelete(null);
            await Swal.fire({
                icon: 'success',
                customClass: {
                    popup: 'dark:bg-gray-800 dark:text-white',
                    confirmButton: 'bg-red-500 hover:bg-red-600',
                    cancelButton: 'bg-gray-500 hover:bg-gray-600'
                },
                title: dictionary.accountPage.deleteAccount.successMessage,
                text: dictionary.accountPage.deleteAccount.successMessage,
            });
        } catch (error) {
            console.error('Error deleting account:', error);
            toast.error('dictionary.accountPage.deleteAccount.cannotDeleteTitle', {

            });
        } finally {
            setIsDeleting(false);
        }
    };

    const calculateTotalBalance = (accounts: Account[]) => {
        // Group accounts by currency
        const balancesByCurrency: Record<string, number> = {};

        accounts.forEach(account => {
            const balance = parseFloat(account.balance || '0');

            // Initialize the currency group if it doesn't exist
            if (!balancesByCurrency[account.currency]) {
                balancesByCurrency[account.currency] = 0;
            }

            // Add to the appropriate currency group
            balancesByCurrency[account.currency] += balance;
        });

        return balancesByCurrency;
    };

    // In the component
    const totalBalancesByCurrency = calculateTotalBalance(accounts);



    if (isLoading || !dictionary.dashboard || accountsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
                <div className="flex flex-col items-center gap-2">
                    <Building2 className="w-8 h-8 text-blue-500 animate-bounce" />
                    <p className="text-gray-600 dark:text-gray-300 animate-pulse">Loading accounts...</p>
                </div>
            </div>
        );
    }

    const totalBalance = accounts?.reduce((sum, account) => {
        return sum + parseFloat(account.balance);
    }, 0);

    const handleDeleteAccount = (id: number) => {
        // Implement the delete logic here
        console.log(`Deleting account with id: ${id}`);
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-2">
                        <LayoutDashboard className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {dictionary.accountPage.title}
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        <button
                            onClick={() => router.push(`/${lang}/dashboard`)}
                            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg 
                                     hover:bg-blue-600 transition-colors"
                        >
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            {dictionary.accountPage.actions.dashboard}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg 
                                     hover:bg-red-600 transition-colors"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            {dictionary.accountPage.actions.logout}
                        </button>
                    </div>
                </div>

                {/* Total Balance Card */}
                <div className="mb-8">

                    <div className="bg-white/80 dark:bg-gray-800/80 shadow-lg rounded-lg p-6 backdrop-blur-sm">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">


                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900/50 dark:to-gray-800/50 
    border border-blue-100 dark:border-gray-700 
    shadow-lg rounded-2xl p-6 overflow-hidden relative">
                                {/* Decorative background effect */}
                                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 dark:bg-blue-400/10 
        rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl opacity-50"></div>

                                <div className="relative z-10 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
                                                {dictionary.accountPage.totalBalance.title}
                                            </h2>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {dictionary.accountPage.totalBalance.balancesAcrossAllAccounts}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => setIsAddModalOpen(true)}
                                            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg 
                hover:bg-blue-600 transition-colors over:bg-blue-600 transition-all duration-300 
                    hover:scale-110"
                                        >
                                            <PlusCircle className="w-5 h-5 mr-2" />
                                            {dictionary.accountPage.totalBalance.addAccount}
                                        </button>

                                    </div>

                                    <div className="grid gap-3">
                                        {Object.entries(totalBalancesByCurrency).map(([currency, total], index) => (
                                            <div
                                                key={currency}
                                                className={`flex items-center justify-between 
                        p-4 rounded-xl 
                        ${index % 2 === 0
                                                        ? 'bg-white/60 dark:bg-gray-800/60'
                                                        : 'bg-blue-50/50 dark:bg-blue-900/20'
                                                    }
                        hover:scale-[1.02] hover:shadow-md transition-all duration-300
                        transform origin-center`}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center
                            ${currency === 'LAK' ? 'bg-green-100 text-green-600' :
                                                            currency === 'USD' ? 'bg-blue-100 text-blue-600' :
                                                                currency === 'THB' ? 'bg-red-100 text-red-600' :
                                                                    'bg-gray-100 text-gray-600'}
                            dark:bg-opacity-20`}>
                                                        {currency === 'LAK' ? '₭' :
                                                            currency === 'USD' ? '$' :
                                                                currency === 'THB' ? '฿' :
                                                                    currency}
                                                    </div>
                                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                                        {currency} Total
                                                    </span>
                                                </div>
                                                <span className="text-xl font-bold 
                        text-gray-900 dark:text-white 
                        tracking-tight">
                                                    {formatCurrency(total.toString(), currency)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {accountsError && (
                    <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                        <div className="flex items-center">
                            <AlertCircle className="w-5 h-5 mr-2" />
                            {accountsError}
                        </div>
                    </div>
                )}

                {/* Accounts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {accounts?.map((account) => (
                        <AccountCard
                            key={account.account_id}
                            account={account}
                            dictionary={dictionary}
                            onDelete={() => handleDeleteClick(account)}
                        />
                    ))}
                </div>
            </div>

            <AddAccountModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddAccount}
                dictionary={dictionary.addAccountModal}
            />

            <DeleteAccountModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setAccountToDelete(null);
                }}
                onConfirm={handleDeleteConfirm}
                accountName={accountToDelete?.account_name || ''}
                isDeleting={isDeleting}
                dictionary={dictionary}
            />

        </div>



    );
}