import axios from "axios";
import { useState } from "react";
import config from "../../config";
import { PostsService } from "../../services";
import { Comment } from "../../models";
import { ExtendedPost, transformToExtendedPost } from "./PostPage";
import { Calendar, Loader2, MessageSquare, Reply, ThumbsDown, ThumbsUp, User } from "lucide-react";

type CommentComponentProps = {
    comment: Comment;
    setPost: (post: ExtendedPost | null) => void;
    isLiking: boolean;
    onCommentLike: (commentId: number, isLike: boolean) => void;
};

export const CommentComponent: React.FC<CommentComponentProps> = ({
    comment,
    setPost,
    isLiking,
    onCommentLike
}) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);
    const [showReplies, setShowReplies] = useState(false);

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        setIsSubmittingReply(true);
        try {
            await axios.post(`${config.backendUrl}/comments/${comment.id}/replies`, {
                content: replyContent.trim(),
                postId: comment.postId
            });
            setReplyContent('');
            setIsReplying(false);
            setShowReplies(true);
            const updatedPost = await PostsService.getPostById(comment.postId);
            setPost(transformToExtendedPost(updatedPost));
        } catch (err) {
            console.error('Error posting reply:', err);
        } finally {
            setIsSubmittingReply(false);
        }
    };

    if (comment.parentId) return null;

    const replyCount = comment.replies?.length || 0;
    return (
        <div className="border-b dark:border-gray-700 pb-6 animate-fadeIn">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                </div>

                <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                            {comment.author?.login ?? "unknown"}
                        </span>
                        <span className="text-gray-500">•</span>
                        <time className="text-sm text-gray-500 flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(comment.publishDate).toLocaleDateString()}
                        </time>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        {comment.content}
                    </p>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => onCommentLike(comment.id, true)}
                            disabled={isLiking}
                            className={`flex items-center text-sm px-3 py-1.5 rounded-md transition-all ${isLiking ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                } ${comment.likes?.some(like => like.type === 'like')
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-gray-500 dark:text-gray-400'
                                }`}
                        >
                            <ThumbsUp className="w-4 h-4 mr-1.5" />
                            {comment.likes?.filter(like => like.type === 'like').length || 0}
                        </button>

                        <button
                            onClick={() => onCommentLike(comment.id, false)}
                            disabled={isLiking}
                            className={`flex items-center text-sm px-3 py-1.5 rounded-md transition-all ${isLiking ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                } ${comment.likes?.some(like => like.type === 'dislike')
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-gray-500 dark:text-gray-400'
                                }`}
                        >
                            <ThumbsDown className="w-4 h-4 mr-1.5" />
                            {comment.likes?.filter(like => like.type === 'dislike').length || 0}
                        </button>

                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            className="flex items-center text-sm px-3 py-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                        >
                            <Reply className="w-4 h-4 mr-1.5" />
                            Reply
                        </button>

                        {replyCount > 0 && (
                            <button
                                onClick={() => setShowReplies(!showReplies)}
                                className="flex items-center text-sm px-3 py-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                            >
                                <MessageSquare className="w-4 h-4 mr-1.5" />
                                {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                            </button>
                        )}
                    </div>

                    {isReplying && (
                        <form onSubmit={handleReplySubmit} className="mt-4">
                            <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Write a reply..."
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                         transition-all"
                                rows={3}
                            />
                            <div className="mt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsReplying(false)}
                                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 
                                             dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 
                                             rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmittingReply || !replyContent.trim()}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white 
                                             rounded-lg hover:bg-blue-700 disabled:opacity-50 
                                             disabled:cursor-not-allowed transition-colors"
                                >
                                    {isSubmittingReply ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Posting...
                                        </>
                                    ) : (
                                        'Post Reply'
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    {showReplies && comment.replies && (
                        <div className="mt-4 space-y-4">
                            {comment.replies
                                .filter(reply => reply.parentId === comment.id)
                                .map((reply) => (
                                    <div
                                        key={reply.id}
                                        className="ml-6 pl-6 border-l-2 border-gray-200 dark:border-gray-700"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                                                    <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                </div>
                                            </div>

                                            <div className="flex-grow">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                                        {reply.author?.login ?? "unknown"}
                                                    </span>
                                                    <span className="text-gray-500">•</span>
                                                    <time className="text-sm text-gray-500">
                                                        {new Date(reply.publishDate).toLocaleDateString()}
                                                    </time>
                                                </div>

                                                <p className="text-gray-700 dark:text-gray-300 mb-3">
                                                    {reply.content}
                                                </p>

                                                <div className="flex items-center gap-4">
                                                    <button
                                                        onClick={() => onCommentLike(reply.id, true)}
                                                        disabled={isLiking}
                                                        className={`flex items-center text-sm px-2 py-1 rounded-md transition-all ${isLiking ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                                            } ${reply.likes?.some(like => like.type === 'like')
                                                                ? 'text-blue-600 dark:text-blue-400'
                                                                : 'text-gray-500 dark:text-gray-400'
                                                            }`}
                                                    >
                                                        <ThumbsUp className="w-3 h-3 mr-1" />
                                                        {reply.likes?.filter(like => like.type === 'like').length || 0}
                                                    </button>

                                                    <button
                                                        onClick={() => onCommentLike(reply.id, false)}
                                                        disabled={isLiking}
                                                        className={`flex items-center text-sm px-2 py-1 rounded-md transition-all ${isLiking ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                                            } ${reply.likes?.some(like => like.type === 'dislike')
                                                                ? 'text-red-600 dark:text-red-400'
                                                                : 'text-gray-500 dark:text-gray-400'
                                                            }`}
                                                    >
                                                        <ThumbsDown className="w-3 h-3 mr-1" />
                                                        {reply.likes?.filter(like => like.type === 'dislike').length || 0}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

};