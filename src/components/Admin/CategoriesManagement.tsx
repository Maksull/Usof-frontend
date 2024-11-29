import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Category } from '../../models';
import { Loader2, Plus, Pencil, Trash2, Tags } from 'lucide-react';
import config from '../../config';
import { Pagination } from '..';

interface CategoryFormData {
    title: string;
    description: string;
}

interface PaginationData {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

export const CategoriesManagement = () => {
    const { t } = useTranslation();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<CategoryFormData>({
        title: '',
        description: ''
    });
    const [pagination, setPagination] = useState<PaginationData>({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 9
    });

    const fetchCategories = async (page: number) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${config.backendUrl}/categories/paginated`, {
                params: { page, limit: pagination.itemsPerPage }
            });
            setCategories(response.data.categories);
            setPagination(response.data.pagination);
        } catch (error) {
            setError(t('categories.errors.loadFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${config.backendUrl}/categories/paginated`, {
                    params: { page: 1, limit: 9 }
                });
                setCategories(response.data.categories);
                setPagination(response.data.pagination);
            } catch (error) {
                setError(t('categories.errors.loadFailed'));
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, [t]);

    useEffect(() => {
        if (pagination.currentPage !== undefined) {
            fetchCategories(pagination.currentPage);
        }
    }, [pagination.currentPage, t]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, currentPage: newPage }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingCategory) {
                await axios.put(`${config.backendUrl}/categories/${editingCategory.id}`, formData);
            } else {
                await axios.post(`${config.backendUrl}/categories`, formData);
            }
            await fetchCategories(pagination.currentPage);
            setEditingCategory(null);
            setFormData({ title: '', description: '' });
        } catch (error) {
            setError(t('categories.errors.saveFailed'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm(t('categories.confirmDelete'))) return;
        try {
            await axios.delete(`${config.backendUrl}/admin/categories/${id}`);
            await fetchCategories(pagination.currentPage);
        } catch (error) {
            setError(t('categories.errors.deleteFailed'));
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            title: category.title,
            description: category.description
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400" />
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('categories.loading')}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Tags className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {t('categories.title')}
                    </h2>
                </div>
                <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                    {t('categories.count', { count: categories.length })}
                </span>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700/50">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        {editingCategory ? t('categories.form.editTitle') : t('categories.form.createTitle')}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('categories.form.titleLabel')}
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('categories.form.descriptionLabel')}
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                                rows={3}
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            {editingCategory && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingCategory(null);
                                        setFormData({ title: '', description: '' });
                                    }}
                                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    {t('common.cancel')}
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : editingCategory ? (
                                    <Pencil className="w-4 h-4" />
                                ) : (
                                    <Plus className="w-4 h-4" />
                                )}
                                {editingCategory ? t('categories.form.updateButton') : t('categories.form.addButton')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl">
                    {error}
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {categories.map(category => (
                    <div
                        key={category.id}
                        className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700/50 p-6 hover:shadow-xl transition-all duration-200"
                    >
                        <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                                {category.title}
                            </h4>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(category)}
                                    className="p-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    aria-label={t('categories.actions.edit')}
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    aria-label={t('categories.actions.delete')}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                            {category.description}
                        </p>
                    </div>
                ))}
            </div>

            {categories.length > 0 && (
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalItems}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};