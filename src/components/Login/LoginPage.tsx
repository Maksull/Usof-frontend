import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthService } from '../../services';
import { User, Lock, Mail, UserPlus, LogIn, Loader2, AlertCircle, KeyRound, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
    onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const { t } = useTranslation();
    const [isRegister, setIsRegister] = useState(false);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            if (isRegister) {
                await AuthService.register({ login, password, email, fullName });
            } else {
                await AuthService.login({ login, password });
                onLogin();
            }
            navigate('/');
        } catch (error: any) {
            setError(error.response?.data?.message || t('auth.errors.generic'));
        } finally {
            setIsLoading(false);
        }
    };

    const inputBaseClasses = `
    w-full px-4 py-3 pl-12 rounded-lg
    bg-white dark:bg-gray-800 
    border border-gray-300 dark:border-gray-600
    text-gray-900 dark:text-gray-100
    placeholder-gray-500 dark:placeholder-gray-400
    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    transition-all duration-200
  `;

    const IconWrapper = ({ children }: { children: React.ReactNode }) => (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {children}
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
                    <div className="px-8 pt-8">
                        <div className="text-center space-y-3">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                                {isRegister ? (
                                    <UserPlus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                ) : (
                                    <KeyRound className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                )}
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {isRegister ? t('auth.register.title') : t('auth.login.title')}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                {isRegister ? t('auth.register.subtitle') : t('auth.login.subtitle')}
                            </p>
                        </div>

                        {error && (
                            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl flex items-center space-x-3">
                                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <IconWrapper>
                                    <User className="w-5 h-5" />
                                </IconWrapper>
                                <input
                                    id="login"
                                    type="text"
                                    required
                                    value={login}
                                    onChange={(e) => setLogin(e.target.value)}
                                    className={inputBaseClasses}
                                    placeholder={t('auth.form.usernamePlaceholder')}
                                />
                            </div>

                            <div className="relative">
                                <IconWrapper>
                                    <Lock className="w-5 h-5" />
                                </IconWrapper>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`${inputBaseClasses} pr-12`}
                                    placeholder={t('auth.form.passwordPlaceholder')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>

                            {isRegister && (
                                <>
                                    <div className="relative">
                                        <IconWrapper>
                                            <Mail className="w-5 h-5" />
                                        </IconWrapper>
                                        <input
                                            id="email"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={inputBaseClasses}
                                            placeholder={t('auth.form.emailPlaceholder')}
                                        />
                                    </div>
                                    <div className="relative">
                                        <IconWrapper>
                                            <User className="w-5 h-5" />
                                        </IconWrapper>
                                        <input
                                            id="fullName"
                                            type="text"
                                            required
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className={inputBaseClasses}
                                            placeholder={t('auth.form.fullNamePlaceholder')}
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>
                                        {isRegister
                                            ? t('auth.form.creatingAccount')
                                            : t('auth.form.signingIn')}
                                    </span>
                                </>
                            ) : (
                                <>
                                    {isRegister ? <UserPlus className="w-5 h-5" /> : <LogIn />}
                                    <span>
                                        {isRegister
                                            ? t('auth.form.createAccount')
                                            : t('auth.form.signIn')}
                                    </span>
                                </>
                            )}
                        </button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsRegister(!isRegister);
                                    setError(null);
                                    setPassword('');
                                    setShowPassword(false);
                                }}
                                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                            >
                                {isRegister
                                    ? t('auth.form.alreadyHaveAccount')
                                    : t('auth.form.needAccount')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};