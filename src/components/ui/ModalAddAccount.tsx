import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (account: NewAccount) => Promise<void>;
    dictionary: {
        title: string;
        accountName: {
            label: string;
            placeholder: string;
        };
        accountType: {
            label: string;
            placeholder: string;
        };
        initialBalance: {
            label: string;
            placeholder: string;
        };
        currency: {
            label: string;
            placeholder: string;
        };
        buttons: {
            cancel: string;
            create: string;
            creating: string;
        };
        validation: {
            required: string;
            minBalance: string;
        };
    };
}

interface NewAccount {
    account_name: string;
    account_type: string;
    initial_balance: number;
    currency: string;
}

export function AddAccountModal({
    isOpen,
    onClose,
    onAdd,
    dictionary
}: AddAccountModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<NewAccount>({
        account_name: '',
        account_type: 'bank',
        initial_balance: 0,
        currency: 'LAK'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await onAdd(formData);
            onClose();
            setFormData({
                account_name: '',
                account_type: 'bank',
                initial_balance: 0,
                currency: 'LAK'
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : dictionary.validation.required);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 
        transition-opacity duration-300 ease-in-out"
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md shadow-xl 
          animate-modal-scale-in transform origin-center"
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {dictionary.title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 
              transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div
                            className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 
                dark:bg-red-900/50 dark:text-red-200 rounded-md"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="account-name"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                                {dictionary.accountName.label}*
                            </label>
                            <input
                                id="account-name"
                                type="text"
                                value={formData.account_name}
                                onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white
                         transition-all duration-200"
                                required
                                placeholder={dictionary.accountName.placeholder}
                                aria-required="true"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="account-type"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                                {dictionary.accountType.label}*
                            </label>
                            <select
                                id="account-type"
                                value={formData.account_type}
                                onChange={(e) => setFormData({ ...formData, account_type: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white
                         transition-all duration-200"
                                required
                                aria-required="true"
                            >

                                <option value="bank">Bank Account</option>
                                <option value="cash">Cash</option>
                                <option value="credit">Credit Card</option>
                                <option value="investment">Investment</option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="initial-balance"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                                {dictionary.initialBalance.label}*
                            </label>
                            <input
                                id="initial-balance"
                                type="number"
                                value={formData.initial_balance}
                                onChange={(e) => setFormData({ ...formData, initial_balance: Number(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white
                         transition-all duration-200"
                                required
                                min="0"
                                step="0.01"
                                placeholder={dictionary.initialBalance.placeholder}
                                aria-required="true"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="currency"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                                {dictionary.currency.label}*
                            </label>
                            <select
                                id="currency"
                                value={formData.currency}
                                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white
                         transition-all duration-200"
                                required
                                aria-required="true"
                            >
                                <option value="LAK">LAK - Lao Kip</option>
                                <option value="USD">USD - US Dollar</option>
                                <option value="THB">THB - Thai Baht</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:text-gray-900 
                       dark:text-gray-300 dark:hover:text-white 
                       transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                            disabled={isSubmitting}
                        >
                            {dictionary.buttons.cancel}
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg
                       hover:bg-blue-600 transition-colors 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? dictionary.buttons.creating : dictionary.buttons.create}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}