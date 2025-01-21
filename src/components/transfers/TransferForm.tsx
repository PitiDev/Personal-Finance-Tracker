import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '@/store/authStore'
import axios from 'axios'
import { toast } from 'sonner'

interface TransferFormProps {
    dictionary: any
}

interface Account {
    id: number
    account_name: string
    account_type: string
    balance: number
}

interface TransferData {
    from_account_id: number
    to_account_id: number
    amount: number
    description: string
}

const TransferForm: React.FC<TransferFormProps> = ({ dictionary }) => {
    const { token } = useAuthStore()
    const [accounts, setAccounts] = useState<Account[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const { 
        register, 
        handleSubmit, 
        reset, 
        formState: { errors },
        watch 
    } = useForm<TransferData>()

    // Fetch user accounts
    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/accounts', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                setAccounts(response.data.data)
            } catch (error) {
                console.error('Failed to fetch accounts', error)
                toast.error('Failed to load accounts')
            }
        }

        if (token) {
            fetchAccounts()
        }
    }, [token])

    const onSubmit = async (data: TransferData) => {
        setIsLoading(true)
        try {
            await axios.post('http://localhost:4000/api/transfers', data, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            toast.success(dictionary.transferSuccessMessage)
            reset() // Reset form after successful transfer
        } catch (error) {
            console.error('Transfer failed', error)
            toast.error(dictionary.transferErrorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const fromAccountId = watch('from_account_id')
    
    // Filter out the selected source account from destination accounts
    const destinationAccounts = accounts.filter(
        account => account.id !== Number(fromAccountId)
    )

    return (
        <div className="bg-white/80 dark:bg-gray-800/80 shadow-lg rounded-lg p-6 backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                {dictionary.transferFormTitle}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Source Account Dropdown */}
                <div>
                    <label 
                        htmlFor="from_account_id" 
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                        {dictionary.sourceAccount}
                    </label>
                    <select
                        id="from_account_id"
                        {...register('from_account_id', { 
                            required: dictionary.sourceAccountRequired 
                        })}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 
                                   shadow-sm focus:border-blue-500 focus:ring-blue-500 
                                   bg-white dark:bg-gray-700 
                                   text-gray-900 dark:text-white"
                    >
                        <option value="">{dictionary.selectSourceAccount}</option>
                        {accounts.map(account => (
                            <option key={account.id} value={account.id}>
                                {account.account_name} - ${account.balance.toLocaleString()}
                            </option>
                        ))}
                    </select>
                    {errors.from_account_id && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.from_account_id.message}
                        </p>
                    )}
                </div>

                {/* Destination Account Dropdown */}
                <div>
                    <label 
                        htmlFor="to_account_id" 
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                        {dictionary.destinationAccount}
                    </label>
                    <select
                        id="to_account_id"
                        {...register('to_account_id', { 
                            required: dictionary.destinationAccountRequired 
                        })}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 
                                   shadow-sm focus:border-blue-500 focus:ring-blue-500 
                                   bg-white dark:bg-gray-700 
                                   text-gray-900 dark:text-white"
                    >
                        <option value="">{dictionary.selectDestinationAccount}</option>
                        {destinationAccounts.map(account => (
                            <option key={account.id} value={account.id}>
                                {account.account_name} - ${account.balance.toLocaleString()}
                            </option>
                        ))}
                    </select>
                    {errors.to_account_id && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.to_account_id.message}
                        </p>
                    )}
                </div>

                {/* Transfer Amount */}
                <div>
                    <label 
                        htmlFor="amount" 
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                        {dictionary.transferAmount}
                    </label>
                    <input
                        type="number"
                        id="amount"
                        step="0.01"
                        min="0"
                        {...register('amount', { 
                            required: dictionary.amountRequired,
                            min: {
                                value: 0.01, 
                                message: dictionary.minimumAmountError
                            }
                        })}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 
                                   shadow-sm focus:border-blue-500 focus:ring-blue-500 
                                   bg-white dark:bg-gray-700 
                                   text-gray-900 dark:text-white"
                    />
                    {errors.amount && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.amount.message}
                        </p>
                    )}
                </div>

                {/* Transfer Description */}
                <div>
                    <label 
                        htmlFor="description" 
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                        {dictionary.transferDescription}
                    </label>
                    <textarea
                        id="description"
                        {...register('description', { 
                            maxLength: {
                                value: 255, 
                                message: dictionary.descriptionMaxLengthError
                            }
                        })}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 
                                   shadow-sm focus:border-blue-500 focus:ring-blue-500 
                                   bg-white dark:bg-gray-700 
                                   text-gray-900 dark:text-white"
                        rows={3}
                    />
                    {errors.description && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.description.message}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 
                                   border border-transparent rounded-md shadow-sm 
                                   text-white bg-blue-600 hover:bg-blue-700 
                                   focus:outline-none focus:ring-2 focus:ring-offset-2 
                                   focus:ring-blue-500 transition-colors
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <svg 
                                    className="animate-spin h-5 w-5 mr-3" 
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
                                {dictionary.processing}
                            </div>
                        ) : (
                            dictionary.transferSubmitButton
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default TransferForm