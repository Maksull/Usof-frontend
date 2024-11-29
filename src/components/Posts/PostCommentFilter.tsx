import React from 'react';
import { useTranslation } from 'react-i18next';
import { SortAsc, Calendar } from 'lucide-react';

interface FilterState {
    dateInterval?: {
        startDate: string;
        endDate: string;
    };
}

interface SortOption {
    label: string;
    value: string;
}

interface PostCommentFilterProps {
    onSortChange: (sort: string) => void;
    onFilterChange: (filters: Partial<FilterState>) => void;
    onResetAll: () => void;
    currentSort: string;
    filters: FilterState;
}

export const PostCommentFilter: React.FC<PostCommentFilterProps> = ({
    onSortChange,
    onFilterChange,
    onResetAll,
    currentSort,
    filters
}) => {
    const { t } = useTranslation();

    const COMMENT_SORT_OPTIONS: SortOption[] = [
        { label: t('comments.sort.latest'), value: 'publishDate_DESC' },
        { label: t('comments.sort.oldest'), value: 'publishDate_ASC' },
        { label: t('comments.sort.mostLiked'), value: 'likesCount_DESC' },
        { label: t('comments.sort.leastLiked'), value: 'likesCount_ASC' },
        { label: t('comments.sort.mostReplies'), value: 'repliesCount_DESC' },
        { label: t('comments.sort.leastReplies'), value: 'repliesCount_ASC' }
    ];

    const hasActiveFilters = Boolean(
        filters.dateInterval?.startDate || filters.dateInterval?.endDate
    );

    return (
        <div className="mb-6 space-y-4 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <SortAsc className="h-5 w-5 text-gray-400" />
                    <select
                        value={currentSort}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 w-full sm:w-auto"
                        aria-label={t('comments.sort.label')}
                    >
                        {COMMENT_SORT_OPTIONS.map(option => (
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
                            onChange={(e) =>
                                onFilterChange({
                                    dateInterval: {
                                        startDate: e.target.value,
                                        endDate: filters.dateInterval?.endDate || ''
                                    }
                                })
                            }
                            className="pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 w-full"
                            max={filters.dateInterval?.endDate}
                            aria-label={t('comments.filter.startDate')}
                        />
                    </div>
                    <span className="text-gray-500">{t('comments.filter.to')}</span>
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
                        aria-label={t('comments.filter.endDate')}
                    />
                </div>
            </div>

            {hasActiveFilters && (
                <div className="flex justify-end">
                    <button
                        onClick={onResetAll}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                    >
                        {t('comments.filter.resetAll')}
                    </button>
                </div>
            )}
        </div>
    );
};