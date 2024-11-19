import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthService } from '../../services';
import { NotificationModal } from '..';
import config from '../../config';

type ModalStatus = 'success' | 'error';

export const ChangeEmailPage: React.FC = () => {
    const [newEmail, setNewEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStatus, setModalStatus] = useState<ModalStatus>('success');
    const [modalMessage, setModalMessage] = useState('');
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        setLoading(true);

        try {
            await axios.post(`${config.backendUrl}/auth/change-email`, {
                token,
                newEmail,
            });

            // Show success modal
            setModalStatus('success');
            setModalMessage('Email successfully changed! Redirecting to login...');
            setIsModalOpen(true);
            AuthService.logout();

            // Redirect after a delay
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.error || 'Failed to change email';
                setError(errorMessage);
                setModalStatus('error');
                setModalMessage(errorMessage);
                setIsModalOpen(true);
            } else {
                setError('Failed to change email');
                setModalStatus('error');
                setModalMessage('Failed to change email');
                setIsModalOpen(true);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                    Change Email Address
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="text-red-500 text-sm mb-4">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            New Email Address
                        </label>
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                        />
                    </div>

                    <div className="flex justify-between">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Changing Email...' : 'Change Email'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>

            <NotificationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                status={modalStatus}
                message={modalMessage}
            />
        </div>
    );
};