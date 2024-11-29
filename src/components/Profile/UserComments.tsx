import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import config from '../../config';
import { Loader2, MessageSquare } from 'lucide-react';
import { CommentFilterBar, DeleteModal, Pagination } from '..';
import { User, Comment } from '../../models';
import { CommentCard } from './CommentCard';

interface UserCommentsProps {
    user: User | null;
}

interface PaginationData {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

interface FilterState {
    dateInterval?: {
        startDate: string;
        endDate: string;
    };
    postTitleSearch?: string;
}

export const UserComments: React.FC<UserCommentsProps> = ({ user }) => {
    const { t } = useTranslation();
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
    const [isDeletingComment, setIsDeletingComment] = useState(false);
    const [sortBy, setSortBy] = useState('publishDate_DESC');
    const [filters, setFilters] = useState<FilterState>({});
    const [pagination, setPagination] = useState<PaginationData>({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 12
    });

    const fetchComments = async (page: number, sort: string, currentFilters: FilterState) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: pagination.itemsPerPage.toString(),
                sort
            });

            if (currentFilters.dateInterval?.startDate) {
                params.append('startDate', currentFilters.dateInterval.startDate);
            }
            if (currentFilters.dateInterval?.endDate) {
                params.append('endDate', currentFilters.dateInterval.endDate);
            }
            if (currentFilters.postTitleSearch) {
                params.append('postTitle', currentFilters.postTitleSearch);
            }

            const response = await axios.get(`${config.backendUrl}/user/comments`, { params });
            setComments(response.data.comments);
            setPagination(response.data.pagination);
        } catch (error) {
            setError(t('userComments.errors.loadFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComments(pagination.currentPage, sortBy, filters);
    }, [pagination.currentPage, sortBy, filters]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, currentPage: newPage }));
        }
    };

    const handleSortChange = (newSort: string) => {
        setSortBy(newSort);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const handleFilterChange = (newFilters: Partial<FilterState>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const handleResetAll = () => {
        setSortBy('publishDate_DESC');
        setFilters({});
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const handleDeleteComment = async () => {
        if (!commentToDelete) return;
        setIsDeletingComment(true);
        try {
            await axios.delete(`${config.backendUrl}/comments/${commentToDelete}`);
            await fetchComments(pagination.currentPage, sortBy, filters);

            const newTotalPages = Math.ceil((pagination.totalItems - 1) / pagination.itemsPerPage);
            if (pagination.currentPage > newTotalPages && newTotalPages > 0) {
                await fetchComments(newTotalPages, sortBy, filters);
            }
            setError(null);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.error || t('userComments.errors.deleteFailed'));
            } else {
                setError(t('userComments.errors.deleteFailed'));
            }
        } finally {
            setIsDeletingComment(false);
            setCommentToDelete(null);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className="w-6 h-6" />
                    {t('userComments.title')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {t('userComments.subtitle')}
                </p>
            </div>

            <CommentFilterBar
                onSortChange={handleSortChange}
                onFilterChange={handleFilterChange}
                onResetAll={handleResetAll}
                currentSort={sortBy}
                filters={filters}
            />

            {isLoading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            ) : error ? (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
                    {error}
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {comments.map(comment => (
                            <CommentCard
                                key={comment.id}
                                comment={comment}
                                currentUser={user}
                                onDeleteClick={setCommentToDelete}
                            />
                        ))}
                    </div>
                    {comments.length === 0 && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            {Object.keys(filters).length > 0
                                ? t('userComments.noCommentsWithFilters')
                                : t('userComments.noComments')}
                        </div>
                    )}
                    {comments.length > 0 && (
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            totalItems={pagination.totalItems}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            )}

            <DeleteModal
                isOpen={!!commentToDelete}
                onClose={() => setCommentToDelete(null)}
                onConfirm={handleDeleteComment}
                isDeleting={isDeletingComment}
                title={t('userComments.deleteModal.title')}
                description={t('userComments.deleteModal.description')}
                confirmButtonText={t('userComments.deleteModal.confirmButton')}
                cancelButtonText={t('userComments.deleteModal.cancelButton')}
            />
        </div>
    );
};