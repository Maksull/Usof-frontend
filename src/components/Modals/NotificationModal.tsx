import React, { useEffect } from 'react';

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    status: 'success' | 'error';
    message: string;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose, status, message }) => {
    // Handle escape key press
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Auto close success message after 3 seconds
            if (status === 'success') {
                const timer = setTimeout(onClose, 3000);
                return () => clearTimeout(timer);
            }
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose, status]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`
                max-w-sm w-full mx-4 p-4 rounded-lg shadow-lg
                ${status === 'success' ? 'bg-green-50 dark:bg-green-900' : 'bg-red-50 dark:bg-red-900'}
            `}>
                <div className="flex items-center gap-3">
                    {status === 'success' ? (
                        <svg className="w-6 h-6 text-green-500 dark:text-green-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M5 13l4 4L19 7"></path>
                        </svg>
                    ) : (
                        <svg className="w-6 h-6 text-red-500 dark:text-red-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    )}
                    <p className={`flex-1 text-sm ${status === 'success' ? 'text-green-700 dark:text-green-200' : 'text-red-700 dark:text-red-200'}`}>
                        {message}
                    </p>
                    <button
                        onClick={onClose}
                        className={`p-1 hover:opacity-70 ${status === 'success' ? 'text-green-700 dark:text-green-200' : 'text-red-700 dark:text-red-200'}`}
                    >
                        <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
