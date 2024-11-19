import React, { useState } from 'react';
import { Search, Menu, User as UserIcon, LogOut, Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts';
import { User } from '../../models/User';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    currentUser: User | null;
    onLogout: () => void;
    onLogin: () => void;
}

export const Header = ({ currentUser, onLogout, onLogin }: HeaderProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { theme, toggleTheme } = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
    };

    const handleProfileClick = () => {
        if (currentUser) {
            navigate('/profile');
        } else {
            onLogin();
        }
    };

    const handleLogoClick = () => {
        navigate('/');
    };

    return (
        <header className="bg-white dark:bg-gray-800 shadow-md transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
                    <div className="flex items-center justify-between">
                        <h1
                            className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white cursor-pointer"
                            onClick={handleLogoClick}
                        >
                            USOF
                        </h1>
                        <div className="flex items-center space-x-2 md:hidden">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                {theme === 'light' ? (
                                    <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                ) : (
                                    <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                )}
                            </button>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                            >
                                <Menu className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSearch} className="w-full md:max-w-xl md:mx-8">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={t('header.search')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
                        </div>
                    </form>

                    <div className="hidden md:flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            {theme === 'light' ? (
                                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            ) : (
                                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            )}
                        </button>

                        {currentUser ? (
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                    {currentUser.role}
                                </span>
                                <button
                                    onClick={handleProfileClick}
                                    className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-1"
                                >
                                    {currentUser.profilePicture ? (
                                        <img
                                            src={currentUser.profilePicture}
                                            alt={currentUser.fullName}
                                            className="h-8 w-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                            <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                        </div>
                                    )}
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        {currentUser.fullName}
                                    </span>
                                </button>
                                <button
                                    onClick={onLogout}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                                    title={t('header.logout')}
                                >
                                    <LogOut className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={onLogin}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg"
                            >
                                {t('header.login')}
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <nav className="mt-2 py-2 border-t border-gray-200 dark:border-gray-700">
                            <ul className="space-y-1">
                                {currentUser && (
                                    <li className="px-4 py-2">
                                        <div className="flex items-center space-x-2">
                                            {currentUser.profilePicture ? (
                                                <img
                                                    src={currentUser.profilePicture}
                                                    alt={currentUser.fullName}
                                                    className="h-8 w-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                                    <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                    {currentUser.fullName}
                                                </span>
                                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                                    {currentUser.role}
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                )}
                                <li>
                                    <a
                                        href="/"
                                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        {t('header.home')}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/questions"
                                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        {t('header.questions')}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/tags"
                                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        {t('header.tags')}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/users"
                                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        {t('header.users')}
                                    </a>
                                </li>
                                {currentUser && (
                                    <li>
                                        <button
                                            onClick={onLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            {t('header.logout')}
                                        </button>
                                    </li>
                                )}
                                {!currentUser && (
                                    <li>
                                        <button
                                            onClick={onLogin}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            {t('header.login')}
                                        </button>
                                    </li>
                                )}
                            </ul>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};