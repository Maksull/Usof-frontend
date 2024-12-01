import React, { useState, ChangeEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthService } from '../../services';
import { NotificationModal, ErrorModal } from '..';
import config from '../../config';
import { Lock, ChevronLeft, Loader2, Eye, EyeOff, KeyRound, Save, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PasswordInputProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    show: boolean;
    onToggleShow: () => void;
    placeholder: string;
    label: string;
    name: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
    value,
    onChange,
    show,
    onToggleShow,
    placeholder,
    label,
    name
}) => {
    const { t } = useTranslation();

    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label}
            </label>
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
                <input
                    id={name}
                    name={name}
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                    required
                    autoComplete={name}
                    aria-label={label}
                />
                <button
                    type="button"
                    onClick={onToggleShow}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                    aria-label={show ? t('password.hidePassword') : t('password.showPassword')}
                >
                    {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
            </div>
        </div>
    );
};

export const ChangePasswordPage: React.FC = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false
    });
    const [loading, setLoading] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [errorData, setErrorData] = useState({
        message: '',
        details: '',
        code: ''
    });

    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const showError = (message: string, details?: string, code?: string) => {
        setErrorData({
            message,
            details: details || '',
            code: code || ''
        });
        setIsErrorModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            showError(
                t('changePassword.errors.passwordMismatch'),
                t('changePassword.errors.passwordMismatchDetails')
            );
            return;
        }

        if (formData.newPassword.length < 6) {
            showError(
                t('changePassword.errors.passwordTooShort'),
                t('changePassword.errors.passwordTooShortDetails')
            );
            return;
        }

        setLoading(true);

        try {
            await axios.post(`${config.backendUrl}/auth/change-password`, {
                token,
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword
            });

            setIsSuccessModalOpen(true);
            await AuthService.logout();
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err: unknown) {
            let errorMessage = t('changePassword.errors.generic');
            let errorCode = '';

            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data?.error || errorMessage;
                errorCode = err.response?.status?.toString() || '';
            }

            showError(
                errorMessage,
                t('changePassword.errors.serverError'),
                errorCode
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6">
            <div className="max-w-md mx-auto">
                <Link
                    to="/"
                    className="mb-6 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    {t('common.backToHome')}
                </Link>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transition-all duration-300">
                    <div className="px-6 py-8">
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <KeyRound className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {t('changePassword.title')}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <PasswordInput
                                name="oldPassword"
                                value={formData.oldPassword}
                                onChange={handleInputChange}
                                show={showPasswords.oldPassword}
                                onToggleShow={() => togglePasswordVisibility('oldPassword')}
                                placeholder={t('changePassword.currentPasswordPlaceholder')}
                                label={t('changePassword.currentPasswordLabel')}
                            />
                            <PasswordInput
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                show={showPasswords.newPassword}
                                onToggleShow={() => togglePasswordVisibility('newPassword')}
                                placeholder={t('changePassword.newPasswordPlaceholder')}
                                label={t('changePassword.newPasswordLabel')}
                            />
                            <PasswordInput
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                show={showPasswords.confirmPassword}
                                onToggleShow={() => togglePasswordVisibility('confirmPassword')}
                                placeholder={t('changePassword.confirmPasswordPlaceholder')}
                                label={t('changePassword.confirmPasswordLabel')}
                            />

                            <div className="flex items-center justify-end space-x-4 pt-2">
                                <Link
                                    to="/"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center space-x-2"
                                >
                                    <X className="w-4 h-4" />
                                    <span>{t('common.cancel')}</span>
                                </Link>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>{t('changePassword.changingPassword')}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            <span>{t('changePassword.submitButton')}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <NotificationModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                status="success"
                message={t('changePassword.successMessage')}
            />

            <ErrorModal
                isOpen={isErrorModalOpen}
                onClose={() => setIsErrorModalOpen(false)}
                error={{
                    message: errorData.message,
                    details: errorData.details,
                    code: errorData.code
                }}
            />
        </div>
    );
};