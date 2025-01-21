import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  accountName: string;
  isDeleting: boolean;
  dictionary: {
    deleteAccount?: {
      title: string;
      confirmation: string;
      cancel: string;
      confirm: string;
      deleting: string;
    };
  };
}

export function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  accountName,
  isDeleting,
  dictionary
}: DeleteAccountModalProps) {
  if (!isOpen) return null;

  const dict = dictionary.deleteAccount || {
    title: 'Delete Account',
    confirmation: 'Are you sure you want to delete this account? This action cannot be undone.',
    cancel: 'Cancel',
    confirm: 'Delete Account',
    deleting: 'Deleting...'
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            {dict.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {dict.confirmation}
          </p>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Account: {accountName}
          </p>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 
                     dark:text-gray-300 dark:hover:text-white 
                     transition-colors"
          >
            {dict.cancel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-500 text-white rounded-lg
                     hover:bg-red-600 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? dict.deleting : dict.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}