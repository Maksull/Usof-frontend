import React, { useState } from 'react';
import { User } from '../../models';
import { UsersService } from '../../services';
import axios from 'axios';
import { NotificationModal } from '../Modals/NotificationModal';
import config from '../../config';
import { mapDtoToUser } from '../../utils/mapping';
import { Edit3, Upload, Mail, Lock, Star, User as UserIcon, AtSign, Save, X, Loader2, BadgeCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface EditableUserData {
    fullName: string;
    email: string;
    login: string;
}

interface ProfilePageProps {
    user: User | null;
    onUserUpdate: (user: User) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUserUpdate }) => {
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editData, setEditData] = useState<EditableUserData>({
        fullName: user?.fullName || '',
        email: user?.email || '',
        login: user?.login || ''
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStatus, setModalStatus] = useState<'success' | 'error'>('success');
    const [modalMessage, setModalMessage] = useState('');

    if (!user) return null;

    const showNotification = (status: 'success' | 'error', message: string) => {
        setModalStatus(status);
        setModalMessage(message);
        setIsModalOpen(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const updatedUser = mapDtoToUser(
                await UsersService.updateProfile({
                    login: editData.login,
                    fullName: editData.fullName
                })
            );
            onUserUpdate(updatedUser);
            setIsEditing(false);
            showNotification('success', t('profile.updateSuccess'));
        } catch (error: any) {
            showNotification('error', error.response?.data?.error || t('profile.updateError'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsLoading(true);
            try {
                const updatedUser = mapDtoToUser(await UsersService.updateProfileImage(file));
                onUserUpdate(updatedUser);
                showNotification('success', t('profile.imageUpdateSuccess'));
            } catch (error: any) {
                showNotification('error', error.response?.data?.error || t('profile.imageUpdateError'));
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleEmailChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.post(`${config.backendUrl}/auth/initiate-email-change`);
            showNotification('success', t('profile.emailChangeInstructions'));
        } catch (error) {
            if (axios.isAxiosError(error)) {
                showNotification('error', error.response?.data?.error || t('profile.emailChangeError'));
            } else {
                showNotification('error', t('profile.emailChangeError'));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.post(`${config.backendUrl}/auth/initiate-password-change`);
            showNotification('success', t('profile.passwordChangeInstructions'));
        } catch (error) {
            if (axios.isAxiosError(error)) {
                showNotification('error', error.response?.data?.error || t('profile.passwordChangeError'));
            } else {
                showNotification('error', t('profile.passwordChangeError'));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditData({
            fullName: user.fullName,
            email: user.email,
            login: user.login
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transition-all duration-300">
                <div className="relative h-32 bg-gradient-to-r from-blue-600 to-blue-400">
                    <div className="absolute -bottom-16 left-6 md:left-8">
                        <div className="relative">
                            {user.profilePicture ? (
                                <img
                                    src={user.profilePicture}
                                    alt={user.fullName}
                                    className="w-32 h-32 rounded-xl object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 border-4 border-white dark:border-gray-800 shadow-lg flex items-center justify-center">
                                    <span className="text-4xl font-bold text-gray-500 dark:text-gray-400">
                                        {user.fullName[0].toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <label className="absolute -bottom-2 -right-2 p-2 bg-blue-600 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-colors">
                                <Upload className="w-4 h-4 text-white" />
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    aria-label={t('profile.uploadImage')}
                                />
                            </label>
                        </div>
                    </div>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="absolute top-4 right-4 p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                            aria-label={t('profile.editProfile')}
                        >
                            <Edit3 className="w-5 h-5 text-white" />
                        </button>
                    )}
                </div>

                <div className="px-6 md:px-8 pt-20 pb-6 space-y-6">
                    {isEditing ? (
                        <form onSubmit={handleEditSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {t('profile.username')}
                                    </label>
                                    <div className="relative">
                                        <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={editData.login}
                                            onChange={(e) => setEditData({ ...editData, login: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {t('profile.fullName')}
                                    </label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={editData.fullName}
                                            onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center space-x-2"
                                >
                                    <X className="w-4 h-4" />
                                    <span>{t('common.cancel')}</span>
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>{t('common.saving')}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            <span>{t('common.saveChanges')}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                                    <span>{user.fullName}</span>
                                    <BadgeCheck className="w-6 h-6 text-blue-500" />
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                                    <span>@{user.login}</span>
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-1">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {t('profile.role')}
                                    </div>
                                    <div className="font-medium text-gray-900 dark:text-white flex items-center space-x-2">
                                        <UserIcon className="w-4 h-4 text-blue-500" />
                                        <span>{t(`profile.roles.${user.role.toLowerCase()}`)}</span>
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-1">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {t('profile.rating')}
                                    </div>
                                    <div className="font-medium text-gray-900 dark:text-white flex items-center space-x-2">
                                        <Star className="w-4 h-4 text-yellow-500" />
                                        <span>{user.rating}</span>
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-1">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {t('profile.email')}
                                    </div>
                                    <div className="font-medium text-gray-900 dark:text-white flex items-center space-x-2">
                                        <Mail className="w-4 h-4 text-blue-500" />
                                        <span>{user.email}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={handleEmailChange}
                                    disabled={isLoading}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Mail className="w-4 h-4" />
                                    )}
                                    <span>{t('profile.changeEmail')}</span>
                                </button>
                                <button
                                    onClick={handlePasswordChange}
                                    disabled={isLoading}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Lock className="w-4 h-4" />
                                    )}
                                    <span>{t('profile.changePassword')}</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                    to="/my-posts"
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
                >
                    <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {t('profile.posts')}
                    </div>
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {user.postsCount || 0}
                    </div>
                </Link>

                <Link
                    to="/my-comments"
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
                >
                    <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {t('profile.comments')}
                    </div>
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {user.commentsCount || 0}
                    </div>
                </Link>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {t('profile.rating')}
                    </div>
                    <div className="text-3xl font-bold text-yellow-500 flex items-center">
                        {user.rating} <Star className="w-6 h-6 ml-2" />
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