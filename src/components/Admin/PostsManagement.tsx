import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Post, PostStatus, User } from '../../models';
import { PostsFilterBar, Pagination, PostCard } from '..';
import config from '../../config';

interface FilterState {
    status?: PostStatus;
    dateInterval?: {
        startDate: string;
        endDate: string;
    };
    categoryIds?: number[];
    searchQuery?: string;
}

interface PaginationState {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

interface PostsManagementProps {
    currentUser: User | null;
}

export const PostsManagement: React.FC<PostsManagementProps> = ({
    currentUser
}) => {
    const { t } = useTranslation();
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationState>({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    });
    const [sortBy, setSortBy] = useState('publishDate');
    const [filters, setFilters] = useState<FilterState>({});

    const fetchPosts = async (page: number, sort: string, currentFilters: FilterState) => {
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
            if (currentFilters.categoryIds?.length) {
                params.append('categories', currentFilters.categoryIds.join(','));
            }
            if (currentFilters.searchQuery) {
                params.append('searchQuery', currentFilters.searchQuery);
            }

            const response = await axios.get(`${config.backendUrl}/posts`, { params });
            setPosts(response.data.posts);
            setPagination(response.data.pagination);
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError(t('postsManagement.errors.loadFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts(pagination.currentPage, sortBy, filters);
    }, [pagination.currentPage, sortBy, filters, t]);

    const handleSortChange = (newSort: string) => {
        setSortBy(newSort);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const handleFilterChange = (newFilters: Partial<FilterState>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const handleResetAll = () => {
        setSortBy('publishDate');
        setFilters({});
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, currentPage: newPage }));
        }
    };

    const handleDeletePost = async (postId: number) => {
        try {
            await axios.delete(`${config.backendUrl}/posts/${postId}`);
            await fetchPosts(pagination.currentPage, sortBy, filters);

            const newTotalPages = Math.ceil((pagination.totalItems - 1) / pagination.itemsPerPage);
            if (pagination.currentPage > newTotalPages && newTotalPages > 0) {
                await fetchPosts(newTotalPages, sortBy, filters);
            }
            setError(null);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.error || t('postsManagement.errors.deleteFailed'));
            } else {
                setError(t('postsManagement.errors.deleteFailed'));
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                {error}
                <button
                    onClick={() => fetchPosts(pagination.currentPage, sortBy, filters)}
                    className="ml-4 text-sm underline"
                >
                    {t('common.retry')}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {t('postsManagement.title')} ({t('postsManagement.totalCount', { count: pagination.totalItems })})
                </h2>
            </div>

            <PostsFilterBar
                onSortChange={handleSortChange}
                onFilterChange={handleFilterChange}
                onResetAll={handleResetAll}
                currentSort={sortBy}
                filters={filters}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map(post => (
                    <PostCard
                        key={post.id}
                        post={post}
                        currentUser={currentUser}
                        onDelete={handleDeletePost}
                    />
                ))}
            </div>

            {posts.length > 0 && (
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalItems}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};