import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Comment, LikeType, User, UserRole } from '../../models';

interface CommentCardProps {
    comment: Comment;
    currentUser: User | null;
    onDeleteClick: (commentId: number) => void;
}

export const CommentCard: React.FC<CommentCardProps> = ({
    comment,
    currentUser,
    onDeleteClick,
}) => {
    const canDelete = currentUser && (
        currentUser.id === comment.author.id ||
        currentUser.role == UserRole.ADMIN
    );

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 h-full flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <Link
                    to={`/post/${comment.postId}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium line-clamp-1"
                >
                    {comment.post.title}
                </Link>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {new Date(comment.publishDate).toLocaleDateString()}
                    </span>
                    {canDelete && (
                        <button
                            onClick={() => onDeleteClick(comment.id)}
                            className="p-1.5 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Delete comment"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {comment.replyTo && (
                <div className="mb-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Replying to @{comment.replyTo.author.login}
                    </p>
                </div>
            )}

            <p className="text-gray-800 dark:text-gray-200 flex-grow line-clamp-3 whitespace-pre-line break-words">
                {comment.content}
            </p>

            <div className="mt-4 flex items-center gap-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <ThumbsUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                        {comment.likes.filter(like => like.type === LikeType.LIKE).length}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <ThumbsDown className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                        {comment.likes.filter(like => like.type === LikeType.DISLIKE).length}
                    </span>
                </div>
            </div>
        </div>
    );
};