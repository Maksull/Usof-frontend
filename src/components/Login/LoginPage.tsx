import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services';

interface LoginPageProps {
    onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const inputClasses = "appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-800 transition-colors duration-200";
    const firstInputClasses = `${inputClasses} rounded-t-md`;
    const middleInputClasses = inputClasses;
    const lastInputClasses = `${inputClasses} rounded-b-md`;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            let user;
            if (isRegister) {
                user = await AuthService.register({ login, password, email, fullName });
            } else {
                user = await AuthService.login({ login, password });
            }

            if (!isRegister) {
                onLogin();
            }


            navigate('/');
        } catch (error: any) {
            setError(error.response?.data?.message || 'Authentication failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-900 p-8 rounded-lg shadow-xl">
                <div>
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        {isRegister ? 'Create an account' : 'Sign in to your account'}
                    </h2>
                    {error && (
                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-md text-center">
                            {error}
                        </div>
                    )}
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="login" className="sr-only">Username</label>
                            <input
                                id="login"
                                name="login"
                                type="text"
                                required
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                className={isRegister ? firstInputClasses : firstInputClasses}
                                placeholder="Username"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={isRegister ? middleInputClasses : lastInputClasses}
                                placeholder="Password"
                            />
                        </div>
                        {isRegister && (
                            <>
                                <div>
                                    <label htmlFor="email" className="sr-only">Email</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={middleInputClasses}
                                        placeholder="Email"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="fullName" className="sr-only">Full Name</label>
                                    <input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className={lastInputClasses}
                                        placeholder="Full Name"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-sm"
                        >
                            {isRegister ? 'Create account' : 'Sign in'}
                        </button>
                    </div>
                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => setIsRegister(!isRegister)}
                            className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                        >
                            {isRegister
                                ? 'Already have an account? Sign in'
                                : 'Need an account? Register'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};