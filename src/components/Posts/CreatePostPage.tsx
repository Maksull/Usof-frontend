import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PostsService } from '../../services';
import { X, Upload, ChevronLeft, Loader2 } from 'lucide-react';
import axios from 'axios';
import config from '../../config';

interface Category {
    id: number;
    title: string;
    description: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const CreatePostPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: null as File | null,
        categoryIds: [] as number[]
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${config.backendUrl}/categories`);
                setCategories(response.data);
            } catch (err) {
                setError(t('createPost.errors.fetchCategories'));
                console.error('Fetch categories error:', err);
            }
        };
        fetchCategories();
    }, [t]);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileValidation(file);
        }
    };

    const handleFileValidation = (file: File) => {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            setError(t('createPost.errors.invalidFileType'));
            return;
        }
        if (file.size > MAX_FILE_SIZE) {
            setError(t('createPost.errors.fileTooLarge'));
            return;
        }
        setFormData(prev => ({ ...prev, image: file }));
        setError(null);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileValidation(file);
        }
    };

    const handleCategoryChange = (categoryId: number) => {
        setFormData(prev => {
            const updatedCategoryIds = prev.categoryIds.includes(categoryId)
                ? prev.categoryIds.filter(id => id !== categoryId)
                : [...prev.categoryIds, categoryId];
            return { ...prev, categoryIds: updatedCategoryIds };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('content', formData.content);
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }
            formDataToSend.append('categoryIds', JSON.stringify(formData.categoryIds));
            await PostsService.createPost(formDataToSend);
            navigate('/');
        } catch (err) {
            setError(t('createPost.errors.createFailed'));
            console.error('Create post error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <Link
                    to={`/`}
                    className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6 group"
                >
                    <ChevronLeft className="w-5 h-5 mr-1 transition-transform group-hover:-translate-x-1" />
                    {t('createPost.backToPosts')}
                </Link>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
                        {t('createPost.title')}
                    </h1>

                    {error && (
                        <div className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-4">
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="flex-1 text-red-700 dark:text-red-400">
                                    {error}
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('createPost.form.title')}
                            </label>
                            <input
                                type="text"
                                id="title"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder={t('createPost.form.titlePlaceholder')}
                            />
                        </div>

                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('createPost.form.content')}
                            </label>
                            <textarea
                                id="content"
                                required
                                value={formData.content}
                                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                rows={8}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder={t('createPost.form.contentPlaceholder')}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                {t('createPost.form.categories')}
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {categories.map(category => (
                                    <button
                                        key={category.id}
                                        type="button"
                                        onClick={() => handleCategoryChange(category.id)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${formData.categoryIds.includes(category.id)
                                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 ring-2 ring-blue-500'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                    >
                                        {category.title}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('createPost.form.coverImage')}
                            </label>
                            <div
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                className={`relative mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${dragActive
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-gray-300 dark:border-gray-600'
                                    } border-dashed rounded-xl transition-colors`}
                            >
                                <div className="space-y-3 text-center">
                                    {imagePreview ? (
                                        <div className="relative inline-block">
                                            <img src={imagePreview} alt={t('createPost.form.imagePreview')} className="h-48 w-auto rounded-lg shadow-md" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImagePreview(null);
                                                    setFormData(prev => ({ ...prev, image: null }));
                                                    if (fileInputRef.current) {
                                                        fileInputRef.current.value = '';
                                                    }
                                                }}
                                                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                                <label
                                                    htmlFor="image-upload"
                                                    className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                                >
                                                    <span>{t('createPost.form.uploadFile')}</span>
                                                    <input
                                                        id="image-upload"
                                                        ref={fileInputRef}
                                                        name="image-upload"
                                                        type="file"
                                                        accept="image/jpeg,image/png,image/gif"
                                                        className="sr-only"
                                                        onChange={handleImageChange}
                                                    />
                                                </label>
                                                <p className="pl-1">{t('createPost.form.orDragDrop')}</p>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {t('createPost.form.imageRequirements')}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 pt-6">
                            <Link
                                to={`/`}
                                className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                            >
                                {t('common.cancel')}
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:focus:ring-offset-gray-900 shadow-lg hover:shadow-xl"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        {t('createPost.form.creating')}
                                    </>
                                ) : (
                                    t('createPost.form.create')
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};