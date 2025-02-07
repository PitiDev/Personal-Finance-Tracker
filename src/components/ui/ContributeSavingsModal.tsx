import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, Plus } from 'lucide-react';

interface ContributeSavingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    goalId: number;
    token: string;
    currentAmount: string;
    targetAmount: string;
    goalTitle: string;
}

const ContributeSavingsModal = ({
    isOpen,
    onClose,
    onSuccess,
    goalId,
    token,
    currentAmount,
    targetAmount,
    goalTitle
}: ContributeSavingsModalProps) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`https://api.sabaimoney.com/api/savings-goals/${goalId}/contribute`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    description
                })
            });

            if (!response.ok) {
                throw new Error('Failed to contribute to savings goal');
            }

            onSuccess();
            onClose();
            setAmount('');
            setDescription('');
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const remainingAmount = parseFloat(targetAmount) - parseFloat(currentAmount);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 
        transition-opacity duration-300 ease-in-out">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    Contribute to {goalTitle}
                </h2>

                <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                        Current amount: ${parseFloat(currentAmount).toLocaleString()}
                        <br />
                        Target amount: ${parseFloat(targetAmount).toLocaleString()}
                        <br />
                        Remaining: ${remainingAmount.toLocaleString()}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
                        <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Amount ($)
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter amount"
                            required
                            min="0.01"
                            step="0.01"
                            max={remainingAmount}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter description"
                            required
                            rows={3}
                        />
                    </div>

                    <div className="flex space-x-3">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-500 text-white 
                       rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                <Plus className="w-4 h-4 mr-2" />
                            )}
                            Contribute
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200
                       rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContributeSavingsModal;