'use client'

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { useAuthStore } from '@/store/authStore';
import {
    Loader2, Plus, Calendar, Clock,
    Target, Pencil, Trash2
} from 'lucide-react';
import { getDictionary } from '../../../../../get-dictionary';
import { Locale } from '../../../i18n-config';

// Type definitions
interface Budget {
    budget_id: number;
    category_id: number;
    amount: string;
    start_date: string;
    end_date: string;
    description: string;
    category_name: string;
    spent_amount: string;
    remaining_amount: string;
    progress_percentage: string;
}

interface Category {
    category_id: number;
    name: string;
    type: 'income' | 'expense';
}

interface BudgetFormData {
    category_id: number;
    amount: number;
    start_date: string;
    end_date: string;
    description: string;
}

// Modal Component
const BudgetModal = ({
    isOpen,
    onClose,
    onSubmit,
    budget,
    categories = [] // Provide default empty array
}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: BudgetFormData) => void;
    budget?: Budget;
    categories?: Category[];
}) => {
    const initialFormData = {
        category_id: budget?.category_id || 0,
        amount: budget ? parseFloat(budget.amount) : 0,
        start_date: budget?.start_date || new Date().toISOString().split('T')[0],
        end_date: budget?.end_date || new Date().toISOString().split('T')[0],
        description: budget?.description || ''
    };

    const [formData, setFormData] = useState<BudgetFormData>(initialFormData);

    // Reset form when modal opens/closes or when budget changes
    useEffect(() => {
        if (isOpen) {
            setFormData({
                category_id: budget?.category_id || 0,
                amount: budget ? parseFloat(budget.amount) : 0,
                start_date: budget?.start_date || new Date().toISOString().split('T')[0],
                end_date: budget?.end_date || new Date().toISOString().split('T')[0],
                description: budget?.description || ''
            });
        }
    }, [isOpen, budget]);

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setFormData(initialFormData);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    {budget ? 'Edit Budget' : 'Create New Budget'}
                </h2>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit(formData);
                }}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Category
                            </label>
                            <select
                                value={formData.category_id}
                                onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) })}
                                className="w-full px-3 py-2 border rounded-md dark:border-gray-600 dark:bg-gray-700 bg-white dark:bg-gray-800"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories && categories.length > 0 && categories
                                    .filter(cat => cat.type === 'expense')
                                    .map((category) => (
                                        <option key={category.category_id} value={category.category_id}>
                                            {category.name}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Amount
                            </label>
                            <input
                                type="number"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                className="w-full px-3 py-2 border rounded-md dark:border-gray-600 dark:bg-gray-700"
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md dark:border-gray-600 dark:bg-gray-700"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.end_date}
                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md dark:border-gray-600 dark:bg-gray-700"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md dark:border-gray-600 dark:bg-gray-700"
                                rows={3}
                            />
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                {budget ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default function BudgetsPage() {
    const router = useRouter();
    const params = useParams();
    const lang = params.lang as Locale;
    const { user, token, logout } = useAuthStore();
    const [dictionary, setDictionary] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState<Budget | undefined>(undefined);

    const fetchData = async () => {
        try {
            const [budgetsResponse, categoriesResponse] = await Promise.all([
                fetch('http://localhost:4000/api/budgets', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch('http://localhost:4000/api/categories', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            if (!budgetsResponse.ok || !categoriesResponse.ok) {
                throw new Error('Failed to fetch data');
            }

            const budgetsData = await budgetsResponse.json();
            const categoriesData = await categoriesResponse.json();

            console.log(budgetsData);
            console.log(categoriesData);
            console.log(budgetsData.data);
            console.log(categoriesData.data.categories);
            setBudgets(budgetsData.data);
            setCategories(categoriesData.data);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
        }
    };

    const initializePage = async () => {
        try {
            const dict = await getDictionary(lang);
            setDictionary(dict);

            await fetchData();
            setIsLoading(false);
        } catch (error) {
            console.error('Initialization failed:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        initializePage();
    }, [lang, router]);

    const handleSubmit = async (formData: BudgetFormData) => {
        try {
            const response = await fetch(
                selectedBudget
                    ? `http://localhost:4000/api/budgets/${selectedBudget.budget_id}`
                    : 'http://localhost:4000/api/budgets',
                {
                    method: selectedBudget ? 'PUT' : 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                }
            );

            if (!response.ok) {
                throw new Error('Failed to save budget');
            }

            await fetchData();
            setIsModalOpen(false);
            setSelectedBudget(undefined);
        } catch (error) {
            console.error('Error saving budget:', error);
        }
    };

    const handleDelete = async (budgetId: number) => {
        if (!window.confirm('Are you sure you want to delete this budget?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:4000/api/budgets/${budgetId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete budget');
            }

            await fetchData();
        } catch (error) {
            console.error('Error deleting budget:', error);
        }
    };

    const handleEdit = (budget: Budget) => {
        setSelectedBudget(budget);
        setIsModalOpen(true);
    };

    const formatAmount = (amount: string) => {
        return new Intl.NumberFormat(lang, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(parseFloat(amount));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
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
            <div>
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Budget Overview
                        </h1>
                        <button
                            onClick={() => {
                                setSelectedBudget(undefined);
                                setIsModalOpen(true);
                            }}
                            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add New Budget
                        </button>
                    </div>

                    {budgets.length === 0 ? (
                        <div className="text-center py-12">
                            <Target className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                No Budgets Found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Start by creating your first budget to track your expenses.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {budgets.map((budget) => (
                                <div
                                    key={budget.budget_id}
                                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {budget.category_name}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {budget.description || 'No description'}
                                            </p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(budget)}
                                                className="p-2 text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(budget.budget_id)}
                                                className="p-2 text-gray-600 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Budget:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {formatAmount(budget.amount)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Spent:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {formatAmount(budget.spent_amount)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Remaining:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {formatAmount(budget.remaining_amount)}
                                            </span>
                                        </div>

                                        <div className="mt-4">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                                                <span className="text-gray-900 dark:text-white">
                                                    {budget.progress_percentage}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                                <div
                                                    className="bg-blue-500 h-2.5 rounded-full"
                                                    style={{ width: `${budget.progress_percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-4">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {formatDate(budget.start_date)}
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 mr-1" />
                                                {formatDate(budget.end_date)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <BudgetModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                budget={selectedBudget}
                categories={categories}
            />
        </div>
    );
}