import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, ArrowLeft, Check } from 'lucide-react';
import axios from 'axios';
import config from '../../config';

export const ForgotPasswordForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [step, setStep] = useState<'email' | 'token' | 'reset'>('email');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { token } = useParams();

    useEffect(() => {
        if (token) {
            setResetToken(token);
            setStep('reset');
        }
    }, [token]);

    const handleSendResetEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await axios.post(`${config.backendUrl}/auth/forgot-password`, { email });
            setSuccess('Reset instructions sent to your email');
            setStep('token');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to send reset email');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyToken = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await axios.get(`${config.backendUrl}/auth/validate-reset-token/${resetToken}`);
            setStep('reset');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Invalid or expired token');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await axios.post(`${config.backendUrl}/auth/reset-password`, {
                token: resetToken,
                newPassword,
                confirmPassword
            });
            setSuccess('Password reset successfully');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    const inputClasses = `
    w-full px-4 py-3 rounded-lg
    bg-white dark:bg-gray-800 
    border border-gray-300 dark:border-gray-600
    text-gray-900 dark:text-gray-100
    placeholder-gray-500 dark:placeholder-gray-400
    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    transition-all duration-200
  `;

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                    <div className="space-y-6">
                        <button
                            onClick={() => navigate('/login')}
                            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Login
                        </button>

                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Reset Password
                            </h2>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                {step === 'email' && "Enter your email to receive reset instructions"}
                                {step === 'token' && "Enter the reset token from your email"}
                                {step === 'reset' && "Create a new password"}
                            </p>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg flex items-center">
                                <Check className="w-5 h-5 mr-2" />
                                {success}
                            </div>
                        )}

                        {step === 'email' && (
                            <form onSubmit={handleSendResetEmail} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={inputClasses}
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 flex items-center justify-center"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        'Send Reset Instructions'
                                    )}
                                </button>
                            </form>
                        )}

                        {step === 'token' && (
                            <form onSubmit={handleVerifyToken} className="space-y-6">
                                <div>
                                    <label htmlFor="token" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Reset Token
                                    </label>
                                    <input
                                        id="token"
                                        type="text"
                                        required
                                        value={resetToken}
                                        onChange={(e) => setResetToken(e.target.value)}
                                        className={inputClasses}
                                        placeholder="Enter reset token"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 flex items-center justify-center"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        'Verify Token'
                                    )}
                                </button>
                            </form>
                        )}

                        {step === 'reset' && (
                            <form onSubmit={handleResetPassword} className="space-y-6">
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        id="newPassword"
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className={inputClasses}
                                        placeholder="Enter new password"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={inputClasses}
                                        placeholder="Confirm new password"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 flex items-center justify-center"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        'Reset Password'
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
