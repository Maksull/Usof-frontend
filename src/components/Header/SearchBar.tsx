import { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import axios from 'axios';
import config from '../../config';
import { Post } from '../../models';

interface SearchResponse {
    posts: Post[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}

interface SearchBarProps {
    onSearch: (response: SearchResponse) => void;
    setIsLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    onSearch,
    setIsLoading,
    setError,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Post[]>([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [skipEffect, setSkipEffect] = useState(false);

    const executeSearch = useCallback(async (query: string) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: '1',
                limit: '7',
            });

            // Only add searchQuery param if there's a query
            if (query.trim()) {
                params.append('searchQuery', query.trim());
            }

            const response = await axios.get<SearchResponse>(
                `${config.backendUrl}/posts?${params.toString()}`
            );
            onSearch(response.data);
            setIsSearchFocused(false);
        } catch (err) {
            console.error('Search failed:', err);
            setError('Search failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [setIsLoading, setError, onSearch]);

    useEffect(() => {
        if (skipEffect) {
            setSkipEffect(false);
            return;
        }

        const timer = setTimeout(async () => {
            if (searchQuery.trim().length < 2) {
                setSuggestions([]);
                return;
            }

            try {
                const params = new URLSearchParams({
                    page: '1',
                    limit: '5',
                    searchQuery: searchQuery.trim(),
                });
                const response = await axios.get<SearchResponse>(
                    `${config.backendUrl}/posts?${params.toString()}`
                );
                setSuggestions(response.data.posts);
            } catch (err) {
                console.error('Failed to fetch suggestions:', err);
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, skipEffect]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        await executeSearch(searchQuery);
    };

    const handleSuggestionClick = async (post: Post) => {
        setSkipEffect(true);
        setSearchQuery(post.title);
        await executeSearch(post.title);
    };

    const handleClearSearch = async () => {
        setSearchQuery('');
        setSuggestions([]);
        await executeSearch(''); // Execute search with empty query to fetch all posts
    };

    return (
        <div className="relative flex-grow max-w-xl">
            <form onSubmit={handleSearch}>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => {
                            setTimeout(() => setIsSearchFocused(false), 200);
                        }}
                        className={`w-full px-4 py-2 pl-10 pr-4 rounded-lg border
              transition-all duration-200
              ${isSearchFocused
                                ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                                : 'border-gray-300 dark:border-gray-600'
                            } 
              bg-white dark:bg-gray-700 
              text-gray-900 dark:text-gray-100`}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </form>

            {isSearchFocused && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    {suggestions.map((post) => (
                        <div
                            key={post.id}
                            className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                            onClick={() => handleSuggestionClick(post)}
                        >
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                                {post.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                {post.content}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};