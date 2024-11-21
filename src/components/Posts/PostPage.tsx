import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Post as PostModel } from '../../models/Post';
import { CommentsService, LikesService, PostsService } from '../../services';
import { CommentComponent } from './CommentComponent';

export const PostPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState<PostModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLiking, setIsLiking] = useState(false);
    const [likeError, setLikeError] = useState<string | null>(null);
    const [commentContent, setCommentContent] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [commentError, setCommentError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            if (!id) return;

            try {
                const response = await PostsService.getPostById(parseInt(id, 10));
                setPost(response);
            } catch (err) {
                setError('Failed to load post');
                console.error('Error fetching post:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handleLike = async (isLike: boolean) => {
        if (!post || isLiking) return;
        setIsLiking(true);
        setLikeError(null);

        try {
            const existingLike = post.likes?.find(like => like.authorId === post.authorId);
            const isSameReaction = existingLike?.type === (isLike ? 'like' : 'dislike');

            if (existingLike) {
                await LikesService.deleteLike(existingLike.id);

                if (isSameReaction) {
                    const updatedPost = await PostsService.getPostById(post.id);
                    setPost(updatedPost);
                    setIsLiking(false);
                    return;
                }
            }

            await LikesService.createLike(post.id, undefined, isLike);
            const updatedPost = await PostsService.getPostById(post.id);
            setPost(updatedPost);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update like status';
            setLikeError(errorMessage);
            console.error('Error liking post:', err);
        } finally {
            setIsLiking(false);
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

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!post?.id || !commentContent.trim()) return;

        setIsSubmittingComment(true);
        setCommentError(null);

        try {
            await CommentsService.createComment(post.id, commentContent.trim());
            setCommentContent('');
            // Refresh post to get updated comments
            const updatedPost = await PostsService.getPostById(post.id);
            setPost(updatedPost);
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
            const comment = post?.comments?.find(c => c.id === commentId);
            const existingLike = comment?.likes?.find(like => like.authorId === post?.authorId);
            const isSameReaction = existingLike?.type === (isLike ? 'like' : 'dislike');

            if (existingLike) {
                await LikesService.deleteLike(existingLike.id);

                // If same reaction, just remove it
                if (isSameReaction) {
                    const updatedPost = await PostsService.getPostById(post!.id);
                    setPost(updatedPost);
                    setIsLiking(false);
                    return;
                }
            }

            // Create new reaction if different type
            await LikesService.createLike(undefined, commentId, isLike);
            const updatedPost = await PostsService.getPostById(post!.id);
            setPost(updatedPost);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update like status';
            setLikeError(errorMessage);
            console.error('Error liking comment:', err);
        } finally {
            setIsLiking(false);
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
                    {/* Post Image */}
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
                                <svg
                                    className="w-20 h-20 mx-auto text-blue-300 dark:text-blue-500 mb-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                        </div>
                    )}

                    {/* Post Content */}
                    <div className="p-6 md:p-8">
                        <button
                            onClick={() => navigate('/')}
                            className="mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 flex items-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to posts
                        </button>

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

                        <div className="prose dark:prose-invert max-w-none mb-6">
                            {post?.content.split('\n').map((paragraph, index) => (
                                <p key={index} className="text-gray-700 dark:text-gray-300 mb-4">
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {/* Post Actions */}
                        <div className="flex items-center space-x-6 text-sm border-t dark:border-gray-700 pt-6">
                            <button
                                onClick={() => handleLike(true)}
                                disabled={isLiking}
                                className={`flex items-center px-4 py-2 rounded-md transition-colors
                      ${isLiking ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                      ${post?.likes?.some(like => like.type === 'like') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
                            >
                                <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                {post?.likes?.filter(like => like.type === 'like').length || 0} likes
                            </button>

                            <button
                                onClick={() => handleLike(false)}
                                disabled={isLiking}
                                className={`flex items-center px-4 py-2 rounded-md transition-colors
                      ${isLiking ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                      ${post?.likes?.some(like => like.type === 'dislike') ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}
                            >
                                <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.682 17.682l-6.364 6.364-6.364-6.364m0 0a4.5 4.5 0 010-6.364L12 4.318l1.318 1.318a4.5 4.5 0 016.364 0z" />
                                </svg>
                                {post?.likes?.filter(like => like.type === 'dislike').length || 0} dislikes
                            </button>
                        </div>
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
