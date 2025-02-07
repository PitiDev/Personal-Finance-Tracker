'use client'

import React, { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import axios from 'axios'

import {
  DollarSign,
  RefreshCw,
  AlertCircle
} from 'lucide-react'

interface Account {
  account_id: number
  account_name: string
  balance: string
}

interface Category {
  category_id: number
  name: string
  type: string
}

interface TransactionFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  dictionary: any
}

const TransactionForm = ({ onSuccess, onCancel, dictionary }: TransactionFormProps) => {
  const { token } = useAuthStore()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    account_id: '',
    category_id: '',
    amount: '',
    type: 'expense',
    description: '',
    transaction_date: new Date().toISOString().split('T')[0]
  })

  // Fetch accounts and categories when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountsResponse, categoriesResponse] = await Promise.all([
          axios.get('https://api.sabaimoney.com/api/accounts', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('https://api.sabaimoney.com/api/categories', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ])

        setAccounts(accountsResponse.data.data)
        setCategories(categoriesResponse.data.data)
      } catch (err) {
        console.error('Failed to fetch data:', err)
        setError('Failed to load accounts or categories')
      }
    }

    fetchData()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Convert amount to number and validate
      const amount = parseFloat(formData.amount)
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount')
      }

      const response = await axios.post(
        'https://api.sabaimoney.com/api/transactions',
        {
          account_id: parseInt(formData.account_id),
          category_id: parseInt(formData.category_id),
          amount,
          type: formData.type,
          description: formData.description.trim(),
          transaction_date: formData.transaction_date
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.data.status === 'success') {
        setSuccessMessage('Transaction created successfully')
        // Wait a short moment to show the success message
        setTimeout(() => {
          onSuccess?.()
          // Reset form
          setFormData({
            account_id: '',
            category_id: '',
            amount: '',
            type: 'expense',
            description: '',
            transaction_date: new Date().toISOString().split('T')[0]
          })
        }, 1500)
      }
    } catch (err) {
      console.error('Transaction creation failed:', err)
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError(err instanceof Error ? err.message : 'Transaction creation failed')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const filteredCategories = categories.filter(
    category => category.type === formData.type
  )

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          {dictionary.transactions?.newTransaction || 'New Transaction'}
        </h2>
      </div>

      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg flex items-center">
          <svg
            className="h-5 w-5 mr-2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {dictionary.transactions?.type || 'Type'}
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="expense">{dictionary.transactions?.expense || 'Expense'}</option>
              <option value="income">{dictionary.transactions?.income || 'Income'}</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {dictionary.transactions?.date || 'Date'}
            </label>
            <input
              type="date"
              name="transaction_date"
              value={formData.transaction_date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Account
          </label>
          <select
            name="account_id"
            value={formData.account_id}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select account</option>
            {accounts.map(account => (
              <option key={account.account_id} value={account.account_id}>
                {account.account_name} (Balance: {parseFloat(account.balance).toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {dictionary.transactions?.category || 'Category'}
          </label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select category</option>
            {filteredCategories.map(category => (
              <option key={category.category_id} value={category.category_id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {dictionary.transactions?.amount || 'Amount'}
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="Enter amount"
            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {dictionary.transactions?.description || 'Description'}
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter description"
            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Create Transaction'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default TransactionForm