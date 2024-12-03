import React, { useState, useRef, useEffect } from 'react';
import { Menu, User as UserIcon, LogOut, Sun, Moon, ChevronDown, FileText, MessageSquare, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts';
import { Link } from 'react-router-dom';
import { User, UserRole } from '../../models';
import { SearchBar } from './SearchBar';

interface HeaderProps {
    currentUser: User | null;
    onLogout: () => void;
    onLogin: () => void;
    setPosts: React.Dispatch<React.SetStateAction<any[]>>;
    setPagination: React.Dispatch<React.SetStateAction<any>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setErrorDetails?: (error: { message: string; details?: string; code?: string; }) => void;
    setShowErrorModal?: (show: boolean) => void;
}

export const Header = ({
    currentUser,
    onLogout,
    onLogin,
    setPosts,
    setPagination,
    setIsLoading,
    setErrorDetails,
    setShowErrorModal
}: HeaderProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { t } = useTranslation();
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
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent hover:from-blue-500 hover:to-blue-300 transition-all duration-300">
                            USOF
                        </Link>
                    </div>
                    <div ref={searchRef} className={`hidden md:block relative flex-grow max-w-xl mx-8 ${isSearchFocused ? 'z-20' : ''}`}>
                        <SearchBar
                            onSearch={({ posts, pagination }) => {
                                setPosts(posts);
                                setPagination(pagination);
                            }}
                            setIsLoading={setIsLoading}
                            setErrorDetails={setErrorDetails}
                            setShowErrorModal={setShowErrorModal}
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                            aria-label={theme === 'light' ? t('header.switchToDark') : t('header.switchToLight')}
                        >
                            {theme === 'light' ? (
                                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            ) : (
                                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            )}
                        </button>

                        {currentUser ? (
                            <div className="relative" ref={profileMenuRef}>
                                <div className="flex items-center space-x-3">
                                    <Link
                                        to="/profile"
                                        className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full transition-transform hover:scale-105"
                                        aria-label={t('header.goToProfile')}
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
                                    <button
                                        onClick={handleProfileClick}
                                        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <div className="hidden md:block text-left">
                                            <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                {currentUser.fullName}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {t(`header.roles.${currentUser.role.toLowerCase()}`)}
                                            </div>
                                        </div>
                                        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                </div>

                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                                        {currentUser?.role === UserRole.ADMIN && (
                                            <Link
                                                to="/admin"
                                                className="px-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <ShieldCheck className="h-4 w-4 mr-2" />
                                                {t('header.adminPanel')}
                                            </Link>
                                        )}
                                        <Link
                                            to="/profile"
                                            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <UserIcon className="h-4 w-4 mr-2" />
                                            {t('header.profileSettings')}
                                        </Link>
                                        <Link
                                            to="/my-posts"
                                            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <FileText className="h-4 w-4 mr-2" />
                                            {t('header.myPosts')}
                                        </Link>
                                        <Link
                                            to="/my-comments"
                                            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <MessageSquare className="h-4 w-4 mr-2" />
                                            {t('header.myComments')}
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
                            <Link
                                to="/login"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                            >
                                {t('header.login')}
                            </Link>
                        )}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <Menu className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden mt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="py-4">
                            <SearchBar
                                onSearch={({ posts, pagination }) => {
                                    setPosts(posts);
                                    setPagination(pagination);
                                    setIsMenuOpen(false);
                                }}
                                setIsLoading={setIsLoading}
                                setErrorDetails={setErrorDetails}
                                setShowErrorModal={setShowErrorModal}
                            />
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};