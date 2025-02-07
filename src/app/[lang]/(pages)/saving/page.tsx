'use client'
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { useAuthStore } from '@/store/authStore';
import {
    Loader2,
    PiggyBank,
    LogOut,
    Plus,
    Target,
    Calendar,
    DollarSign,
    TrendingUp,
    CheckCircle2,
    Clock,
    Pencil,
    Trash2,
    Coins
} from 'lucide-react';
import { getDictionary } from '../../../../../get-dictionary';
import { Locale } from '../../../i18n-config';
import AddSavingsModal from '@/components/ui/ModalAddSaving';
import ContributeSavingsModal from '@/components/ui/ContributeSavingsModal';

interface SavingsGoal {
    goal_id: number;
    account_id: number;
    title: string;
    currency: string;
    target_amount: string;
    current_amount: string;
    start_date: string;
    target_date: string;
    description: string;
    status: string;
    account_name: string;
    progress_percentage: string;
}

interface ContributeModalState {
    isOpen: boolean;
    goalId: number | null;
    currentAmount: string;
    targetAmount: string;
    goalTitle: string;
}


interface ModalState {
    isOpen: boolean;
    mode: 'create' | 'edit';
    goal?: SavingsGoal;
}

export default function SavingsPage() {
    const router = useRouter();
    const params = useParams();
    const lang = params.lang as Locale;
    const { user, token, logout } = useAuthStore();
    const [dictionary, setDictionary] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);
    const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [modalState, setModalState] = useState<ModalState>({
        isOpen: false,
        mode: 'create'
    });

    const [contributeModal, setContributeModal] = useState<ContributeModalState>({
        isOpen: false,
        goalId: null,
        currentAmount: '0',
        targetAmount: '0',
        goalTitle: ''
    });


    const initializePage = async () => {
        try {
            const dict = await getDictionary(lang);
            setDictionary(dict);

            const { user, token } = useAuthStore.getState();
            if (!user || !token) {
                router.push(`/${lang}/login`);
                return;
            }

            const response = await fetch('https://api.sabaimoney.com/api/savings-goals', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch savings goals');
            }

            const data = await response.json();
            setSavingsGoals(data.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Initialization failed:', error);
            setError(error instanceof Error ? error.message : 'An error occurred');
            setIsLoading(false);
        }
    };

    const handleDelete = async (goalId: number) => {
        try {
            const response = await fetch(`https://api.sabaimoney.com/api/savings-goals/${goalId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete savings goal');
            }

            // Refresh the list after successful deletion
            initializePage();
        } catch (error) {
            console.error('Error deleting goal:', error);
            setError(error instanceof Error ? error.message : 'An error occurred');
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

    const formatDate = (dateString: string, lang: string) => {
        return new Date(dateString).toLocaleDateString(lang, {
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-2">
                        <PiggyBank className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {dictionary.savings.title}
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
                            {dictionary.savings.actions.logout}
                        </button>
                    </div>
                </div>

                {/* Add New Goal Button */}
                <button
                    onClick={() => setModalState({ isOpen: true, mode: 'create', goal: undefined })}
                    className="mb-8 flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    {dictionary.savings.addNewGoal}
                </button>

                <AddSavingsModal
                    isOpen={modalState.isOpen}
                    onClose={() => setModalState({ isOpen: false, mode: 'create' })}
                    onSuccess={initializePage}
                    mode={modalState.mode}
                    goal={modalState.goal}
                />

                {/* Goals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savingsGoals.map((goal) => (
                        <div
                            key={goal.goal_id}
                            className="bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-lg p-6 backdrop-blur-sm"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {goal.title}
                                </h3>
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${goal.status === 'completed'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400'
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-400'
                                    }`}>
                                    {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                                </div>
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {goal.description}
                            </p>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                                        <Target className="w-4 h-4 mr-2" />
                                        {dictionary.savings.fields.target}:
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {goal.currency}  {formatAmount(goal.target_amount)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                                        <DollarSign className="w-4 h-4 mr-2" />
                                        {dictionary.savings.fields.current}:
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {formatAmount(goal.current_amount)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                                        <TrendingUp className="w-4 h-4 mr-2" />
                                        {dictionary.savings.fields.progress}:
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {goal.progress_percentage}%
                                    </span>
                                </div>

                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                    <div
                                        className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min(100, parseInt(goal.progress_percentage))}%` }}
                                    ></div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {dictionary.savings.fields.targetDate}:
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {formatDate(goal.target_date, lang)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                                        <Clock className="w-4 h-4 mr-2" />
                                        {dictionary.savings.fields.started}:
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {formatDate(goal.start_date, lang)}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center text-gray-600 dark:text-gray-400">
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    {dictionary.savings.fields.account}: {goal.account_name}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-4 flex space-x-2">
                                <button
                                    onClick={() => setContributeModal({
                                        isOpen: true,
                                        goalId: goal.goal_id,
                                        currentAmount: goal.current_amount,
                                        targetAmount: goal.target_amount,
                                        goalTitle: goal.title
                                    })}
                                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                 transition-colors flex items-center justify-center"
                                >
                                    <Coins className="w-4 h-4 mr-2" />
                                    {dictionary.savings.actions.contribute}
                                </button>
                                <button
                                    onClick={() => {
                                        setModalState({
                                            isOpen: true,
                                            mode: 'edit',
                                            goal: goal
                                        });
                                    }}
                                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                                             transition-colors flex items-center justify-center"
                                >
                                    <Pencil className="w-4 h-4 mr-2" />
                                    {dictionary.savings.actions.edit}
                                </button>

                                <button
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to delete this savings goal?')) {
                                            handleDelete(goal.goal_id);
                                        }
                                    }}
                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 
                                             transition-colors flex items-center justify-center"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    {dictionary.savings.actions.delete}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {savingsGoals.length === 0 && !error && (
                    <div className="text-center py-12">
                        <PiggyBank className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                            No Savings Goals Yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Start by creating your first savings goal!
                        </p>
                    </div>
                )}

                {error && (
                    <div className="text-center py-12">
                        <div className="text-red-500">
                            <h3 className="text-xl font-medium mb-2">Error</h3>
                            <p>{error}</p>
                        </div>
                    </div>
                )}
            </div>

            <ContributeSavingsModal
                isOpen={contributeModal.isOpen}
                onClose={() => setContributeModal(prev => ({ ...prev, isOpen: false }))}
                onSuccess={initializePage}
                goalId={contributeModal.goalId!}
                token={token!}
                currentAmount={contributeModal.currentAmount}
                targetAmount={contributeModal.targetAmount}
                goalTitle={contributeModal.goalTitle}
            />

        </div>
    );
}