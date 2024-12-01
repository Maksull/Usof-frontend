import { AlertCircle, X, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    error: {
        message: string;
        details?: string;
        code?: string;
        action?: {
            label: string;
            onClick: () => void;
        };
    };
}

export const ErrorModal = ({
    isOpen,
    onClose,
    title,
    error
}: ErrorModalProps) => {
    const { t } = useTranslation();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full shadow-xl transform transition-all">
                {/* Header */}
                <div className="flex items-start justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {title || t('error.title', 'An Error Occurred')}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        aria-label={t('common.close', 'Close')}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-4">
                        <p className="text-base font-medium text-gray-900 dark:text-white mb-2">
                            {error.message}
                        </p>
                        {error.details && (
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {error.details}
                            </p>
                        )}
                    </div>

                    {/* {error.code && (
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 mb-4">
                            <p className="text-sm font-mono text-gray-600 dark:text-gray-400">
                                {t('error.code', 'Error Code')}: {error.code}
                            </p>
                        </div>
                    )} */}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl">
                    {error.action && (
                        <button
                            onClick={error.action.onClick}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                        >
                            {error.action.label}
                            <ExternalLink className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors"
                    >
                        {t('common.cancel', 'Cancel')}
                    </button>
                </div>
            </div>
        </div>
    );
};
