import React from 'react';
import { SortAsc, Calendar, Tags, RefreshCw } from 'lucide-react';
import { Category } from '../../models';

interface FilterState {
    dateInterval?: {
        startDate: string;
        endDate: string;
    };
    searchQuery?: string;
    categoryIds?: number[];
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
    categories: Category[];
}

export const SORT_OPTIONS: SortOption[] = [
    { label: 'Latest', value: 'publishDate_DESC' },
    { label: 'Oldest', value: 'publishDate_ASC' },
    { label: 'Most Liked', value: 'likesCount_DESC' },
    { label: 'Least Liked', value: 'likesCount_ASC' },
    { label: 'Most Commented', value: 'commentsCount_DESC' },
    { label: 'Least Commented', value: 'commentsCount_ASC' },
    { label: 'Title A-Z', value: 'title_ASC' },
    { label: 'Title Z-A', value: 'title_DESC' }
];

export const PostsFilterBar: React.FC<FilterBarProps> = ({
    onSortChange,
    onFilterChange,
    onResetAll,
    currentSort,
    filters,
    categories
}) => {
    const hasActiveFilters = Boolean(
        filters.dateInterval?.startDate ||
        filters.dateInterval?.endDate ||
        (filters.categoryIds && filters.categoryIds.length > 0)
    );

    return (
        <div className="mb-8 space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-all duration-300">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <SortAsc className="h-5 w-5 text-gray-400" />
                    <select
                        value={currentSort}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 w-full sm:w-auto"
                    >
                        {SORT_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="date"
                            value={filters.dateInterval?.startDate || ''}
                            onChange={(e) => onFilterChange({
                                dateInterval: {
                                    startDate: e.target.value,
                                    endDate: filters.dateInterval?.endDate || ''
                                }
                            })}
                            className="pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 w-full"
                            max={filters.dateInterval?.endDate}
                        />
                    </div>
                    <span className="text-gray-500">to</span>
                    <input
                        type="date"
                        value={filters.dateInterval?.endDate || ''}
                        onChange={(e) => onFilterChange({
                            dateInterval: {
                                startDate: filters.dateInterval?.startDate || '',
                                endDate: e.target.value
                            }
                        })}
                        className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 w-full sm:w-auto"
                        min={filters.dateInterval?.startDate}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Tags className="h-5 w-5 text-gray-400" />
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Categories
                    </h3>
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
                                onFilterChange({ categoryIds: newCategories });
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

            {hasActiveFilters && (
                <div className="flex justify-end gap-2">
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
