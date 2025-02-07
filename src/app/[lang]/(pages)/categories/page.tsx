'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { useAuthStore } from '@/store/authStore'
import {
    Loader2,
    Plus,
    Pencil,
    Trash2,
    X,
    Tags,
    ArrowLeft,
    Check,
    AlertCircle,
    TrendingDown,
    TrendingUp
} from 'lucide-react'
import { getDictionary } from '../../../../../get-dictionary'
import { Locale } from '../../../i18n-config'

// Types
interface Category {
    id: number
    category_id: number
    name: string
    description: string
    type: 'income' | 'expense'
    created_at: string
    updated_at: string
}


// Custom hook for category data management
const useCategoryData = (token: string) => {
    const [data, setData] = useState<Category[]>([])
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const fetchCategories = async () => {
        try {
            const response = await fetch('https://api.sabaimoney.com/api/categories', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) {
                throw new Error('Failed to fetch categories')
            }

            const result = await response.json()

            // Add console logs to understand the structure
            console.log('Full API Response:', result)
            console.log('Categories:', result.data?.categories)

            // Adjust this line based on the actual response structure
            const categories = result.data?.categories || result.categories || result.data || []

            setData(categories)
        } catch (err) {
            console.error('Category Fetch Error:', err)
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setIsLoading(false)
        }
    }


    useEffect(() => {
        if (token) {
            fetchCategories()
        }
    }, [token])

    const createCategory = async (categoryData: {
        name: string;
        description: string;
        type: 'income' | 'expense'
    }) => {
        try {
            const response = await fetch('https://api.sabaimoney.com/api/categories', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(categoryData),
            })

            if (!response.ok) {
                throw new Error('Failed to create category')
            }

            await fetchCategories()
            return true
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create category')
            return false
        }
    }

    const updateCategory = async (id: number, categoryData: {
        name: string;
        description: string;
        type: 'income' | 'expense'
    }) => {
        try {
            const response = await fetch(`https://api.sabaimoney.com/api/categories/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(categoryData),
            })

            if (!response.ok) {
                throw new Error('Failed to update category')
            }

            await fetchCategories()
            return true
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update category')
            return false
        }
    }

    const deleteCategory = async (id: number) => {
        try {
            const response = await fetch(`https://api.sabaimoney.com/api/categories/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error('Failed to delete category')
            }

            await fetchCategories()
            return true
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete category')
            return false
        }
    }

    return {
        data,
        error,
        isLoading,
        refetch: fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
    }
}

// Toast Component
const Toast = ({ message, type }: { message: string; type: 'success' | 'error' }) => (
    <div className={`fixed bottom-4 right-4 flex items-center p-4 rounded-lg shadow-lg transition-all duration-300
        ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white z-50`}>
        {type === 'success' ? (
            <Check className="w-5 h-5 mr-2" />
        ) : (
            <AlertCircle className="w-5 h-5 mr-2" />
        )}
        <p>{message}</p>
    </div>
)

// Main Component
const CategoryPage = () => {
    const router = useRouter()
    const params = useParams()
    const lang = params.lang as Locale
    const { token } = useAuthStore()

    const {
        data: categories,
        error: categoryError,
        isLoading,
        createCategory,
        updateCategory,
        deleteCategory
    } = useCategoryData(token || '')

    // Group categories by type
    const groupedCategories = useMemo(() => {
        return categories.reduce((acc, category) => {
            if (!acc[category.type]) {
                acc[category.type] = []
            }
            acc[category.type].push(category)
            return acc
        }, {} as Record<'income' | 'expense', Category[]>)
    }, [categories])


    const [showForm, setShowForm] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'expense' as 'income' | 'expense'
    })
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
    const [dictionary, setDictionary] = useState<any>({});

    // Toast management
    useEffect(() => {
        const initializeDictionary = async () => {
            const dict = await getDictionary(lang);
            setDictionary(dict);
        };

        initializeDictionary();
    }, [lang]);

    if (toast) {
        const timer = setTimeout(() => {
            setToast(null)
        }, 3000)
        return () => clearTimeout(timer)
    }

    // Form handling
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const success = editingCategory
                ? await updateCategory(editingCategory.category_id, formData)
                : await createCategory(formData)

            if (success) {
                setToast({
                    message: `Category ${editingCategory ? 'updated' : 'created'} successfully`,
                    type: 'success'
                })
                resetForm()
            }
        } catch (error) {
            setToast({
                message: `Failed to ${editingCategory ? 'update' : 'create'} category`,
                type: 'error'
            })
        }
    }

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this category?')
        if (confirmDelete) {
            const success = await deleteCategory(id)
            if (success) {
                setToast({ message: 'Category deleted successfully', type: 'success' })
            }
        }
    }

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            type: 'expense'
        })
        setEditingCategory(null)
        setShowForm(false)
    }

    const handleEdit = (category: Category) => {
        setFormData({
            name: category.name,
            description: category.description,
            type: category.type
        })
        setEditingCategory(category)
        setShowForm(true)
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300">Loading categories...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center space-x-4">
                        {/* <button
                            onClick={() => router.push(`/${lang}/dashboard`)}
                            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            {dictionary.categories.backToDashboard}
                        </button> */}
                        <div className="flex items-center">
                            <Tags className="h-8 w-8 text-blue-500" />
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white ml-2">
                                {dictionary.categories.title}
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 w-full md:w-auto">
                        <ThemeToggle />
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg 
                                     hover:bg-blue-600 transition-colors w-full md:w-auto"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            {dictionary.categories.addCategory}
                        </button>
                    </div>
                </div>

                {/* Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 
        transition-opacity duration-300 ease-in-out">
                        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {editingCategory ? dictionary.categories.editCategory : dictionary.categories.newCategory}
                                </h2>
                                <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {dictionary.categories.name}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md
                                                 dark:border-gray-600 dark:bg-gray-700 dark:text-white
                                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                        minLength={2}
                                        maxLength={50}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {dictionary.categories.description}
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md
                                                 dark:border-gray-600 dark:bg-gray-700 dark:text-white
                                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        rows={3}
                                        maxLength={200}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {dictionary.categories.type}
                                    </label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            type: e.target.value as 'income' | 'expense'
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md
                                                 dark:border-gray-600 dark:bg-gray-700 dark:text-white
                                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="expense">{dictionary.categories.categoryType.expense}</option>
                                        <option value="income">{dictionary.categories.categoryType.income}</option>
                                    </select>
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800"
                                    >
                                        {dictionary.categories.actions.cancel}
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        {editingCategory ? dictionary.categories.actions.update : dictionary.categories.actions.create}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}


                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Income Categories */}
                    <div className="bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-200 
                    dark:from-emerald-950/20 dark:via-emerald-950/30 dark:to-emerald-950/40 
                    rounded-xl shadow-md p-6 transition-all duration-300 
                    hover:shadow-lg border border-emerald-100 dark:border-emerald-900/30">
                        <div className="flex items-center mb-4">
                            <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
                            <h2 className="text-xl font-bold text-green-900 dark:text-green-100">
                                {dictionary.categories.sections.incomeCategories}
                            </h2>
                        </div>
                        {groupedCategories.income && groupedCategories.income.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {groupedCategories.income.map((category, index) => (
                                    <div
                                        key={`income-category-${category.category_id}-${index}`}
                                        className="bg-white/60 dark:bg-green-900/40 
                                    backdrop-blur-sm 
                                    rounded-lg shadow-md p-4 
                                    border border-green-100 dark:border-green-800
                                    transform transition-all duration-300 
                                    hover:shadow-lg hover:-translate-y-1 
                                    hover:scale-[1.02]"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-green-900 dark:text-green-100">
                                                {category.name}
                                            </h3>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="text-green-600 hover:text-green-800 dark:hover:text-green-300"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.category_id)}
                                                    className="text-red-500 hover:text-red-700 dark:hover:text-red-300"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-green-800 dark:text-green-200 opacity-80 mb-2">
                                            {category.description || 'No description'}
                                        </p>
                                        <span className="text-xs text-green-600 dark:text-green-300">
                                            Created {new Date(category.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-green-100/50 dark:bg-green-900/30 rounded-lg p-4 text-center">
                                <p className="text-green-600 dark:text-green-300">
                                    {dictionary.categories.sections.noIncomeCategories}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Expense Categories */}
                    <div className="bg-gradient-to-br from-rose-50 via-rose-100 to-rose-200 
                    dark:from-rose-950/20 dark:via-rose-950/30 dark:to-rose-950/40 
                    rounded-xl shadow-md p-6 transition-all duration-300 
                    hover:shadow-lg border border-rose-100 dark:border-rose-900/30">
                        <div className="flex items-center mb-4">
                            <TrendingDown className="h-6 w-6 text-red-600 mr-2" />
                            <h2 className="text-xl font-bold text-red-900 dark:text-red-100">
                                {dictionary.categories.sections.expenseCategories}
                            </h2>
                        </div>
                        {groupedCategories.expense && groupedCategories.expense.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {groupedCategories.expense.map((category, index) => (
                                    <div
                                        key={`expense-category-${category.category_id}-${index}`}
                                        className="bg-white/60 dark:bg-red-900/40 
                                    backdrop-blur-sm 
                                    rounded-lg shadow-md p-4 
                                    border border-red-100 dark:border-red-800
                                    transform transition-all duration-300 
                                    hover:shadow-lg hover:-translate-y-1 
                                    hover:scale-[1.02]"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-red-900 dark:text-red-100">
                                                {category.name}
                                            </h3>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="text-red-600 hover:text-red-800 dark:hover:text-red-300"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.category_id)}
                                                    className="text-red-500 hover:text-red-700 dark:hover:text-red-300"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-red-800 dark:text-red-200 opacity-80 mb-2">
                                            {category.description || 'No description'}
                                        </p>
                                        <span className="text-xs text-red-600 dark:text-red-300">
                                            Created {new Date(category.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-red-100/50 dark:bg-red-900/30 rounded-lg p-4 text-center">
                                <p className="text-red-600 dark:text-red-300">
                                    No expense categories found
                                </p>
                            </div>
                        )}
                    </div>
                </div>

               
            </div>
        </div>
    )
}

export default CategoryPage