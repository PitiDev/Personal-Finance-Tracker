import React from 'react'
import { X } from 'lucide-react'
import TransactionForm from './TransactionForm'

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  dictionary: any
}

const TransactionModal = ({ isOpen, onClose, onSuccess, dictionary }: TransactionModalProps) => {
  if (!isOpen) return null

  const handleSuccess = () => {
    onSuccess()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="p-6">
          <TransactionForm
            onSuccess={handleSuccess}
            onCancel={onClose}
            dictionary={dictionary}
          />
        </div>
      </div>
    </div>
  )
}

export default TransactionModal