import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '@/store/authStore'
import axios from 'axios'
import { toast } from 'sonner'
import { formatAmount } from '@/lib/utils'
import { ArrowRightLeft } from 'lucide-react'

interface TransferFormProps {
    dictionary: any
}

interface Account {
    account_id: number
    account_name: string
    account_type: string
    currency: string
    balance: number
}

interface TransferData {
    from_account_id: number
    to_account_id: number
    amount: number,
    currency: string,
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
        account => account.account_id !== Number(fromAccountId)
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
                        className="pl-10 shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    >
                        <option value="">{dictionary.selectSourceAccount}</option>
                        {accounts.map(account => (
                            <option key={account.account_id} value={account.account_id}>
                                {account.account_name} - ${formatAmount(account.balance)} {account.currency}
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
                        className="pl-10 shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    >
                        <option value="">{dictionary.selectDestinationAccount}</option>
                        {destinationAccounts.map(account => (
                            <option key={account.account_id} value={account.account_id}>
                                {account.account_name} - ${formatAmount(account.balance)} {account.currency}
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
                        className="pl-10 shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
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
                                <ArrowRightLeft className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                {dictionary.processing}
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <ArrowRightLeft className="h-8 w-8 text-white mr-2" />
                                {dictionary.transferSubmitButton}
                            </div>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default TransferForm