import React, { useEffect, useState } from 'react';
import {
    CheckCircle,
    X,
    AlertCircle,
} from 'lucide-react';

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    status: 'success' | 'error';
    message: string;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
    isOpen,
    onClose,
    status,
    message
}) => {
    const [progress, setProgress] = useState(100);
    const [isExiting, setIsExiting] = useState(false);

    // Handle escape key press and auto-close
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            setIsExiting(false);
            setProgress(100);

            // Auto close success message after 3 seconds
            if (status === 'success') {
                const duration = 3000;
                const startTime = Date.now();

                const timer = setInterval(() => {
                    const elapsed = Date.now() - startTime;
                    const remaining = Math.max(0, duration - elapsed);
                    const newProgress = (remaining / duration) * 100;

                    if (newProgress <= 0) {
                        clearInterval(timer);
                        handleClose();
                    } else {
                        setProgress(newProgress);
                    }
                }, 10);

                return () => {
                    clearInterval(timer);
                };
            }
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, status]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsExiting(false);
            onClose();
        }, 150);
    };

    if (!isOpen) return null;

    const statusConfig = {
        success: {
            icon: CheckCircle,
            baseColor: 'bg-emerald-50 dark:bg-emerald-900/20',
            borderColor: 'border-emerald-200 dark:border-emerald-800/50',
            textColor: 'text-emerald-800 dark:text-emerald-200',
            progressColor: 'bg-emerald-500 dark:bg-emerald-400'
        },
        error: {
            icon: AlertCircle,
            baseColor: 'bg-red-50 dark:bg-red-900/20',
            borderColor: 'border-red-200 dark:border-red-800/50',
            textColor: 'text-red-800 dark:text-red-200',
            progressColor: 'bg-red-500 dark:bg-red-400'
        }
    };

    const config = statusConfig[status];

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center 
                       transition-opacity duration-200 
                       ${isExiting ? 'opacity-0' : 'opacity-100'}`}
            onClick={handleClose}
        >
            <div className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm" />

            <div
                className={`
                    relative max-w-sm w-full mx-4 rounded-xl shadow-lg 
                    border ${config.borderColor} ${config.baseColor}
                    transform transition-all duration-200 
                    ${isExiting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}
                `}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4">
                    <div className="flex items-start gap-3">
                        <config.icon
                            className={`w-5 h-5 flex-shrink-0 ${config.textColor}`}
                        />

                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${config.textColor}`}>
                                {message}
                            </p>
                        </div>

                        <button
                            onClick={handleClose}
                            className={`
                                -mr-1 flex-shrink-0 p-1.5 rounded-lg 
                                ${config.textColor} opacity-60 hover:opacity-100
                                transition-opacity duration-200
                            `}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {status === 'success' && (
                    <div className="relative h-1 w-full rounded-b-xl overflow-hidden">
                        <div
                            className={`absolute inset-0 ${config.progressColor} transition-all duration-75 ease-linear`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};