import { useState } from 'react';
import { Search, Menu, User, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../ThemeContext';
import { useTranslation } from 'react-i18next';

interface User {
    name: string;
    role: string;
    avatarUrl?: string;
}

interface HeaderProps {
    currentUser?: User;
    onLogout: () => void;
    onLogin: () => void;
}

export const Header = ({ currentUser, onLogout, onLogin }: HeaderProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { theme, toggleTheme } = useTheme();
    const { t } = useTranslation();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
    };

    const handleProfileClick = () => {
        if (currentUser) {
            console.log('Navigating to profile');
        } else {
            onLogin();
        }
    };

    return (
        <header className="bg-white dark:bg-gray-800 shadow-md transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo/Service Name */}
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">USOF</h1>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-8">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={t('header.search')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border 
                         border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 
                         text-gray-900 dark:text-gray-100
                         focus:outline-none focus:border-blue-500 
                         dark:focus:border-blue-400
                         transition-colors duration-200"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
                        </div>
                    </form>

                    {/* User Section */}
                    <div className="flex items-center space-x-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
                       transition-colors duration-200"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? (
                                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            ) : (
                                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            )}
                        </button>

                        {currentUser ? (
                            <>
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                    {currentUser.role}
                                </span>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={handleProfileClick}
                                        className="flex items-center space-x-2 hover:bg-gray-100 
                             dark:hover:bg-gray-700 rounded-full p-1
                             transition-colors duration-200"
                                    >
                                        {currentUser.avatarUrl ? (
                                            <img
                                                src={currentUser.avatarUrl}
                                                alt={currentUser.name}
                                                className="h-8 w-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-8 w-8 rounded-full bg-gray-200 
                                    dark:bg-gray-600 flex items-center justify-center">
                                                <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                            </div>
                                        )}
                                        <span className="text-sm font-medium text-gray-700 
                                   dark:text-gray-200">
                                            {currentUser.name}
                                        </span>
                                    </button>
                                    <button
                                        onClick={onLogout}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 
                             rounded-full transition-colors duration-200"
                                        title={t('header.logout')}
                                    >
                                        <LogOut className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <button
                                onClick={onLogin}
                                className="px-4 py-2 text-sm font-medium text-white 
                         bg-blue-600 hover:bg-blue-700 
                         dark:bg-blue-500 dark:hover:bg-blue-600 
                         rounded-lg transition-colors duration-200"
                            >
                                {t('header.login')}
                            </button>
                        )}

                        {/* Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 
                       rounded-full transition-colors duration-200"
                        >
                            <Menu className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Menu Bar */}
                {isMenuOpen && (
                    <nav className="mt-2 py-2 border-t border-gray-200 dark:border-gray-700">
                        <ul className="space-y-1">
                            <li>
                                <a href="/" className="block px-4 py-2 text-sm text-gray-700 
                                    dark:text-gray-200 hover:bg-gray-100 
                                    dark:hover:bg-gray-700 rounded-lg 
                                    transition-colors duration-200">
                                    {t('header.home')}
                                </a>
                            </li>
                            <li>
                                <a href="/questions" className="block px-4 py-2 text-sm 
                                             text-gray-700 dark:text-gray-200 
                                             hover:bg-gray-100 dark:hover:bg-gray-700 
                                             rounded-lg transition-colors duration-200">
                                    {t('header.questions')}
                                </a>
                            </li>
                            <li>
                                <a href="/tags" className="block px-4 py-2 text-sm text-gray-700 
                                        dark:text-gray-200 hover:bg-gray-100 
                                        dark:hover:bg-gray-700 rounded-lg 
                                        transition-colors duration-200">
                                    {t('header.tags')}
                                </a>
                            </li>
                            <li>
                                <a href="/users" className="block px-4 py-2 text-sm text-gray-700 
                                         dark:text-gray-200 hover:bg-gray-100 
                                         dark:hover:bg-gray-700 rounded-lg 
                                         transition-colors duration-200">
                                    {t('header.users')}
                                </a>
                            </li>
                        </ul>
                    </nav>
                )}
            </div>
        </header>
    );
};
