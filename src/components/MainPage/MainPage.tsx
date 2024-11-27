import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { Category, Post, PostStatus } from '../../models';
import { PostsFilterBar, Pagination, PostCard } from '..';
import config from '../../config';

// Types
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

// Components
const LoadingSkeleton = () => (
    <div className="grid gap-8 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="animate-pulse">
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700" />
                    <div className="p-6 space-y-4">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4" />
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-full" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-5/6" />
                        </div>
                        <div className="flex space-x-2">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-20" />
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-20" />
                        </div>
                        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between">
                                <div className="flex space-x-2">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12" />
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12" />
                                </div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const ErrorMessage = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <div className="flex-1">
                <h3 className="text-lg font-medium text-red-800 dark:text-red-300">Error Loading Posts</h3>
                <p className="mt-1 text-red-700 dark:text-red-400">{error}</p>
            </div>
            <button
                onClick={onRetry}
                className="flex-shrink-0 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
            >
                Try Again
            </button>
        </div>
    </div>
);

const EmptyState = ({ hasFilters }: { hasFilters: boolean }) => (
    <div className="text-center py-16 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-lg mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-6">
                <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No posts found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                {hasFilters ? 'Try selecting different categories or clearing the filters' : 'Get started by creating your first post'}
            </p>
            {!hasFilters && (
                <Link
                    to="/create-post"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Create First Post
                </Link>
            )}
        </div>
    </div>
);

// Custom hooks
const useSearchQuery = (setFilters: React.Dispatch<React.SetStateAction<FilterState>>, setPagination: React.Dispatch<React.SetStateAction<PaginationState>>) => {
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchQuery = params.get('searchQuery');
        if (searchQuery !== undefined) {
            setFilters(prev => ({ ...prev, searchQuery: searchQuery || undefined }));
            setPagination(prev => ({ ...prev, currentPage: 1 }));
        }
    }, [location.search, setFilters, setPagination]);
};

const useFetchCategories = (setCategories: React.Dispatch<React.SetStateAction<Category[]>>) => {
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${config.backendUrl}/categories`);
                setCategories(response.data);
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };
        fetchCategories();
    }, [setCategories]);
};

// Main component
export const MainPage = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationState>({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 7
    });
    const [sortBy, setSortBy] = useState('publishDate');
    const [filters, setFilters] = useState<FilterState>({});

    useSearchQuery(setFilters, setPagination);
    useFetchCategories(setCategories);

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
            setError('Failed to load posts');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts(pagination.currentPage, sortBy, filters);
    }, [pagination.currentPage, sortBy, filters]);

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

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-12 max-w-6xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
                    <div className="flex flex-col">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                            Recent Posts
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            {pagination.totalItems} posts found {filters.categoryIds?.length ? ' in selected categories' : ''}
                        </p>
                    </div>
                    <Link
                        to="/create-post"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Create Post
                    </Link>
                </div>

                <PostsFilterBar
                    onSortChange={handleSortChange}
                    onFilterChange={handleFilterChange}
                    onResetAll={handleResetAll}
                    currentSort={sortBy}
                    filters={filters}
                    categories={categories}
                />

                {isLoading ? (
                    <LoadingSkeleton />
                ) : error ? (
                    <ErrorMessage error={error} onRetry={() => fetchPosts(pagination.currentPage, sortBy, filters)} />
                ) : posts.length === 0 ? (
                    <EmptyState hasFilters={Boolean(filters.categoryIds?.length)} />
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {posts.map(post => (
                                <PostCard key={post.id} post={post} />
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
                )}
            </div>
        </div>
    );
};