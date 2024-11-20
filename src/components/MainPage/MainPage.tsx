import { useState, useEffect } from 'react';
import { Post as PostModel, PostStatus } from '../../models/Post';
import { PostsService } from '../../services';
import { useNavigate } from 'react-router-dom';

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
}

interface FilterState {
    status?: PostStatus;
    startDate?: string;
    endDate?: string;
    categoryIds?: number[];
}

const POSTS_PER_PAGE = 10;
const SORT_OPTIONS = [
    { label: 'Latest', value: 'date' },
    { label: 'Most Liked', value: 'likes' }
] as const;

const transformPost = (post: PostModel): DisplayPost => ({
    id: post.id,
    title: post.title,
    content: post.content,
    image: post.image,
    publishDate: typeof post.publishDate === 'string'
        ? post.publishDate
        : post.publishDate.toISOString(),
    likesCount: post.likes?.length || 0,
    commentsCount: post.comments?.length || 0,
    author: {
        name: post.author?.login || 'Unknown Author'
    }
});

export const MainPage = () => {
    const [posts, setPosts] = useState<DisplayPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState<'date' | 'likes'>('date');
    const [filters, setFilters] = useState<FilterState>({});
    const [totalPosts, setTotalPosts] = useState(0);
    const navigate = useNavigate();

    const fetchPosts = async (page: number, sort: typeof sortBy, currentFilters: FilterState) => {
        setLoading(true);
        try {
            const response = await PostsService.getPosts(
                currentFilters,
                sort,
                { page, pageSize: POSTS_PER_PAGE }
            );
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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSortChange = (newSort: typeof sortBy) => {
        setSortBy(newSort);
        setCurrentPage(1);
    };

    const handleFilterChange = (newFilters: Partial<FilterState>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setCurrentPage(1);
    };

    const FilterBar = () => (
        <div className="mb-6 grid gap-4 md:flex md:items-center md:justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex flex-wrap gap-4">
                <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value as typeof sortBy)}
                    className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {SORT_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.status || ''}
                    onChange={(e) => handleFilterChange({
                        status: e.target.value ? e.target.value as PostStatus : undefined
                    })}
                    className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Status</option>
                    <option value={PostStatus.ACTIVE}>Active</option>
                    <option value={PostStatus.INACTIVE}>Inactive</option>
                </select>

                <input
                    type="date"
                    value={filters.startDate || ''}
                    onChange={(e) => handleFilterChange({ startDate: e.target.value || undefined })}
                    className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                    type="date"
                    value={filters.endDate || ''}
                    onChange={(e) => handleFilterChange({ endDate: e.target.value || undefined })}
                    className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <button
                onClick={() => setFilters({})}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
                Clear Filters
            </button>
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

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
                    <div className="flex flex-col">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Recent Posts
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {totalPosts} posts found
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/create-post')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 
                     text-white font-medium rounded-lg transition-colors duration-150 
                     shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 
                     focus:ring-blue-500 dark:focus:ring-offset-gray-900"
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

                <FilterBar />

                {loading ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                                <div className="animate-pulse space-y-4">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                                    </div>
                                    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
                        {error}
                    </div>
                ) : (
                    <>
                        <div className="grid gap-6 md:grid-cols-2">
                            {posts.map((post) => (
                                <article
                                    key={post.id}
                                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
                                >
                                    <div className="aspect-video w-full overflow-hidden">
                                        {post.image ? (
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                                <div className="text-center">
                                                    <svg
                                                        className="w-16 h-16 mx-auto text-blue-300 dark:text-blue-500 mb-2"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={1.5}
                                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                    <span className="text-sm text-blue-400 dark:text-blue-300">
                                                        No image available
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <div className="flex flex-col space-y-2 mb-4">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    navigate(`/post/${post.id}`);
                                                }}
                                                className="text-left"
                                            >
                                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:text-blue-600 dark:focus:text-blue-400">
                                                    {post.title}
                                                </h2>
                                            </button>
                                            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                                                <span>By {post.author.name}</span>
                                                <time className="text-gray-500 dark:text-gray-500">
                                                    {new Date(post.publishDate).toLocaleDateString()}
                                                </time>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                                            {post.content}
                                        </p>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center">
                                                <svg
                                                    className="w-5 h-5 mr-1.5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                                    />
                                                </svg>
                                                {post.likesCount} likes
                                            </div>
                                            <div className="flex items-center">
                                                <svg
                                                    className="w-5 h-5 mr-1.5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                                    />
                                                </svg>
                                                {post.commentsCount} comments
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {totalPages > 1 && <Pagination />}
                    </>
                )}
            </div>
        </div>
    );
};
