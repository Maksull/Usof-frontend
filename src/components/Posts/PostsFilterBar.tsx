import React, { useState, useEffect } from 'react';
import { SortAsc, Calendar, Tags, RefreshCw, Search, ChevronDown } from 'lucide-react';
import axios from 'axios';
import config from '../../config';
import { Category, PostStatus } from '../../models';
import { useTranslation } from 'react-i18next';

interface FilterState {
    status?: PostStatus;
    dateInterval?: {
        startDate: string;
        endDate: string;
    };
    searchQuery?: string;
    categoryIds?: number[];
}

interface CategoryPaginationResponse {
    items: Category[];
    pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
    };
}

interface SortOption {
    label: string;
    value: string;
}

interface FilterBarProps {
    onSortChange: (sort: string) => void;
    onFilterChange: (filters: Partial<FilterState>) => void;
    onResetAll: () => void;
    currentSort: string;
    filters: FilterState;
}

const SORT_OPTIONS: SortOption[] = [
    { label: 'posts.sort.latest', value: 'publishDate_DESC' },
    { label: 'posts.sort.oldest', value: 'publishDate_ASC' },
    { label: 'posts.sort.mostLiked', value: 'likesCount_DESC' },
    { label: 'posts.sort.leastLiked', value: 'likesCount_ASC' },
    { label: 'posts.sort.mostCommented', value: 'commentsCount_DESC' },
    { label: 'posts.sort.leastCommented', value: 'commentsCount_ASC' },
    { label: 'posts.sort.titleAZ', value: 'title_ASC' },
    { label: 'posts.sort.titleZA', value: 'title_DESC' }
];

export const PostsFilterBar: React.FC<FilterBarProps> = ({
    onSortChange,
    onFilterChange,
    onResetAll,
    currentSort,
    filters
}) => {
    const { t } = useTranslation();

    // State management
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [endCursor, setEndCursor] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState(filters.searchQuery || '');
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isCategoriesVisible, setIsCategoriesVisible] = useState(true);
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(true);

    // Debounced search effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchValue !== filters.searchQuery) {
                onFilterChange({ searchQuery: searchValue });
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchValue, onFilterChange, filters.searchQuery]);

    // Initial categories fetch
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async (cursor?: string) => {
        try {
            setIsLoadingMore(true);
            const params = new URLSearchParams();
            params.append('limit', '10');

            if (cursor) {
                params.append('cursor', cursor);
            }

            const response = await axios.get<CategoryPaginationResponse>(
                `${config.backendUrl}/categories/cursor`,
                { params }
            );

            if (cursor) {
                setCategories(prev => [...prev, ...response.data.items]);
            } else {
                setCategories(response.data.items);
            }

            setHasNextPage(response.data.pageInfo.hasNextPage);
            setEndCursor(response.data.pageInfo.endCursor);
        } catch (err) {
            console.error('Error fetching categories:', err);
        } finally {
            setIsLoadingMore(false);
            if (isInitialLoad) {
                setIsInitialLoad(false);
            }
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleLoadMore = () => {
        if (!isLoadingMore && hasNextPage && endCursor) {
            fetchCategories(endCursor);
        }
    };

    const handleDateChange = (startOrEnd: 'startDate' | 'endDate', value: string) => {
        onFilterChange({
            dateInterval: {
                startDate: startOrEnd === 'startDate' ? value : filters.dateInterval?.startDate || '',
                endDate: startOrEnd === 'endDate' ? value : filters.dateInterval?.endDate || ''
            }
        });
    };

    const handleCategoryToggle = (categoryId: number) => {
        const currentCategories = filters.categoryIds || [];
        const newCategories = currentCategories.includes(categoryId)
            ? currentCategories.filter(id => id !== categoryId)
            : [...currentCategories, categoryId];
        onFilterChange({ categoryIds: newCategories });
    };

    const hasActiveFilters = Boolean(
        filters.dateInterval?.startDate ||
        filters.dateInterval?.endDate ||
        (filters.categoryIds && filters.categoryIds.length > 0) ||
        filters.searchQuery
    );

    return (
        <div className="mb-8 space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-all duration-300">
            {/* Sort and Search Section */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <SortAsc className="h-5 w-5 text-gray-400" />
                    <select
                        value={currentSort}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 w-full sm:w-auto"
                        aria-label={t('posts.sort.label')}
                    >
                        {SORT_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                                {t(option.label)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        value={searchValue}
                        onChange={handleSearchChange}
                        placeholder={t('posts.search.placeholder')}
                        className="pl-10 pr-4 py-2.5 w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        aria-label={t('posts.search.label')}
                    />
                </div>
            </div>

            {/* Date Filter Section */}
            <div className="space-y-2">
                <button
                    onClick={() => setIsDatePickerVisible(!isDatePickerVisible)}
                    className="flex items-center gap-2 w-full justify-between py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                    aria-expanded={isDatePickerVisible}
                >
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <h3 className="text-sm font-medium">
                            {t('posts.dateRange.title')}
                            {filters.dateInterval?.startDate && filters.dateInterval?.endDate && (
                                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(filters.dateInterval.startDate).toLocaleDateString()} -
                                    {new Date(filters.dateInterval.endDate).toLocaleDateString()}
                                </span>
                            )}
                        </h3>
                    </div>
                    <ChevronDown
                        className={`h-5 w-5 transition-transform duration-200 ${isDatePickerVisible ? 'transform rotate-180' : ''
                            }`}
                    />
                </button>

                <div
                    className={`transition-all duration-200 ${isDatePickerVisible ? 'opacity-100 max-h-[200px]' : 'opacity-0 max-h-0 overflow-hidden'
                        }`}
                >
                    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                        <div className="flex-1 space-y-1">
                            <label
                                htmlFor="start-date"
                                className="block text-xs font-medium text-gray-600 dark:text-gray-400"
                            >
                                {t('posts.dateRange.startDate')}
                            </label>
                            <input
                                id="start-date"
                                type="date"
                                value={filters.dateInterval?.startDate || ''}
                                onChange={(e) => handleDateChange('startDate', e.target.value)}
                                max={filters.dateInterval?.endDate}
                                className="w-full pl-3 pr-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            />
                        </div>

                        <div className="flex items-center">
                            <div className="hidden sm:block w-8 h-[1px] bg-gray-300 dark:bg-gray-600" />
                            <span className="block sm:hidden text-xs font-medium text-gray-500 dark:text-gray-400">
                                {t('posts.dateRange.to')}
                            </span>
                        </div>

                        <div className="flex-1 space-y-1">
                            <label
                                htmlFor="end-date"
                                className="block text-xs font-medium text-gray-600 dark:text-gray-400"
                            >
                                {t('posts.dateRange.endDate')}
                            </label>
                            <input
                                id="end-date"
                                type="date"
                                value={filters.dateInterval?.endDate || ''}
                                onChange={(e) => handleDateChange('endDate', e.target.value)}
                                min={filters.dateInterval?.startDate}
                                className="w-full pl-3 pr-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            />
                        </div>

                        {(filters.dateInterval?.startDate || filters.dateInterval?.endDate) && (
                            <button
                                onClick={() => onFilterChange({ dateInterval: undefined })}
                                className="self-end sm:self-center px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200"
                            >
                                {t('posts.dateRange.clear')}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Categories Section */}
            <div className="space-y-4">
                <button
                    onClick={() => setIsCategoriesVisible(!isCategoriesVisible)}
                    className="flex items-center gap-2 w-full justify-between py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                    aria-expanded={isCategoriesVisible}
                >
                    <div className="flex items-center gap-2">
                        <Tags className="h-5 w-5 text-gray-400" />
                        <h3 className="text-sm font-medium">
                            {t('posts.categories.title')}
                            {filters.categoryIds?.length
                                ? t('posts.categories.selected', { count: filters.categoryIds.length })
                                : ''}
                        </h3>
                    </div>
                    <ChevronDown
                        className={`h-5 w-5 transition-transform duration-200 ${isCategoriesVisible ? 'transform rotate-180' : ''
                            }`}
                    />
                </button>

                <div
                    className={`space-y-4 transition-all duration-200 ${isCategoriesVisible ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0 overflow-hidden'
                        }`}
                >
                    {isInitialLoad ? (
                        <div className="flex justify-center py-4">
                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {categories.map(category => (
                                    <button
                                        key={category.id}
                                        onClick={() => handleCategoryToggle(category.id)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${filters.categoryIds?.includes(category.id)
                                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 ring-2 ring-blue-500'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                    >
                                        {category.title}
                                    </button>
                                ))}
                            </div>

                            {hasNextPage && (
                                <div className="flex justify-center">
                                    <button
                                        onClick={handleLoadMore}
                                        disabled={isLoadingMore}
                                        className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoadingMore
                                            ? t('posts.categories.loading')
                                            : t('posts.categories.loadMore')}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Reset Filters Button */}
            {hasActiveFilters && (
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onResetAll}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        {t('posts.filters.resetAll')}
                    </button>
                </div>
            )}
        </div>
    );
};
