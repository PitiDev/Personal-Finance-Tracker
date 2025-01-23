'use client'

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { getDictionary } from '../../../../../../get-dictionary';
import { Locale } from '../../../../i18n-config';
import { useRouter } from 'next/navigation';
import LoanPaymentForm from '@/components/ui/ModalLoanPayment';



interface LoanResponse {
    loan: {
        loan_id: number;
        title: string;
        total_amount: number;
        remaining_amount: number;
        interest_rate: number;
        start_date: string;
        end_date: string;
        status: string;
        borrower_name: string;
        contact_info: string;
        description: string;
        account_name: string;
        progress_percentage: number;
    };
    payments: Array<{
        payment_id: number;
        payment_date: string;
        amount: number;
        payment_type: string;
        description: string;
    }>;
}

export default function LoanDetailsPage() {
    const router = useRouter(); // Use the hook from next/navigation

    const params = useParams();
    const lang = params.lang as Locale;
    const [loan, setLoan] = useState<LoanResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuthStore();
    const [dictionary, setDictionary] = useState<any>(null);

    useEffect(() => {
        const loadDictionary = async () => {
            const dict = await getDictionary(lang);
            setDictionary(dict);
        };
        loadDictionary();
    }, [lang]);

    const fetchLoanDetails = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`http://localhost:4000/api/loans/${params.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch loan details');
            }

            const data = await response.json();
            setLoan(data.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchLoanDetails();
        }
    }, [params.id, token]);

    const handlePaymentSuccess = () => {
        // Refresh loan details after successful payment
        fetchLoanDetails();
    };


    // Format dates to be more readable
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString();
    };

    // Format currency numbers
    const formatMoney = (amount: string) => {
        return new Intl.NumberFormat(lang, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(parseFloat(amount));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500 text-center">
                    <h2 className="text-2xl font-bold mb-2">Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }
    const backToLoansClick = () => {
        router.push(`/${lang}/loan`);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Back Button */}
                <button
                    onClick={backToLoansClick}
                    className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {dictionary?.loans.actions.back}
                </button>

                {/* Main Loan Details */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {loan?.loan.title}
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400">
                                Account: {loan?.loan.account_name}
                            </p>
                        </div>
                        <div className="px-3 py-1 bg-green-100 dark:bg-green-900 rounded-full">
                            <span className="text-green-800 dark:text-green-200 text-sm font-medium">
                                {loan?.loan.status}
                            </span>
                        </div>
                    </div>

                    {/* Loan Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {dictionary?.loans.fields.totalAmount}
                                </p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {formatMoney(loan?.loan.total_amount?.toString() || '0')}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {dictionary?.loans.fields.remainingAmount}
                                </p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {formatMoney(loan?.loan.remaining_amount?.toString() || '0')}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {dictionary?.loans.fields.interestRate}
                                </p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {loan?.loan.interest_rate}%
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {dictionary?.loans.fields.startDate}
                                </p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {formatDate(loan?.loan.start_date)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {dictionary?.loans.fields.endDate}
                                </p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {formatDate(loan?.loan.end_date)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {dictionary?.loans.fields.progress}
                                </p>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                        style={{ width: `${loan?.loan.progress_percentage}%` }}
                                    />
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    {loan?.loan.progress_percentage}% Complete
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {dictionary?.loans.fields.borrowerName}
                                </p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {loan?.loan.borrower_name}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {dictionary?.loans.fields.contact}
                                </p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {loan?.loan.contact_info}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            {dictionary?.loans.fields.description}
                        </p>
                        <p className="text-gray-900 dark:text-white">
                            {loan?.loan.description}
                        </p>
                    </div>
                </div>

                {/* Payment History */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <div className="mb-8">
                        <LoanPaymentForm onSuccess={handlePaymentSuccess} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        {dictionary?.loans.fields.paymentHistory}
                    </h2>



                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        {dictionary?.loans.fields.date}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        {dictionary?.loans.fields.amount}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        {dictionary?.loans.fields.type}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        {dictionary?.loans.fields.description}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {loan?.payments.map((payment) => (
                                    <tr key={payment.payment_id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {formatDate(payment.payment_date)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {formatMoney(payment.amount.toString())}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white capitalize">
                                            {payment.payment_type}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {payment.description}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}