import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Post as PostModel } from '../../models/Post';
import { PostsService } from '../../services';

export const PostPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState<PostModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    {post.image && (
                        <div className="w-full">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-[400px] object-cover"
                            />
                        </div>
                    )}

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
                            {post.title}
                        </h1>

                        <div className="flex items-center justify-between mb-6">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                By {post.author?.login || 'Unknown Author'}
                            </div>
                            <time className="text-sm text-gray-500 dark:text-gray-500">
                                {new Date(post.publishDate).toLocaleDateString()}
                            </time>
                        </div>

                        <div className="prose dark:prose-invert max-w-none mb-6">
                            {post.content.split('\n').map((paragraph, index) => (
                                <p key={index} className="text-gray-700 dark:text-gray-300 mb-4">
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 border-t dark:border-gray-700 pt-6">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                                {post.likes?.length || 0} likes
                            </div>

                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                </svg>
                                {post.comments?.length || 0} comments
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
