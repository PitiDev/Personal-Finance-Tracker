'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';
import { getDictionary } from '../../../get-dictionary';
import { Locale } from '../../../i18n-config';

interface PaymentFormData {
    amount: number;
    payment_type: 'principal' | 'interest';
    description: string;
}

interface PaymentFormProps {
    onSuccess: () => void;  // Callback to refresh loan details after payment
}

export default function LoanPaymentForm({ onSuccess }: PaymentFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [dictionary, setDictionary] = useState<any>(null);
    const { token } = useAuthStore();
    const params = useParams();
    const lang = params.lang as Locale;

    useEffect(() => {
        const loadDictionary = async () => {
            const dict = await getDictionary(lang);
            setDictionary(dict);
        };
        loadDictionary();
    }, [lang]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<PaymentFormData>({
        defaultValues: {
            payment_type: 'principal',
            description: 'Monthly loan payment'
        }
    });

    const onSubmit = async (data: PaymentFormData) => {
        try {
            setIsSubmitting(true);
            setError('');

            const response = await fetch(`http://localhost:4000/api/loans/${params.id}/payments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit payment');
            }

            // Reset form and notify parent component
            reset();
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'An error occurred while submitting the payment');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {dictionary?.loans.payment.title}
            </h2>

            {error && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label
                        htmlFor="amount"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                        {dictionary?.loans.payment.amount}
                    </label>
                    <input
                        {...register('amount', {
                            required: 'Amount is required',
                            min: { value: 1, message: 'Amount must be greater than 0' }
                        })}
                        type="number"
                        id="amount"
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white
                                 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter amount"
                    />
                    {errors.amount && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.amount.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="payment_type"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                        {dictionary?.loans.payment.type}
                    </label>
                    <select
                        {...register('payment_type')}
                        id="payment_type"
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white
                                 focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="principal">Principal</option>
                        <option value="interest">Interest</option>
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                        {dictionary?.loans.payment.description}
                    </label>
                    <textarea
                        {...register('description')}
                        id="description"
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white
                                 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter payment description"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent
                             rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 
                             hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                             focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {dictionary?.loans.payment.submitting}
                        </>
                    ) : (
                        dictionary?.loans.payment.submit
                    )}
                </button>
            </form>
        </div>
    );
}