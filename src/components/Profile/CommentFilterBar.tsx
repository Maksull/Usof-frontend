import React from 'react';
import { SortAsc, Calendar, Search, RefreshCw } from 'lucide-react';

interface FilterState {
    dateInterval?: {
        startDate: string;
        endDate: string;
    };
    postTitleSearch?: string;
}

interface SortOption {
    label: string;
    value: string;
}

interface CommentFilterBarProps {
    onSortChange: (sort: string) => void;
    onFilterChange: (filters: Partial<FilterState>) => void;
    onResetAll: () => void;
    currentSort: string;
    filters: FilterState;
}

export const COMMENT_SORT_OPTIONS: SortOption[] = [
    { label: 'Latest', value: 'publishDate_DESC' },
    { label: 'Oldest', value: 'publishDate_ASC' },
    { label: 'Most Liked', value: 'likesCount_DESC' },
    { label: 'Least Liked', value: 'likesCount_ASC' },
    { label: 'Most Replies', value: 'repliesCount_DESC' },
    { label: 'Least Replies', value: 'repliesCount_ASC' }
];

export const CommentFilterBar: React.FC<CommentFilterBarProps> = ({
    onSortChange,
    onFilterChange,
    onResetAll,
    currentSort,
    filters
}) => {
    const hasActiveFilters = Boolean(
        filters.dateInterval?.startDate ||
        filters.dateInterval?.endDate ||
        filters.postTitleSearch
    );

    return (
        <div className="mb-8 space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-all duration-300">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <SortAsc className="h-5 w-5 text-gray-400" />
                    <select
                        value={currentSort}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 w-full sm:w-auto"
                    >
                        {COMMENT_SORT_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Post Title Search */}
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search by post title"
                        value={filters.postTitleSearch || ''}
                        onChange={(e) => onFilterChange({ postTitleSearch: e.target.value })}
                        className="pl-10 pr-4 py-2.5 w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                </div>
            </div>

            {/* Date Range */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Date Range
                    </span>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                    <input
                        type="date"
                        value={filters.dateInterval?.startDate || ''}
                        onChange={(e) =>
                            onFilterChange({
                                dateInterval: {
                                    startDate: e.target.value,
                                    endDate: filters.dateInterval?.endDate || ''
                                }
                            })
                        }
                        className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 w-full sm:w-auto"
                        max={filters.dateInterval?.endDate}
                    />
                    <span className="text-gray-500">to</span>
                    <input
                        type="date"
                        value={filters.dateInterval?.endDate || ''}
                        onChange={(e) =>
                            onFilterChange({
                                dateInterval: {
                                    startDate: filters.dateInterval?.startDate || '',
                                    endDate: e.target.value
                                }
                            })
                        }
                        className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 w-full sm:w-auto"
                        min={filters.dateInterval?.startDate}
                    />
                </div>
            </div>

            {/* Reset Button */}
            {hasActiveFilters && (
                <div className="flex justify-end">
                    <button
                        onClick={onResetAll}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reset All Filters
                    </button>
                </div>
            )}
        </div>
    );
};