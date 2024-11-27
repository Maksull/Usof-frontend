import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange
}) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        pages.push(1);

        let start = Math.max(2, currentPage - 1);
        let end = Math.min(totalPages - 1, currentPage + 1);

        if (currentPage <= 3) {
            end = 4;
        }

        if (currentPage >= totalPages - 2) {
            start = totalPages - 3;
        }

        if (start > 2) {
            pages.push('...');
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < totalPages - 1) {
            pages.push('...');
        }

        pages.push(totalPages);

        return pages;
    };

    const pageNumbers = getPageNumbers();

    const buttonBaseClasses = `
    flex items-center justify-center h-10 w-10
    rounded-xl border transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:cursor-not-allowed
  `;

    const navigationButtonClasses = `
    ${buttonBaseClasses}
    border-gray-200 dark:border-gray-700
    hover:border-gray-300 dark:hover:border-gray-600
    hover:bg-gray-50 dark:hover:bg-gray-800
    text-gray-700 dark:text-gray-300
    disabled:opacity-50
    disabled:hover:bg-transparent dark:disabled:hover:bg-transparent
    disabled:border-gray-200 dark:disabled:border-gray-700
    focus:ring-blue-500 dark:focus:ring-blue-400
    focus:ring-offset-white dark:focus:ring-offset-gray-900
  `;

    const pageButtonClasses = (isActive: boolean) => `
    ${buttonBaseClasses}
    ${isActive
            ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-medium'
            : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'}
    focus:ring-blue-500 dark:focus:ring-blue-400
    focus:ring-offset-white dark:focus:ring-offset-gray-900
  `;

    return (
        <div className="flex justify-center mt-8">
            <div className="inline-flex items-center gap-2 p-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/30">
                {/* First page */}
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className={`${navigationButtonClasses} hidden sm:flex`}
                    aria-label="First page"
                >
                    <ChevronsLeft className="w-5 h-5" />
                </button>

                {/* Previous page */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={navigationButtonClasses}
                    aria-label="Previous page"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-2 px-2">
                    {pageNumbers.map((page, index) => (
                        typeof page === 'number' ? (
                            <button
                                key={index}
                                onClick={() => onPageChange(page)}
                                className={pageButtonClasses(currentPage === page)}
                                aria-current={currentPage === page ? 'page' : undefined}
                            >
                                {page}
                            </button>
                        ) : (
                            <span
                                key={index}
                                className="flex items-center justify-center h-10 w-8 text-gray-400 dark:text-gray-500"
                            >
                                {page}
                            </span>
                        )
                    ))}
                </div>

                {/* Next page */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={navigationButtonClasses}
                    aria-label="Next page"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>

                {/* Last page */}
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`${navigationButtonClasses} hidden sm:flex`}
                    aria-label="Last page"
                >
                    <ChevronsRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};