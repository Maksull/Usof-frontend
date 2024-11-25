import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Post as PostModel, PostStatus } from '../../models/Post';
import { PostsService } from '../../services';
import axios from 'axios';
import config from '../../config';
import { Calendar, ChevronLeft, ChevronRight, ImageIcon, MessageCircle, Plus, ThumbsUp, X } from 'lucide-react';

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
        <div className="mb-8 space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-all duration-300">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value as typeof sortBy)}
                    className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 w-full sm:w-auto"
                >
                    {SORT_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>

                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="date"
                            value={filters.dateInterval?.startDate || ''}
                            onChange={(e) => handleFilterChange({ startDate: e.target.value || undefined })}
                            className="pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 w-full"
                            max={filters.dateInterval?.endDate}
                        />
                    </div>
                    <span className="text-gray-500">to</span>
                    <input
                        type="date"
                        value={filters.dateInterval?.endDate || ''}
                        onChange={(e) => handleFilterChange({ endDate: e.target.value || undefined })}
                        className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 w-full sm:w-auto"
                        min={filters.dateInterval?.startDate}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Categories</h3>
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
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${filters.categoryIds?.includes(category.id)
                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 ring-2 ring-blue-500'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            {category.title}
                        </button>
                    ))}
                </div>
            </div>

            {Boolean(filters.dateInterval || filters.categoryIds?.length) && (
                <div className="flex justify-end">
                    <button
                        onClick={() => setFilters({})}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );


    const Pagination = () => {
        const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        const showPages = pages.slice(
            Math.max(0, currentPage - 2),
            Math.min(totalPages, currentPage + 1)
        );

        return (
            <div className="mt-12 flex justify-center items-center space-x-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {showPages[0] > 1 && (
                    <>
                        <button
                            onClick={() => handlePageChange(1)}
                            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                        >
                            1
                        </button>
                        {showPages[0] > 2 && (
                            <span className="text-gray-500 dark:text-gray-400">...</span>
                        )}
                    </>
                )}

                {showPages.map(page => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg transition-all duration-200 ${currentPage === page
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                    >
                        {page}
                    </button>
                ))}

                {showPages[showPages.length - 1] < totalPages - 1 && (
                    <span className="text-gray-500 dark:text-gray-400">...</span>
                )}

                {showPages[showPages.length - 1] < totalPages && (
                    <button
                        onClick={() => handlePageChange(totalPages)}
                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                    >
                        {totalPages}
                    </button>
                )}

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        );
    };


    const PostCard = ({ post }: { post: DisplayPost }) => (
        <article className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="aspect-video w-full overflow-hidden relative">
                {post.image ? (
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-blue-300 dark:text-blue-500" />
                    </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs font-medium text-white bg-black/30 backdrop-blur-sm rounded-full">
                            {new Date(post.publishDate).toLocaleDateString()}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium text-white bg-black/30 backdrop-blur-sm rounded-full">
                            By {post.author.name}
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-4">
                <button
                    onClick={() => navigate(`/post/${post.id}`)}
                    className="block group/title w-full text-left"
                >
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors line-clamp-2">
                        {post.title}
                    </h2>
                </button>

                <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                    {post.content}
                </p>

                <div className="flex flex-wrap gap-2">
                    {post.categories.map(category => (
                        <span
                            key={category.id}
                            className="px-3 py-1 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                        >
                            {category.title}
                        </span>
                    ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <ThumbsUp className="w-4 h-4 mr-1.5" />
                            <span className="text-sm">{post.likesCount}</span>
                        </div>
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <MessageCircle className="w-4 h-4 mr-1.5" />
                            <span className="text-sm">{post.commentsCount}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate(`/post/${post.id}`)}
                        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                        Read more
                    </button>
                </div>
            </div>
        </article>
    );


    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-12 max-w-6xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
                    <div className="flex flex-col">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                            Recent Posts
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            {totalPosts} posts found
                            {filters.categoryIds?.length ? ` in selected categories` : ''}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/create-post')}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Create Post
                    </button>
                </div>

                <FilterBar />
                {loading ? (
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
                ) : error ? (
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
                                onClick={() => fetchPosts(currentPage, sortBy, filters)}
                                className="flex-shrink-0 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-16 px-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-lg mx-auto">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-6">
                                <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No posts found</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                {filters.categoryIds?.length
                                    ? 'Try selecting different categories or clearing the filters'
                                    : 'Get started by creating your first post'}
                            </p>
                            {!filters.categoryIds?.length && (
                                <button
                                    onClick={() => navigate('/create-post')}
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    Create First Post
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-8 md:grid-cols-2">
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
