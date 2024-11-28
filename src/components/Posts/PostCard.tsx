import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, MessageSquare, ImageIcon, Trash2 } from 'lucide-react';
import { Post, LikeType, User, UserRole } from '../../models';
import { DeleteModal } from '..';

interface PostCardProps {
    post: Post;
    currentUser?: User | null;
    onDelete?: (postId: number) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
    post,
    currentUser,
    onDelete,
}) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const canDelete = currentUser &&
        onDelete &&
        (currentUser.id === post.authorId || currentUser.role == UserRole.ADMIN);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 h-full flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <Link to={`/post/${post.id}`} className="block group flex-1">
                    <div className="aspect-video rounded-lg overflow-hidden">
                        {post.image ? (
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center group-hover:opacity-90 transition-opacity">
                                <ImageIcon className="w-12 h-12 text-blue-300 dark:text-blue-500" />
                            </div>
                        )}
                    </div>
                </Link>
                {canDelete && (
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ml-4"
                        aria-label="Delete post"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                )}
            </div>

            <Link to={`/post/${post.id}`} className="group">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                </h2>
            </Link>

            <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-3">
                {post.content}
            </p>

            <Link
                to={`/post/${post.id}`}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mt-2"
            >
                Read more
            </Link>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                        {new Date(post.publishDate).toLocaleString()}
                    </span>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <ThumbsUp className="w-4 h-4 text-emerald-500" />
                            <span className="text-gray-600 dark:text-gray-300">
                                {post.likes?.filter(like => like.type === LikeType.LIKE).length || 0}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <ThumbsDown className="w-4 h-4 text-red-500" />
                            <span className="text-gray-600 dark:text-gray-300">
                                {post.likes?.filter(like => like.type === LikeType.DISLIKE).length || 0}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <MessageSquare className="w-4 h-4 text-blue-500" />
                            <span className="text-gray-600 dark:text-gray-300">
                                {post.comments?.length || 0}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {canDelete && (
                <DeleteModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={() => {
                        onDelete(post.id);
                        setShowDeleteModal(false);
                    }}
                    isDeleting={false}
                />
            )}
        </div>
    );
};