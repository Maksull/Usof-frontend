import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Post as PostModel } from '../../models/Post';
import { CommentsService, LikesService, PostsService } from '../../services';
import { CommentComponent } from './CommentComponent';
import { Category } from '../../models';
import axios from 'axios';
import config from '../../config';
import { ThumbsDown, ThumbsUp } from 'lucide-react';

export interface ExtendedPost extends PostModel {
    isAuthor: boolean;
}

export const transformToExtendedPost = (post: PostModel): ExtendedPost => ({
    ...post,
    isAuthor: (post as any).isAuthor ?? false
});

export const PostPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState<ExtendedPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLiking, setIsLiking] = useState(false);
    const [likeError, setLikeError] = useState<string | null>(null);
    const [commentContent, setCommentContent] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [commentError, setCommentError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [editFormData, setEditFormData] = useState({
        title: '',
        content: '',
        image: null as File | null,
        categoryIds: [] as number[]
    });
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
                setEditFormData({
                    title: postResponse.title,
                    content: postResponse.content,
                    image: null,
                    categoryIds: postResponse.categories?.map(cat => cat.id) || []
                });
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
            // Create the new like - the backend will handle the logic of
            // removing/updating existing reactions
            await LikesService.createLike(post.id, undefined, isLike);

            // Fetch updated post to get the new likes state
            const updatedPost = await PostsService.getPostById(post.id);
            setPost(transformToExtendedPost(updatedPost));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update like status';
            setLikeError(errorMessage);
            console.error('Error liking post:', err);
        } finally {
            setIsLiking(false);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!post?.id || !commentContent.trim()) return;
        setIsSubmittingComment(true);
        setCommentError(null);
        try {
            await CommentsService.createComment(post.id, commentContent.trim());
            setCommentContent('');
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
            // Create the like - backend will handle existing reactions
            await LikesService.createLike(undefined, commentId, isLike);

            // Fetch updated post to get the new comment likes state
            const updatedPost = await PostsService.getPostById(post!.id);
            setPost(transformToExtendedPost(updatedPost));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update like status';
            setLikeError(errorMessage);
            console.error('Error liking comment:', err);
        } finally {
            setIsLiking(false);
        }
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!post?.id) return;
        setEditLoading(true);
        setEditError(null);
        try {
            const formData = new FormData();
            formData.append('title', editFormData.title);
            formData.append('content', editFormData.content);
            if (editFormData.image) {
                formData.append('image', editFormData.image);
            }
            formData.append('categoryIds', JSON.stringify(editFormData.categoryIds));
            const updatedPost = await PostsService.updatePost(post.id, formData);
            setPost(transformToExtendedPost(updatedPost));
            setIsEditing(false);
        } catch (err) {
            setEditError('Failed to update post. Please try again.');
            console.error('Error updating post:', err);
        } finally {
            setEditLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
                        <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-lg">
                        {error || 'Post not found'}
                    </div>
                </div>
            </div>
        );
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setEditError('File is too large. Maximum size is 5MB');
                return;
            }
            setEditFormData(prev => ({ ...prev, image: file }));
            setEditError(null);
        }
    };



    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {likeError && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-md">
                        {likeError}
                    </div>
                )}

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    {/* Image Section */}
                    {post?.image ? (
                        <div className="w-full">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-[400px] object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-full h-[400px] bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
                            <div className="text-center">
                                <svg className="w-20 h-20 mx-auto text-blue-300 dark:text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    )}

                    <div className="p-6 md:p-8">
                        {/* Navigation and Actions */}
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={() => navigate('/')}
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 flex items-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to posts
                            </button>

                            {post.isAuthor && !isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Post
                                </button>
                            )}
                        </div>

                        {isEditing ? (
                            // Edit Form
                            <form onSubmit={handleEdit} className="space-y-6">
                                {editError && (
                                    <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-md">
                                        {editError}
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={editFormData.title}
                                        onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Content
                                    </label>
                                    <textarea
                                        id="content"
                                        value={editFormData.content}
                                        onChange={(e) => setEditFormData(prev => ({ ...prev, content: e.target.value }))}
                                        rows={8}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Categories
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {categories.map(category => (
                                            <div key={category.id} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`category-${category.id}`}
                                                    checked={editFormData.categoryIds.includes(category.id)}
                                                    onChange={() => {
                                                        setEditFormData(prev => {
                                                            const newCategoryIds = prev.categoryIds.includes(category.id)
                                                                ? prev.categoryIds.filter(id => id !== category.id)
                                                                : [...prev.categoryIds, category.id];
                                                            return { ...prev, categoryIds: newCategoryIds };
                                                        });
                                                    }}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <label
                                                    htmlFor={`category-${category.id}`}
                                                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                                                >
                                                    {category.title}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Image
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    />
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Leave empty to keep the current image
                                    </p>
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={editLoading}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:focus:ring-offset-gray-900"
                                    >
                                        {editLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            // View Mode
                            <>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                                    {post?.title}
                                </h1>

                                <div className="flex items-center justify-between mb-6">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        By {post?.author?.login || 'Unknown Author'}
                                    </div>
                                    <time className="text-sm text-gray-500 dark:text-gray-500">
                                        {post && new Date(post.publishDate).toLocaleDateString()}
                                    </time>
                                </div>

                                {/* Categories */}
                                {post?.categories && post.categories.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {post.categories.map(category => (
                                            <span
                                                key={category.id}
                                                className="px-2 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                                            >
                                                {category.title}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="prose dark:prose-invert max-w-none mb-6">
                                    {post?.content.split('\n').map((paragraph, index) => (
                                        <p key={index} className="text-gray-700 dark:text-gray-300 mb-4">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>

                                {/* Like/Dislike buttons */}
                                <div className="flex items-center space-x-6 text-sm border-t dark:border-gray-700 pt-6">
                                    <button
                                        onClick={() => handleLike(true)}
                                        disabled={isLiking}
                                        className={`flex items-center px-4 py-2 rounded-md transition-colors ${isLiking ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'} ${post?.likes?.some(like => like.type === 'like')
                                            ? 'text-blue-600 dark:text-blue-400'
                                            : 'text-gray-500 dark:text-gray-400'}`}
                                    >
                                        <ThumbsUp
                                            className="w-5 h-5 mr-1.5"
                                            strokeWidth={2}
                                        />
                                        {post?.likes?.filter(like => like.type === 'like').length || 0}
                                    </button>

                                    <button
                                        onClick={() => handleLike(false)}
                                        disabled={isLiking}
                                        className={`flex items-center px-4 py-2 rounded-md transition-colors ${isLiking ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'} ${post?.likes?.some(like => like.type === 'dislike')
                                            ? 'text-red-600 dark:text-red-400'
                                            : 'text-gray-500 dark:text-gray-400'}`}
                                    >
                                        <ThumbsDown
                                            className="w-5 h-5 mr-1.5"
                                            strokeWidth={2}
                                        />
                                        {post?.likes?.filter(like => like.type === 'dislike').length || 0}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Comments Section */}
                <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Comments ({post?.comments?.length || 0})
                    </h2>

                    <form onSubmit={handleCommentSubmit} className="mb-6">
                        <textarea
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={3}
                        />

                        {commentError && (
                            <div className="mt-2 text-red-600 dark:text-red-400 text-sm">
                                {commentError}
                            </div>
                        )}

                        <div className="mt-2 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmittingComment || !commentContent.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md
                             hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                            </button>
                        </div>
                    </form>

                    <div className="space-y-4">
                        {post?.comments?.map((comment) => (
                            <CommentComponent
                                key={comment.id}
                                comment={comment}
                                setPost={setPost}
                                isLiking={isLiking}
                                onCommentLike={handleCommentLike}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
