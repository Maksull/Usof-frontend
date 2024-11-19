import React, { useState } from 'react';
import { User } from '../../models';
import { UsersService } from '../../services';
import axios from 'axios';
import { NotificationModal } from '../Modals/NotificationModal';
import config from '../../config';
import { mapDtoToUser } from '../../utils/mapping';

interface EditableUserData {
    fullName: string;
    email: string;
    login: string;
}

interface ProfilePageProps {
    user: User | null;
    onUserUpdate: (user: User) => void;
}

type ModalStatus = 'success' | 'error';

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUserUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<EditableUserData>({
        fullName: user?.fullName || '',
        email: user?.email || '',
        login: user?.login || ''
    });
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStatus, setModalStatus] = useState<ModalStatus>('success');
    const [modalMessage, setModalMessage] = useState('');

    if (!user) return null;

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updatedUser = mapDtoToUser(await UsersService.updateProfile({
                login: editData.login,
                fullName: editData.fullName
            }));
            onUserUpdate(updatedUser);
            setIsEditing(false);
            setError(null);
        } catch (error: any) {
            setError(error.response?.data?.error || 'Failed to update profile');
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const updatedUser = mapDtoToUser(await UsersService.updateProfileImage(file));
                onUserUpdate(updatedUser);
            } catch (error: any) {
                setError(error.response?.data?.error || 'Failed to update profile picture');
            }
        }
    };

    const handleEmailChange = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${config.backendUrl}/auth/initiate-email-change`);
            setModalStatus('success');
            setModalMessage('Email change email has been sent. Please check your email.');
            setIsModalOpen(true);
        } catch (error) {
            setModalStatus('error');
            if (axios.isAxiosError(error)) {
                setModalMessage(error.response?.data?.error || 'Failed to send change email message');
            } else {
                setModalMessage('Failed to send reset email');
            }
            setIsModalOpen(true);
        }
    };

    const handlePasswordChange = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            await axios.post(`${config.backendUrl}/auth/initiate-password-change`);
            setModalStatus('success');
            setModalMessage('Password reset email has been sent. Please check your email.');
            setIsModalOpen(true);
        } catch (error) {
            setModalStatus('error');
            if (axios.isAxiosError(error)) {
                setModalMessage(error.response?.data?.error || 'Failed to send reset email');
            } else {
                setModalMessage('Failed to send reset email');
            }
            setIsModalOpen(true);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="p-4 md:p-6">
                    <div className="flex justify-end mb-4">
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
                        <div className="flex flex-col items-center mb-6 md:mb-0">
                            <div className="relative">
                                {user.profilePicture ? (
                                    <img
                                        src={user.profilePicture}
                                        alt={user.fullName}
                                        className="h-24 w-24 md:h-32 md:w-32 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                        <span className="text-3xl md:text-4xl text-gray-500 dark:text-gray-400">
                                            {user.fullName[0].toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 flex flex-row md:flex-col items-center gap-2 w-full">
                                <label className="block w-full md:w-32">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    <span className="block w-full px-4 py-2 text-sm text-center font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 cursor-pointer">
                                        Update Image
                                    </span>
                                </label>
                                <button
                                    onClick={handleEmailChange}
                                    className="w-full md:w-32 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
                                >
                                    Change Email
                                </button>
                                <button
                                    onClick={handlePasswordChange}
                                    className="w-full md:w-32 px-2 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
                                >
                                    Change Password
                                </button>
                            </div>
                        </div>

                        <div className="flex-1">
                            {isEditing ? (
                                <form onSubmit={handleEditSubmit} className="space-y-4">
                                    {error && (
                                        <div className="text-red-500 text-sm mb-4">{error}</div>
                                    )}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            value={editData.login}
                                            onChange={(e) => setEditData({ ...editData, login: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={editData.fullName}
                                            onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setEditData({
                                                    fullName: user.fullName,
                                                    email: user.email,
                                                    login: user.login
                                                });
                                                setError(null);
                                            }}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="text-center md:text-left">
                                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                                        {user.fullName}
                                    </h1>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">@{user.login}</p>
                                    <div className="mt-4 space-y-2">
                                        <div className="flex flex-col md:flex-row md:items-center">
                                            <span className="text-gray-600 dark:text-gray-300 md:w-24">Role:</span>
                                            <span className="text-gray-900 dark:text-white">{user.role}</span>
                                        </div>
                                        <div className="flex flex-col md:flex-row md:items-center">
                                            <span className="text-gray-600 dark:text-gray-300 md:w-24">Email:</span>
                                            <span className="text-gray-900 dark:text-white">{user.email}</span>
                                        </div>
                                        <div className="flex flex-col md:flex-row md:items-center">
                                            <span className="text-gray-600 dark:text-gray-300 md:w-24">Rating:</span>
                                            <span className="text-gray-900 dark:text-white">{user.rating}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
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