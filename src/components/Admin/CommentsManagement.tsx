import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Comment, User } from '../../models';
import { CommentFilterBar, DeleteModal, Pagination } from '..';
import { Loader2, MessageSquare } from 'lucide-react';
import config from '../../config';
import { CommentCard } from '../Profile/CommentCard';

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
    authorSearch?: string;
}

interface CommentsManagementProps {
    currentUser: User | null;
}

export const CommentsManagement: React.FC<CommentsManagementProps> = ({ currentUser }) => {
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
            if (currentFilters.authorSearch) {
                params.append('author', currentFilters.authorSearch);
            }

            const response = await axios.get(`${config.backendUrl}/comments`, { params });
            setComments(response.data.comments);
            setPagination(response.data.pagination);
        } catch (error) {
            setError('Failed to load comments');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComments(pagination.currentPage, sortBy, filters);
    }, [pagination.currentPage, sortBy, filters]);

    const handleDeleteComment = async () => {
        if (!commentToDelete) return;
        setIsDeletingComment(true);
        try {
            await axios.delete(`${config.backendUrl}/comments/${commentToDelete}`);
            await fetchComments(pagination.currentPage, sortBy, filters);
            setError(null);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.error || 'Failed to delete comment');
            } else {
                setError('Failed to delete comment');
            }
        } finally {
            setIsDeletingComment(false);
            setCommentToDelete(null);
        }
    };

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

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className="w-6 h-6" />
                    Comments Management ({pagination.totalItems} total)
                </h2>
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
                                currentUser={currentUser}
                                onDeleteClick={setCommentToDelete}
                            />
                        ))}
                    </div>

                    {comments.length === 0 && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            No comments found with the selected filters
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
                title="Delete Comment"
                description="Are you sure you want to delete this comment? This action cannot be undone. All replies and reactions to this comment will also be deleted."
                confirmButtonText="Delete Comment"
                cancelButtonText="Cancel"
            />
        </div>
    );
};
