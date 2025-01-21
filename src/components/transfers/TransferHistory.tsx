import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useAuthStore } from '@/store/authStore'
import {
    ArrowRightLeft,
    ChevronLeft,
    ChevronRight,
    RefreshCcw
} from 'lucide-react'
import { toast } from 'sonner'

interface Transfer {
    id: number
    from_account_name: string
    to_account_name: string
    amount: number
    description: string
    created_at: string
    from_currency: string
    to_currency: string
    converted_amount: number
    transfer_fee: number
}

interface TransferHistoryProps {
    dictionary: any
}

const API_URL = 'http://localhost:4000/api/transfers/history'

export default function TransferHistory({ dictionary }: TransferHistoryProps) {
    const { token } = useAuthStore()
    const [transfers, setTransfers] = useState<Transfer[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const fetchTransferHistory = useCallback(async (page: number) => {
        setIsLoading(true)
        try {
            const response = await axios.get(API_URL, {
                headers: { 'Authorization': `Bearer ${token}` },
                params: {
                    page,
                    limit: 10
                }
            })

            console.log('Full API Response:', JSON.stringify(response.data, null, 2))

            const { data } = response.data ?? {}
            const transfers = data?.transfers ?? []
            const pagination = data?.pagination ?? {}

            console.log('Pagination:', pagination)

            setTransfers(transfers.map((transfer: any) => ({
                id: transfer.transfer_id,
                from_account_name: transfer.from_account_name,
                to_account_name: transfer.to_account_name,
                amount: parseFloat(transfer.amount),
                description: transfer.description,
                created_at: transfer.transfer_date,
                from_currency: transfer.from_currency,
                to_currency: transfer.to_currency,
                converted_amount: parseFloat(transfer.converted_amount),
                transfer_fee: parseFloat(transfer.transfer_fee)
            })))

            const calculatedTotalPages = pagination.total_pages ??
                pagination.totalPages ??
                (transfers.length > 0 ? 1 : 0)

            setTotalPages(calculatedTotalPages)
            setCurrentPage(pagination.page ?? 1)

        } catch (error) {
            console.error('Failed to fetch transfer history', error)

            if (axios.isAxiosError(error)) {
                console.error('Axios Error Details:', {
                    response: error.response?.data,
                    status: error.response?.status,
                    headers: error.response?.headers,
                    request: error.request,
                    message: error.message
                })
            } else {
                console.error('Unexpected Error:', error)
            }

            toast.error(dictionary?.historyFetchError ?? 'Failed to load transfer history')

            setTransfers([])
            setTotalPages(0)
            setCurrentPage(1)
        } finally {
            setIsLoading(false)
        }
    }, [token, dictionary])

    useEffect(() => {
        if (token) {
            fetchTransferHistory(1).catch(error => {
                console.error('Error in transfer history fetch:', error)
            })
        }
    }, [token, fetchTransferHistory])

    const handleRefresh = () => {
        fetchTransferHistory(currentPage)
    }

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            fetchTransferHistory(newPage)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="bg-white/80 dark:bg-gray-800/80 shadow-lg rounded-lg p-6 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {dictionary.transferHistory}
                </h2>
                <button
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-500 
                               dark:hover:text-blue-400 transition-colors 
                               disabled:opacity-50"
                >
                    <RefreshCcw className="w-5 h-5" />
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <svg
                        className="animate-spin h-8 w-8 text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                </div>
            ) : transfers.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    {dictionary.noTransfersFound}
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="py-3 px-4 text-gray-600 dark:text-gray-300">{dictionary.date}</th>
                                    <th className="py-3 px-4 text-gray-600 dark:text-gray-300">{dictionary.fromAccount}</th>
                                    <th className="py-3 px-4 text-gray-600 dark:text-gray-300">{dictionary.toAccount}</th>
                                    <th className="py-3 px-4 text-gray-600 dark:text-gray-300">{dictionary.amount}</th>
                                    <th className="py-3 px-4 text-gray-600 dark:text-gray-300">{dictionary.description}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transfers.map((transfer) => (
                                    <tr
                                        key={transfer.id}
                                        className="border-b border-gray-100 dark:border-gray-700 
                       hover:bg-gray-50 dark:hover:bg-gray-700/50 
                       transition-colors"
                                    >
                                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                                            {formatDate(transfer.created_at)}
                                        </td>
                                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                                            {transfer.from_account_name} ({transfer.from_currency})
                                        </td>
                                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                                            {transfer.to_account_name} ({transfer.to_currency})
                                        </td>
                                        <td className="py-3 px-4 font-medium text-green-600 dark:text-green-400">
                                            {transfer.amount.toLocaleString()} {transfer.from_currency}
                                            {transfer.from_currency !== transfer.to_currency && (
                                                <span className="text-xs text-gray-500 block">
                                                    ≈ {transfer.converted_amount.toLocaleString()} {transfer.to_currency}
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                                            {transfer.description || '-'}
                                            {transfer.transfer_fee > 0 && (
                                                <span className="text-xs text-gray-500 block">
                                                    Fee: {transfer.transfer_fee.toLocaleString()} {transfer.from_currency}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {transfers.length > 0 && (
                        <div className="flex justify-between items-center mt-4">
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                Page {currentPage} of {totalPages}
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 
                           disabled:opacity-50 disabled:cursor-not-allowed 
                           transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 
                           disabled:opacity-50 disabled:cursor-not-allowed 
                           transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}