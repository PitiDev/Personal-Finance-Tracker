import React, { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useForm } from 'react-hook-form';

interface SavingsGoal {
    goal_id?: number;
    account_id: number;
    title: string;
    currency: string;
    target_amount: string | number;
    target_date: string;
    description: string;
}

interface SavingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    goal?: SavingsGoal;
    mode: 'create' | 'edit';
}

interface SavingsFormData {
    account_id: number;
    title: string;
    currency: string;
    target_amount: number;
    target_date: string;
    description: string;
}

export default function SavingsModal({ isOpen, onClose, onSuccess, goal, mode }: SavingsModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const { token } = useAuthStore();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue
    } = useForm<SavingsFormData>({
        defaultValues: {
            account_id: 1,
            title: '',
            currency: '',
            target_amount: 0,
            target_date: '',
            description: ''
        }
    });

    useEffect(() => {
        if (goal && mode === 'edit') {
            setValue('title', goal.title);
            setValue('currency', goal.currency);
            setValue('target_amount', Number(goal.target_amount));
            setValue('target_date', goal.target_date.split('T')[0]);
            setValue('description', goal.description);
            setValue('account_id', goal.account_id);
        }
    }, [goal, mode, setValue]);

    const handleDelete = async () => {
        if (!goal?.goal_id) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`https://api.sabaimoney.com/api/savings-goals/${goal.goal_id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete savings goal');
            }

            onSuccess();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while deleting');
        } finally {
            setIsSubmitting(false);
        }
    };

    const onSubmit = async (data: SavingsFormData) => {
        setIsSubmitting(true);
        setError(null);

        const url = mode === 'create'
            ? 'https://api.sabaimoney.com/api/savings-goals'
            : `https://api.sabaimoney.com/api/savings-goals/${goal?.goal_id}`;

        try {
            const response = await fetch(url, {
                method: mode === 'create' ? 'POST' : 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`Failed to ${mode} savings goal`);
            }

            reset();
            onSuccess();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    if (showDeleteConfirm) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 
        transition-opacity duration-300 ease-in-out">
                <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md shadow-xl p-6">
                    <div className="flex items-center mb-4 text-red-500">
                        <AlertTriangle className="w-6 h-6 mr-2" />
                        <h2 className="text-xl font-semibold">Confirm Deletion</h2>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Are you sure you want to delete this savings goal? This action cannot be undone.
                    </p>

                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                                     hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-500 
                                     hover:bg-red-600 rounded-md transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? 'Deleting...' : 'Delete Goal'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md shadow-xl">
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {mode === 'create' ? 'Add New Savings Goal' : 'Edit Savings Goal'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            {...register('title', { required: 'Title is required' })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                                     focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="e.g., Emergency Fund"
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Currency
                        </label>
                        <select
                            {...register('currency', { required: 'Currency is required' })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                                     focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            defaultValue=""
                        >
                            <option value="" disabled>Select currency</option>
                            <option value="LAK">LAK</option>
                            <option value="THB">THB</option>
                            <option value="USD">USD</option>
                            <option value="USD">YEN</option>
                        </select>
                        {errors.currency && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {errors.currency.message}
                            </p>
                        )}


                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Target Amount
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            {...register('target_amount', {
                                required: 'Target amount is required',
                                min: { value: 0.01, message: 'Amount must be greater than 0' }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                                     focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="5000"
                        />
                        {errors.target_amount && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {errors.target_amount.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Target Date
                        </label>
                        <input
                            type="date"
                            {...register('target_date', { required: 'Target date is required' })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                                     focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                        {errors.target_date && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {errors.target_date.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            {...register('description', { required: 'Description is required' })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                                     focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            rows={3}
                            placeholder="Describe your savings goal..."
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {error && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        {mode === 'edit' && (
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(true)}
                                className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 
                                         dark:text-red-400 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                disabled={isSubmitting}
                            >
                                Delete
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                                     hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 
                                     hover:bg-blue-600 rounded-md transition-colors disabled:opacity-50 
                                     disabled:cursor-not-allowed flex items-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                    {mode === 'create' ? 'Creating...' : 'Updating...'}
                                </>
                            ) : (
                                mode === 'create' ? 'Create Goal' : 'Update Goal'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}