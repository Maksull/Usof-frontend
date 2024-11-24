import axios from "axios";
import { useState } from "react";
import config from "../../config";
import { PostsService } from "../../services";
import { Comment } from "../../models";
import { ExtendedPost, transformToExtendedPost } from "./PostPage";
import { ThumbsDown, ThumbsUp } from "lucide-react";

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
            const updatedPost = await PostsService.getPostById(comment.postId);
            setPost(transformToExtendedPost(updatedPost));
        } catch (err) {
            console.error('Error posting reply:', err);
        } finally {
            setIsSubmittingReply(false);
        }
    };

    // If this is a reply, only render if being displayed as a reply
    // Don't render if this is a reply (it will be rendered by parent)
    if (comment.parentId) {
        return null;
    }

    return (
        <div className="border-b dark:border-gray-700 pb-4">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                        {comment.author?.login ?? "unknown"}
                    </span>
                    <span className="mx-2 text-gray-500">•</span>
                    <time className="text-sm text-gray-500">
                        {new Date(comment.publishDate).toLocaleString()}
                    </time>
                </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-2">
                {comment.content}
            </p>

            <div className="flex items-center space-x-4">
                {onCommentLike && (
                    <>
                        <button
                            onClick={() => onCommentLike(comment.id, true)}
                            disabled={isLiking}
                            className={`flex items-center text-sm transition-colors
                            ${comment.likes?.some(like => like.type === 'like')
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-gray-500 dark:text-gray-400'}`}
                        >
                            <ThumbsUp
                                className="w-4 h-4 mr-1"
                                strokeWidth={2}
                            />
                            {comment.likes?.filter(like => like.type === 'like').length || 0}
                        </button>

                        <button
                            onClick={() => onCommentLike(comment.id, false)}
                            disabled={isLiking}
                            className={`flex items-center text-sm transition-colors
                            ${comment.likes?.some(like => like.type === 'dislike')
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-gray-500 dark:text-gray-400'}`}
                        >
                            <ThumbsDown
                                className="w-4 h-4 mr-1"
                                strokeWidth={2}
                            />
                            {comment.likes?.filter(like => like.type === 'dislike').length || 0}
                        </button>
                    </>
                )}

                <button
                    onClick={() => setIsReplying(!isReplying)}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                    Reply
                </button>
            </div>

            {isReplying && (
                <form onSubmit={handleReplySubmit} className="mt-4 ml-8">
                    <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write a reply..."
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        rows={2}
                    />
                    <div className="mt-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmittingReply || !replyContent.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                                disabled:opacity-50"
                        >
                            {isSubmittingReply ? 'Posting...' : 'Post Reply'}
                        </button>
                    </div>
                </form>
            )}

            {/* Display replies */}
            <div className="ml-8 mt-4 space-y-4">
                {comment.replies
                    ?.filter(reply => reply.parentId === comment.id)
                    .map((reply) => (
                        <div
                            key={reply.id}
                            className="border-l-2 border-gray-200 dark:border-gray-700 pl-4"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center">
                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                        {reply.author?.login ?? "unknown"}
                                    </span>
                                    <span className="mx-2 text-gray-500">•</span>
                                    <time className="text-sm text-gray-500">
                                        {new Date(reply.publishDate).toLocaleString()}
                                    </time>
                                </div>
                            </div>

                            <p className="text-gray-700 dark:text-gray-300 mb-2">
                                {reply.content}
                            </p>

                            <div className="flex items-center space-x-4">
                                {onCommentLike && (
                                    <>
                                        <button
                                            onClick={() => onCommentLike(reply.id, true)}
                                            disabled={isLiking}
                                            className={`flex items-center text-sm transition-colors
                                            ${reply.likes?.some(like => like.type === 'like')
                                                    ? 'text-blue-600 dark:text-blue-400'
                                                    : 'text-gray-500 dark:text-gray-400'}`}
                                        >
                                            <ThumbsUp
                                                className="w-4 h-4 mr-1"
                                                strokeWidth={2}
                                            />
                                            {reply.likes?.filter(like => like.type === 'like').length || 0}
                                        </button>

                                        <button
                                            onClick={() => onCommentLike(reply.id, false)}
                                            disabled={isLiking}
                                            className={`flex items-center text-sm transition-colors
                                            ${reply.likes?.some(like => like.type === 'dislike')
                                                    ? 'text-red-600 dark:text-red-400'
                                                    : 'text-gray-500 dark:text-gray-400'}`}
                                        >
                                            <ThumbsDown
                                                className="w-4 h-4 mr-1"
                                                strokeWidth={2}
                                            />
                                            {reply.likes?.filter(like => like.type === 'dislike').length || 0}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};