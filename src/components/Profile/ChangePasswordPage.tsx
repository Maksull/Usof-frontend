import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthService } from '../../services';
import { NotificationModal } from '..';
import config from '../../config';
import {
    Lock,
    ChevronLeft,
    Loader2,
    Eye,
    EyeOff,
    KeyRound,
    Save,
    X
} from 'lucide-react';

type ModalStatus = 'success' | 'error';

// Change Password Page
export const ChangePasswordPage: React.FC = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

        // Validation
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }
        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${config.backendUrl}/auth/change-password`, {
                token,
                oldPassword,
                newPassword,
                confirmPassword
            });

            setModalStatus('success');
            setModalMessage('Password successfully changed! Redirecting to login...');
            setIsModalOpen(true);

            AuthService.logout();
            setTimeout(() => { navigate('/login') }, 3000);
        } catch (error) {
            const errorMessage = axios.isAxiosError(error)
                ? error.response?.data?.error || 'Failed to change password'
                : 'Failed to change password';

            setError(errorMessage);
            setModalStatus('error');
            setModalMessage(errorMessage);
            setIsModalOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const PasswordInput = ({
        value,
        onChange,
        show,
        onToggleShow,
        placeholder,
        label
    }: {
        value: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        show: boolean;
        onToggleShow: () => void;
        placeholder: string;
        label: string;
    }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label}
            </label>
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 
                               text-gray-400 dark:text-gray-500 h-5 w-5" />
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 
                             dark:border-gray-600 rounded-lg shadow-sm 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                             transition-all duration-200"
                    required
                />
                <button
                    type="button"
                    onClick={onToggleShow}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 
                             text-gray-400 hover:text-gray-600 dark:text-gray-500 
                             dark:hover:text-gray-300 transition-colors"
                >
                    {show ? (
                        <EyeOff className="h-5 w-5" />
                    ) : (
                        <Eye className="h-5 w-5" />
                    )}
                </button>
            </div>
        </div>
    );

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
                                <KeyRound className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Change Password
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
                            <PasswordInput
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                show={showOldPassword}
                                onToggleShow={() => setShowOldPassword(!showOldPassword)}
                                placeholder="Enter current password"
                                label="Current Password"
                            />

                            <PasswordInput
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                show={showNewPassword}
                                onToggleShow={() => setShowNewPassword(!showNewPassword)}
                                placeholder="Enter new password"
                                label="New Password"
                            />

                            <PasswordInput
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                show={showConfirmPassword}
                                onToggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
                                placeholder="Confirm new password"
                                label="Confirm New Password"
                            />

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
                                            <span>Changing Password...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            <span>Change Password</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
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

