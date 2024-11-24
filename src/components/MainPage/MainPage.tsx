import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Post as PostModel, PostStatus } from '../../models/Post';
import { PostsService } from '../../services';
import axios from 'axios';
import config from '../../config';

interface Category {
    id: number;
    title: string;
    description: string;
}

interface DisplayPost {
    id: number;
    title: string;
    content: string;
    image?: string;
    publishDate: string;
    likesCount: number;
    commentsCount: number;
    author: {
        name: string;
    };
    categories: Category[];
}

interface FilterState {
    status?: PostStatus;
    dateInterval?: {
        startDate: string;
        endDate: string;
    };
    categoryIds?: number[];
    searchQuery?: string; 
}

const POSTS_PER_PAGE = 10;
const SORT_OPTIONS = [
    { label: 'Latest', value: 'publishDate' },
    { label: 'Most Liked', value: 'likesCount' },
    { label: 'Most Commented', value: 'commentsCount' }
] as const;

export const MainPage = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<DisplayPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('searchQuery');
    const [filters, setFilters] = useState<FilterState>({
        searchQuery: searchQuery || undefined
    });

    const [sortBy, setSortBy] = useState<'publishDate' | 'likesCount' | 'commentsCount'>('publishDate');

    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            searchQuery: searchQuery || undefined
        }));
    }, [searchQuery]);


    // Transform post data
    const transformPost = (post: PostModel): DisplayPost => ({
        id: post.id,
        title: post.title,
        content: post.content,
        image: post.image,
        publishDate: typeof post.publishDate === 'string' ? post.publishDate : post.publishDate.toISOString(),
        likesCount: post.likes?.filter(like => like.type === 'like').length || 0,
        commentsCount: post.comments?.length || 0,
        author: { name: post.author?.login || 'Unknown Author' },
        categories: post.categories || []
    });

    // Fetch categories
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
    }, []);

    // Fetch posts
    const fetchPosts = async (page: number, sort: typeof sortBy, currentFilters: FilterState) => {
        setLoading(true);
        try {
            const response = await PostsService.getPosts(currentFilters, sort, { page, pageSize: POSTS_PER_PAGE });
            const transformedPosts = (response.data || []).map(transformPost);
            setPosts(transformedPosts);
            setTotalPages(Math.ceil((response.total || 0) / POSTS_PER_PAGE));
            setTotalPosts(response.total || 0);
        } catch (err) {
            setError('Failed to load posts. Please try again later.');
            console.error('Error fetching posts:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts(currentPage, sortBy, filters);
    }, [currentPage, sortBy, filters]);

    // Event handlers
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSortChange = (newSort: typeof sortBy) => {
        setSortBy(newSort);
        setCurrentPage(1);
    };

    const handleFilterChange = (newFilters: Partial<{
        startDate?: string;
        endDate?: string;
        status?: PostStatus;
        categoryIds?: number[];
    }>) => {
        setFilters(prev => {
            const next = { ...prev };
            if ('startDate' in newFilters || 'endDate' in newFilters) {
                const startDate = 'startDate' in newFilters ? newFilters.startDate : prev.dateInterval?.startDate;
                const endDate = 'endDate' in newFilters ? newFilters.endDate : prev.dateInterval?.endDate;
                if (startDate || endDate) {
                    next.dateInterval = { startDate: startDate || '', endDate: endDate || '' };
                } else {
                    delete next.dateInterval;
                }
            }
            if ('status' in newFilters) next.status = newFilters.status;
            if ('categoryIds' in newFilters) next.categoryIds = newFilters.categoryIds;
            return next;
        });
        setCurrentPage(1);
    };

    const FilterBar = () => (
        <div className="mb-6 space-y-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex flex-wrap gap-4">
                <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value as typeof sortBy)}
                    className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md">
                    {SORT_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
                <div className="flex items-center gap-2">
                    <input
                        type="date"
                        value={filters.dateInterval?.startDate || ''}
                        onChange={(e) => handleFilterChange({ startDate: e.target.value || undefined })}
                        className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md"
                        max={filters.dateInterval?.endDate}
                    />
                    <span className="text-gray-500">to</span>
                    <input
                        type="date"
                        value={filters.dateInterval?.endDate || ''}
                        onChange={(e) => handleFilterChange({ endDate: e.target.value || undefined })}
                        className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md"
                        min={filters.dateInterval?.startDate}
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                    <button
                        key={category.id}
                        onClick={() => {
                            const currentCategories = filters.categoryIds || [];
                            const newCategories = currentCategories.includes(category.id)
                                ? currentCategories.filter(id => id !== category.id)
                                : [...currentCategories, category.id];
                            handleFilterChange({ categoryIds: newCategories });
                        }}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filters.categoryIds?.includes(category.id)
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                    >
                        {category.title}
                    </button>
                ))}
            </div>

            {Boolean(filters.dateInterval || filters.categoryIds?.length) && (
                <div className="flex justify-end">
                    <button
                        onClick={() => setFilters({})}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );

    const Pagination = () => {
        const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        return (
            <div className="mt-8 flex justify-center items-center space-x-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    Previous
                </button>
                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-md transition-colors ${currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    Next
                </button>
            </div>
        );
    };

    const PostCard = ({ post }: { post: DisplayPost }) => (
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
            <div className="aspect-video w-full overflow-hidden">
                {post.image ? (
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
                        <div className="text-center">
                            <svg className="w-16 h-16 mx-auto text-blue-300 dark:text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm text-blue-400 dark:text-blue-300">No image available</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6">
                <div className="flex flex-col space-y-2 mb-4">
                    <button onClick={() => navigate(`/post/${post.id}`)} className="text-left">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {post.title}
                        </h2>
                    </button>

                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>By {post.author.name}</span>
                        <time className="text-gray-500 dark:text-gray-500">
                            {new Date(post.publishDate).toLocaleDateString()}
                        </time>
                    </div>

                    {post.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {post.categories.map(category => (
                                <span
                                    key={category.id}
                                    className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                                >
                                    {category.title}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                    {post.content}
                </p>

                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {post.likesCount} likes
                    </div>
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {post.commentsCount} comments
                    </div>
                </div>
            </div>
        </article>
    );

    // ... (previous code remains the same until the final return statement)

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
                    <div className="flex flex-col">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Recent Posts
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {totalPosts} posts found
                            {filters.categoryIds?.length ? ` in selected categories` : ''}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/create-post')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-150 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                    >
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Create Post
                    </button>
                </div>

                {/* Filters Section */}
                <FilterBar />

                {/* Content Section */}
                {loading ? (
                    // Loading State
                    <div className="grid gap-6 md:grid-cols-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                                <div className="animate-pulse space-y-4">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                                    </div>
                                    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
                                    <div className="flex space-x-2">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    // Error State
                    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-lg">
                        <div className="flex">
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            {error}
                        </div>
                    </div>
                ) : posts.length === 0 ? (
                    // No Posts State
                    <div className="text-center py-12">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No posts found</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {filters.categoryIds?.length
                                ? 'Try selecting different categories or clearing the filters'
                                : 'Get started by creating a new post'}
                        </p>
                        {!filters.categoryIds?.length && (
                            <div className="mt-6">
                                <button
                                    onClick={() => navigate('/create-post')}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                                >
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                    Create New Post
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    // Posts Grid
                    <>
                        <div className="grid gap-6 md:grid-cols-2">
                            {posts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                        {totalPages > 1 && <Pagination />}
                    </>
                )}
            </div>
        </div>
    );
};