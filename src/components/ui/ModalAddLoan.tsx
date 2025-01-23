import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, Plus } from 'lucide-react';
import { Locale } from '@/app/i18n-config';

interface AddLoanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    token: string;
    dictionary: any;
}

const AddLoanModal = ({
    isOpen,
    onClose,
    onSuccess,
    token,
    dictionary
}: AddLoanModalProps) => {
    const [formData, setFormData] = useState({
        account_id: '',
        title: '',
        total_amount: '',
        interest_rate: '',
        loan_type: 'borrowed',
        start_date: '',
        end_date: '',
        borrower_name: '',
        contact_info: '',
        description: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:4000/api/loans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    total_amount: parseFloat(formData.total_amount),
                    interest_rate: parseFloat(formData.interest_rate),
                    account_id: parseInt(formData.account_id)
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create loan');
            }

            onSuccess();
            onClose();
            // Reset form
            setFormData({
                account_id: '',
                title: '',
                total_amount: '',
                interest_rate: '',
                loan_type: 'borrowed',
                start_date: '',
                end_date: '',
                borrower_name: '',
                contact_info: '',
                description: ''
            });
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 
        transition-opacity duration-300 ease-in-out">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    {dictionary.loans.actions.add}
                </h2>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
                        <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {dictionary.loans.fields.account}
                            </label>
                            <input
                                type="number"
                                name="account_id"
                                value={formData.account_id}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {dictionary.loans.fields.title}
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {dictionary.loans.fields.totalAmount}
                            </label>
                            <input
                                type="number"
                                name="total_amount"
                                value={formData.total_amount}
                                onChange={handleChange}
                                step="0.01"
                                min="0.01"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {dictionary.loans.fields.interestRate}
                            </label>
                            <input
                                type="number"
                                name="interest_rate"
                                value={formData.interest_rate}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {dictionary.loans.fields.loanType}
                            </label>
                            <select
                                name="loan_type"
                                value={formData.loan_type}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="borrowed">{dictionary.loans.types.borrowed}</option>
                                <option value="lent">{dictionary.loans.types.lent}</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {dictionary.loans.fields.startDate}
                            </label>
                            <input
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {dictionary.loans.fields.endDate}
                            </label>
                            <input
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {dictionary.loans.fields.borrower}
                            </label>
                            <input
                                type="text"
                                name="borrower_name"
                                value={formData.borrower_name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {dictionary.loans.fields.contact}
                            </label>
                            <input
                                type="email"
                                name="contact_info"
                                value={formData.contact_info}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-300
                       border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50
                       dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2
                       focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg
                       hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                       focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed
                       flex items-center"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Loan
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddLoanModal;