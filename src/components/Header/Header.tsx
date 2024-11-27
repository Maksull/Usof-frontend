import React, { useState, useRef, useEffect } from 'react';
import {
    Search,
    Menu,
    User as UserIcon,
    LogOut,
    Sun,
    Moon,
    ChevronDown,
    X,
    FileText,
    MessageSquare
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts';
import { useNavigate, Link } from 'react-router-dom';
import { User } from '../../models';

interface HeaderProps {
    currentUser: User | null;
    onLogout: () => void;
    onLogin: () => void;
}

export const Header = ({ currentUser, onLogout, onLogin }: HeaderProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const searchRef = useRef<HTMLDivElement>(null);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?searchQuery=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchFocused(false);
        } else {
            navigate('/');
        }
    };

    const handleProfileClick = () => {
        if (currentUser) {
            setIsProfileMenuOpen(!isProfileMenuOpen);
        } else {
            onLogin();
        }
    };


    return (
        <header className="bg-white dark:bg-gray-800 shadow-lg transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link
                            to={`/`}
                            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 
                                     bg-clip-text text-transparent hover:from-blue-500 hover:to-blue-300 
                                     transition-all duration-300"
                        >
                            USOF
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div
                        ref={searchRef}
                        className={`hidden md:block relative flex-grow max-w-xl mx-8 ${isSearchFocused ? 'z-20' : ''
                            }`}
                    >
                        <form onSubmit={handleSearch}>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={t('header.search')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    className={`w-full px-4 py-2 pl-10 pr-4 rounded-lg border 
                                             transition-all duration-200
                                             ${isSearchFocused
                                            ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                                            : 'border-gray-300 dark:border-gray-600'
                                        } 
                                             bg-white dark:bg-gray-700 
                                             text-gray-900 dark:text-gray-100`}
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                                 text-gray-400 dark:text-gray-500 h-5 w-5" />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 
                                                 text-gray-400 hover:text-gray-600 dark:text-gray-500 
                                                 dark:hover:text-gray-300"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* User Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
                                     transition-colors duration-200"
                            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                        >
                            {theme === 'light' ? (
                                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            ) : (
                                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            )}
                        </button>

                        {/* User Profile / Login */}
                        {currentUser ? (
                            <div className="relative" ref={profileMenuRef}>
                                <div className="flex items-center space-x-3">
                                    {/* Profile Picture - Direct Link to Profile */}
                                    <Link
                                        to={`/profile`}
                                        className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 
                         rounded-full transition-transform hover:scale-105"
                                        aria-label="Go to profile"
                                    >
                                        {currentUser.profilePicture ? (
                                            <img
                                                src={currentUser.profilePicture}
                                                alt={currentUser.fullName}
                                                className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-500"
                                            />
                                        ) : (
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center ring-2 ring-blue-500">
                                                <UserIcon className="h-5 w-5 text-white" />
                                            </div>
                                        )}
                                    </Link>

                                    {/* Dropdown Menu Button */}
                                    <button
                                        onClick={handleProfileClick}
                                        className="flex items-center space-x-3 px-3 py-2 rounded-lg
                         hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <div className="hidden md:block text-left">
                                            <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                {currentUser.fullName}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {currentUser.role}
                                            </div>
                                        </div>
                                        <ChevronDown
                                            className={`h-4 w-4 text-gray-500 transition-transform duration-200 
                             ${isProfileMenuOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                </div>

                                {/* Dropdown Menu - remains the same */}
                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                                        <Link
                                            to="/profile"
                                            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <UserIcon className="h-4 w-4 mr-2" />
                                            Profile Settings
                                        </Link>
                                        <Link
                                            to="/my-posts"
                                            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <FileText className="h-4 w-4 mr-2" />
                                            My Posts
                                        </Link>
                                        <Link
                                            to="/my-comments"
                                            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <MessageSquare className="h-4 w-4 mr-2" />
                                            My Comments
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setIsProfileMenuOpen(false);
                                                onLogout();
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            {t('header.logout')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={onLogin}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 
                                         hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 
                                         rounded-lg transition-colors duration-200 shadow-md 
                                         hover:shadow-lg"
                            >
                                {t('header.login')}
                            </button>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <Menu className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 border-t border-gray-200 dark:border-gray-700">
                        {/* Mobile Search */}
                        <div className="py-4">
                            <form onSubmit={handleSearch}>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder={t('header.search')}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border 
                                                 border-gray-300 dark:border-gray-600 
                                                 bg-white dark:bg-gray-700 
                                                 text-gray-900 dark:text-gray-100"
                                    />
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                                     text-gray-400 dark:text-gray-500 h-5 w-5" />
                                </div>
                            </form>
                        </div>

                    </div>
                )}
            </div>
        </header>
    );
};
