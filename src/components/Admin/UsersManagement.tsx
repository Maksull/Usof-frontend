import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { User, UserRole } from '../../models';
import { Pagination, DeleteModal } from '..';
import config from '../../config';

interface UserManagementProps {
    currentUser: User | null;
}

export const UsersManagement: React.FC<UserManagementProps> = ({ currentUser }) => {
    const { t } = useTranslation();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const itemsPerPage = 10;

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${config.backendUrl}/users`);
            setUsers(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError(t('usersManagement.errors.loadFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId: number, newRole: UserRole) => {
        try {
            await axios.put(`${config.backendUrl}/users/${userId}/role`, { role: newRole });
            await fetchUsers();
            setError(null);
        } catch (err) {
            console.error('Error updating user role:', err);
            setError(t('usersManagement.errors.updateFailed'));
        }
    };

    const openDeleteModal = (user: User) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;

        try {
            setDeletingUserId(userToDelete.id);
            await axios.delete(`${config.backendUrl}/users/${userToDelete.id}`);
            await fetchUsers();
            setError(null);
        } catch (err) {
            console.error('Error deleting user:', err);
            setError(t('usersManagement.errors.deleteFailed'));
        } finally {
            setDeletingUserId(null);
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
        }
    };

    const paginatedUsers = users.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {t('usersManagement.title')} ({users.length})
                </h2>
            </div>

            <div className="p-6">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
                        {error}
                        <button onClick={fetchUsers} className="ml-4 text-sm underline">
                            {t('common.retry')}
                        </button>
                    </div>
                )}

                <div className="grid gap-4 sm:gap-6">
                    {paginatedUsers.map((user) => (
                        <div
                            key={user.id}
                            className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                {user.profilePicture ? (
                                    <img
                                        className="h-10 w-10 rounded-full object-cover"
                                        src={user.profilePicture}
                                        alt=""
                                    />
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600" />
                                )}
                                <div>
                                    <div className="font-medium text-gray-900 dark:text-gray-100">
                                        {user.fullName}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {user.login}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <select
                                    className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                                    disabled={user.id === currentUser?.id}
                                >
                                    <option value={UserRole.USER}>{t('userRoles.user')}</option>
                                    <option value={UserRole.ADMIN}>{t('userRoles.admin')}</option>
                                </select>

                                <button
                                    onClick={() => openDeleteModal(user)}
                                    disabled={user.id === currentUser?.id}
                                    className={`
                    inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md 
                    ${user.id === currentUser?.id
                                            ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                                            : 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 active:bg-red-800 dark:active:bg-red-700'}
                    transition-colors duration-200 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800
                  `}
                                >
                                    {t('common.delete')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {users.length > itemsPerPage && (
                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(users.length / itemsPerPage)}
                            totalItems={users.length}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setUserToDelete(null);
                }}
                onConfirm={handleDeleteUser}
                isDeleting={deletingUserId !== null}
                title={t('usersManagement.deleteModal.title', { name: userToDelete?.fullName })}
                description={t('usersManagement.deleteModal.description')}
                confirmButtonText={t('usersManagement.deleteModal.confirmButton')}
                cancelButtonText={t('common.cancel')}
            />
        </div>
    );
};