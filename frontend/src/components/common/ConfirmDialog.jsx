// Generic confirmation dialog used across the app
import React from 'react';
import { createPortal } from 'react-dom';

const ConfirmDialog = ({ open, title, description, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel }) => {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative w-full max-w-md mx-4 rounded-xl shadow-lg overflow-hidden">
        <div className="bg-white dark:bg-gray-800">
          <div className="px-6 py-5 border-b dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            {description && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{description}</p>
            )}
          </div>
          <div className="px-6 py-4 flex items-center justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmDialog;


