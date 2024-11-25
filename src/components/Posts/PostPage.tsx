import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Post as PostModel } from '../../models/Post';
import { CommentsService, LikesService, PostsService } from '../../services';
import { Category } from '../../models';
import {
    ThumbsDown,
    ThumbsUp,
    ChevronLeft,
    Edit3,
    X,
    Loader2,
    Calendar,
    User,
    MessageSquare,
    Camera,
    Send
} from 'lucide-react';
import axios from 'axios';
import config from '../../config';
import { CommentComponent } from './CommentComponent';

// Types and interfaces
export interface ExtendedPost extends PostModel {
    isAuthor: boolean;
}

interface PostHeaderProps {
    post: ExtendedPost;
    onBack: () => void;
    onEdit: () => void;
    isEditing: boolean;
}

interface PostContentProps {
    post: ExtendedPost;
    onLike: (isLike: boolean) => Promise<void>;
    isLiking: boolean;
}

interface PostEditFormProps {
    post: ExtendedPost;
    categories: Category[];
    onCancel: () => void;
    onSubmit: (formData: FormData) => Promise<void>;
    loading: boolean;
    error: string | null;
}
interface CommentSectionProps {
    post: ExtendedPost;
    onCommentPost: (content: string) => Promise<void>;
    isSubmitting: boolean;
    error: string | null;
    setPost: (post: ExtendedPost | null) => void;
    isLiking: boolean;
    onCommentLike: (commentId: number, isLike: boolean) => Promise<void>;
};

// Utility functions
export const transformToExtendedPost = (post: PostModel): ExtendedPost => ({
    ...post,
    isAuthor: (post as any).isAuthor ?? false
});

// Component sections
const PostHeader: React.FC<PostHeaderProps> = ({ post, onBack, onEdit, isEditing }) => (
    <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
            <button
                onClick={onBack}
                className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 group"
            >
                <ChevronLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                Back to posts
            </button>

            {post.isAuthor && !isEditing && (
                <button
                    onClick={onEdit}
                    className="inline-flex items-center px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                >
                    <Edit3 className="w-5 h-5 mr-2" />
                    Edit Post
                </button>
            )}
        </div>
    </div>
);

const PostImage: React.FC<{ src?: string; title?: string }> = ({ src, title }) => (
    <div className="relative aspect-video w-full">
        {src ? (
            <img
                src={src}
                alt={title}
                className="w-full h-full object-cover"
            />
        ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
                <Camera className="w-16 h-16 text-blue-300 dark:text-blue-500" />
            </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    </div>
);

const PostMetadata: React.FC<{ post: ExtendedPost }> = ({ post }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-4">
            <div className="flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">
                    {post.author?.login || 'Unknown Author'}
                </span>
            </div>
            <div className="flex items-center text-gray-500">
                <Calendar className="w-5 h-5 mr-2" />
                <time>{new Date(post.publishDate).toLocaleDateString()}</time>
            </div>
        </div>
        {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
                {post.categories.map(category => (
                    <span
                        key={category.id}
                        className="px-3 py-1 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                        {category.title}
                    </span>
                ))}
            </div>
        )}
    </div>
);

const PostContent: React.FC<PostContentProps> = ({ post, onLike, isLiking }) => (
    <div className="space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            {post.title}
        </h1>

        <PostMetadata post={post} />

        <div className="prose dark:prose-invert max-w-none">
            {post.content.split('\n').map((paragraph, index) => (
                <p key={index} className="text-gray-700 dark:text-gray-300">
                    {paragraph}
                </p>
            ))}
        </div>

        <div className="flex items-center space-x-6 border-t dark:border-gray-700 pt-6">
            <button
                onClick={() => onLike(true)}
                disabled={isLiking}
                className={`flex items-center px-4 py-2 rounded-lg transition-all ${isLiking ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    } ${post.likes?.some(like => like.type === 'like')
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
            >
                <ThumbsUp className="w-5 h-5 mr-2" />
                {post.likes?.filter(like => like.type === 'like').length || 0}
            </button>

            <button
                onClick={() => onLike(false)}
                disabled={isLiking}
                className={`flex items-center px-4 py-2 rounded-lg transition-all ${isLiking ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    } ${post.likes?.some(like => like.type === 'dislike')
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
            >
                <ThumbsDown className="w-5 h-5 mr-2" />
                {post.likes?.filter(like => like.type === 'dislike').length || 0}
            </button>

            <div className="flex items-center text-gray-500 dark:text-gray-400">
                <MessageSquare className="w-5 h-5 mr-2" />
                {post.comments?.length || 0} comments
            </div>
        </div>
    </div>
);

const PostEditForm: React.FC<PostEditFormProps> = ({
    post,
    categories,
    onCancel,
    onSubmit,
    loading,
    error
}) => {
    const [formData, setFormData] = useState({
        title: post.title,
        content: post.content,
        image: null as File | null,
        categoryIds: post.categories?.map(cat => cat.id) || []
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const submitData = new FormData();
        submitData.append('title', formData.title);
        submitData.append('content', formData.content);
        if (formData.image) {
            submitData.append('image', formData.image);
        }
        submitData.append('categoryIds', JSON.stringify(formData.categoryIds));
        onSubmit(submitData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl text-red-700 dark:text-red-400">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                </label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content
                </label>
                <textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Categories
                </label>
                <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            type="button"
                            onClick={() => {
                                setFormData(prev => {
                                    const newCategoryIds = prev.categoryIds.includes(category.id)
                                        ? prev.categoryIds.filter(id => id !== category.id)
                                        : [...prev.categoryIds, category.id];
                                    return { ...prev, categoryIds: newCategoryIds };
                                });
                            }}
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
                    Image
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && file.size <= 5 * 1024 * 1024) {
                            setFormData(prev => ({ ...prev, image: file }));
                        }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Maximum file size: 5MB. Leave empty to keep the current image.
                </p>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:focus:ring-offset-gray-900 shadow-lg hover:shadow-xl"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        'Save Changes'
                    )}
                </button>
            </div>
        </form>
    );
};

const CommentSection: React.FC<CommentSectionProps> = ({
    post,
    onCommentPost,
    isSubmitting,
    error,
    setPost,
    isLiking,
    onCommentLike
}) => {
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim()) {
            onCommentPost(content.trim()).then(() => setContent(''));
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Comments ({post.comments?.length || 0})
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 
                                   bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        rows={3}
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting || !content.trim()}
                        className="absolute right-2 bottom-2 p-2 text-blue-600 dark:text-blue-400 
                                   hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </div>
                {error && (
                    <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
                )}
            </form>
            <div className="space-y-6">
                <CommentComponent
                    comments={post.comments || []}
                    setPost={setPost}
                    isLiking={isLiking}
                    onCommentLike={onCommentLike}
                />
            </div>
        </div>
    );
};

// Loading Skeleton
const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-8">
        <div className="aspect-video w-full bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="space-y-6 p-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4" />
            <div className="flex justify-between">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
            </div>
            <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            </div>
        </div>
    </div>
);

// Main PostPage Component
export const PostPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState<ExtendedPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLiking, setIsLiking] = useState(false);
    const [likeError, setLikeError] = useState<string | null>(null);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [commentError, setCommentError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const [postResponse, categoriesResponse] = await Promise.all([
                    PostsService.getPostById(parseInt(id, 10)),
                    axios.get(`${config.backendUrl}/categories`)
                ]);
                setPost(transformToExtendedPost(postResponse));
                setCategories(categoriesResponse.data);
            } catch (err) {
                setError('Failed to load post');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleLike = async (isLike: boolean) => {
        if (!post || isLiking) return;
        setIsLiking(true);
        setLikeError(null);

        try {
            await LikesService.createLike(post.id, undefined, isLike);
            const updatedPost = await PostsService.getPostById(post.id);
            setPost(transformToExtendedPost(updatedPost));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update like status';
            setLikeError(errorMessage);
        } finally {
            setIsLiking(false);
        }
    };

    const handleCommentPost = async (content: string) => {
        if (!post?.id) return;
        setIsSubmittingComment(true);
        setCommentError(null);

        try {
            await CommentsService.createComment(post.id, content);
            const updatedPost = await PostsService.getPostById(post.id);
            setPost(transformToExtendedPost(updatedPost));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to post comment';
            setCommentError(errorMessage);
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleCommentLike = async (commentId: number, isLike: boolean) => {
        if (isLiking) return;
        setIsLiking(true);
        setLikeError(null);

        try {
            await LikesService.createLike(undefined, commentId, isLike);
            const updatedPost = await PostsService.getPostById(post!.id);
            setPost(transformToExtendedPost(updatedPost));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update like status';
            setLikeError(errorMessage);
        } finally {
            setIsLiking(false);
        }
    };

    const handleEdit = async (formData: FormData) => {
        if (!post?.id) return;
        setEditLoading(true);
        setEditError(null);

        try {
            const updatedPost = await PostsService.updatePost(post.id, formData);
            setPost(transformToExtendedPost(updatedPost));
            setIsEditing(false);
        } catch (err) {
            setEditError('Failed to update post. Please try again.');
        } finally {
            setEditLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                        <LoadingSkeleton />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-6 shadow-lg">
                        <div className="flex items-center space-x-3">
                            <X className="h-6 w-6 text-red-600 dark:text-red-400" />
                            <div className="flex-1">
                                <h3 className="text-lg font-medium text-red-800 dark:text-red-300">
                                    Error Loading Post
                                </h3>
                                <p className="mt-1 text-red-700 dark:text-red-400">
                                    {error || 'Post not found'}
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/')}
                                className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 
                                         bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 
                                         dark:hover:bg-red-900/50 transition-colors"
                            >
                                Return Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {likeError && (
                    <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 
                                  rounded-xl p-4 shadow-lg">
                        <div className="flex items-center space-x-2 text-red-700 dark:text-red-400">
                            <X className="w-5 h-5" />
                            <span>{likeError}</span>
                        </div>
                    </div>
                )}

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                    <PostHeader
                        post={post}
                        onBack={() => navigate('/')}
                        onEdit={() => setIsEditing(true)}
                        isEditing={isEditing}
                    />

                    <PostImage src={post.image} title={post.title} />

                    <div className="p-8">
                        {isEditing ? (
                            <PostEditForm
                                post={post}
                                categories={categories}
                                onCancel={() => setIsEditing(false)}
                                onSubmit={handleEdit}
                                loading={editLoading}
                                error={editError}
                            />
                        ) : (
                            <>
                                <PostContent
                                    post={post}
                                    onLike={handleLike}
                                    isLiking={isLiking}
                                />

                                <div className="mt-12">
                                    <CommentSection
                                        post={post}
                                        onCommentPost={handleCommentPost}
                                        isSubmitting={isSubmittingComment}
                                        error={commentError}
                                        setPost={setPost}
                                        isLiking={isLiking}
                                        onCommentLike={handleCommentLike}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
