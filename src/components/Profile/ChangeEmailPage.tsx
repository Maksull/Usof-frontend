import { ChevronLeft, Info, Loader2, Mail, Save, X } from "lucide-react";
import { NotificationModal } from "..";
import { AuthService } from "../../services";
import axios from "axios";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import config from "../../config";

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
                newEmail
            });

            setModalStatus('success');
            setModalMessage('Email successfully changed! Redirecting to login...');
            setIsModalOpen(true);

            AuthService.logout();
            setTimeout(() => { navigate('/login') }, 3000);
        } catch (error) {
            const errorMessage = axios.isAxiosError(error)
                ? error.response?.data?.error || 'Failed to change email'
                : 'Failed to change email';

            setError(errorMessage);
            setModalStatus('error');
            setModalMessage(errorMessage);
            setIsModalOpen(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6">
            <div className="max-w-md mx-auto">
                <button
                    onClick={() => navigate('/')}
                    className="mb-6 flex items-center text-gray-600 dark:text-gray-400 
                             hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Back to Home
                </button>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl 
                              overflow-hidden transition-all duration-300">
                    <div className="px-6 py-8">
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Change Email Address
                            </h2>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 
                                          border border-red-200 dark:border-red-800/50 
                                          rounded-lg text-red-600 dark:text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 
                                                dark:text-gray-300 mb-2">
                                    New Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                                   text-gray-400 dark:text-gray-500 h-5 w-5" />
                                    <input
                                        type="email"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        placeholder="Enter new email address"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 
                                                 dark:border-gray-600 rounded-lg shadow-sm 
                                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                                                 transition-all duration-200"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end space-x-4 pt-2">
                                <button
                                    type="button"
                                    onClick={() => navigate('/')}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 
                                             bg-gray-100 hover:bg-gray-200 dark:text-gray-300 
                                             dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg 
                                             transition-colors flex items-center space-x-2"
                                >
                                    <X className="w-4 h-4" />
                                    <span>Cancel</span>
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 text-sm font-medium text-white 
                                             bg-blue-600 hover:bg-blue-700 rounded-lg 
                                             transition-colors flex items-center space-x-2 
                                             disabled:opacity-50 disabled:cursor-not-allowed
                                             shadow-lg hover:shadow-xl"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Changing Email...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            <span>Change Email</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Info Box */}
                        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="text-sm text-blue-700 dark:text-blue-300">
                                    After changing your email address, you'll be logged out and need to sign in again with your new email address.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
