import { Calendar, Loader2, Reply, ThumbsDown, ThumbsUp, User, ChevronDown, ChevronUp } from "lucide-react";
import { ExtendedPost, transformToExtendedPost } from "./PostPage";
import axios from "axios";
import { useState } from "react";
import config from "../../config";
import { PostsService } from "../../services";
import { Comment } from '../../models';
import { useTranslation } from "react-i18next";

interface SingleCommentProps {
    comment: Comment;
    allComments: Comment[];
    setPost: (post: ExtendedPost | null) => void;
    isLiking: boolean;
    onCommentLike: (commentId: number, isLike: boolean) => void;
    depth?: number;
}


const SingleComment: React.FC<SingleCommentProps> = ({
    comment,
    allComments,
    setPost,
    isLiking,
    onCommentLike,
    depth = 0
}) => {
    const { t } = useTranslation();
    const [isReplying, setIsReplying] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);

    const replies = allComments.filter(c => c.replyToId === comment.id);
    const replyToComment = allComments.find(c => c.id === comment.replyToId);

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

    return (
        <div className="w-full mb-4">
            <div
                id={`comment-${comment.id}`}
                className={`relative flex flex-col ${depth > 0 ? 'ml-4 md:ml-8 pl-4 border-l-2 border-gray-200 dark:border-gray-700' : ''}`}
            >
                {replyToComment && (
                    <button
                        onClick={() => {
                            const element = document.getElementById(`comment-${replyToComment.id}`);
                            element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            element?.classList.add('bg-blue-50', 'dark:bg-blue-900/20');
                            setTimeout(() => {
                                element?.classList.remove('bg-blue-50', 'dark:bg-blue-900/20');
                            }, 2000);
                        }}
                        className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                        <Reply className="w-3 h-3 md:w-4 md:h-4 mr-1 rotate-180" />
                        <span>{t('comments.replyingTo', { username: replyToComment.author?.login ?? t('comments.unknownUser') })}</span>
                    </button>
                )}

                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        {comment.author?.profilePicture ? (
                            <img
                                src={comment.author.profilePicture}
                                alt={comment.author.login || t('comments.unknownUser')}
                                className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover ring-2 ring-blue-500"
                            />
                        ) : (
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center ring-2 ring-blue-500">
                                <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
                            </div>
                        )}
                    </div>

                    <div className="flex-grow overflow-hidden">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                {comment.author?.login ?? t('comments.unknownUser')}
                            </span>
                            <span className="text-gray-500">•</span>
                            <time className="text-xs md:text-sm text-gray-500 flex items-center">
                                <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                                {new Date(comment.publishDate).toLocaleDateString()}
                            </time>
                        </div>

                        <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 mb-3 whitespace-pre-line break-words line-clamp-3">
                            {comment.content}
                        </p>

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                onClick={() => onCommentLike(comment.id, true)}
                                disabled={isLiking}
                                className={`flex items-center text-xs md:text-sm px-2 py-1 rounded-md transition-all 
                    ${isLiking ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                    ${comment.likes?.some(like => like.type === 'like') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
                                aria-label={t('comments.likeComment')}
                            >
                                <ThumbsUp className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                                {comment.likes?.filter(like => like.type === 'like').length || 0}
                            </button>

                            <button
                                onClick={() => onCommentLike(comment.id, false)}
                                disabled={isLiking}
                                className={`flex items-center text-xs md:text-sm px-2 py-1 rounded-md transition-all 
                    ${isLiking ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                    ${comment.likes?.some(like => like.type === 'dislike') ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}
                                aria-label={t('comments.dislikeComment')}
                            >
                                <ThumbsDown className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                                {comment.likes?.filter(like => like.type === 'dislike').length || 0}
                            </button>

                            <button
                                onClick={() => setIsReplying(!isReplying)}
                                className="flex items-center text-xs md:text-sm px-2 py-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <Reply className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                                {t('comments.reply')}
                            </button>

                            {replies.length > 0 && (
                                <button
                                    onClick={() => setShowReplies(!showReplies)}
                                    className="flex items-center text-xs md:text-sm px-2 py-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    {showReplies ? (
                                        <ChevronUp className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                                    ) : (
                                        <ChevronDown className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                                    )}
                                    {t('comments.replies', { count: replies.length })}
                                </button>
                            )}
                        </div>

                        {isReplying && (
                            <form onSubmit={handleReplySubmit} className="mt-3">
                                <textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder={t('comments.replyPlaceholder')}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    rows={3}
                                />
                                <div className="mt-2 flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsReplying(false)}
                                        className="px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
                                    >
                                        {t('common.cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmittingReply || !replyContent.trim()}
                                        className="inline-flex items-center px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmittingReply ? (
                                            <>
                                                <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                                                {t('comments.posting')}
                                            </>
                                        ) : t('comments.postReply')}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {showReplies && replies.map(reply => (
                <SingleComment
                    key={reply.id}
                    comment={reply}
                    allComments={allComments}
                    setPost={setPost}
                    isLiking={isLiking}
                    onCommentLike={onCommentLike}
                    depth={depth + 1}
                />
            ))}
        </div>
    );
};


export const CommentComponent: React.FC<{
    comments: Comment[];
    setPost: (post: ExtendedPost | null) => void;
    isLiking: boolean;
    onCommentLike: (commentId: number, isLike: boolean) => void;
}> = ({
    comments,
    setPost,
    isLiking,
    onCommentLike
}) => {
        const rootComments = comments.filter(comment => !comment.replyToId);

        return (
            <div className="space-y-4">
                {rootComments.map(comment => (
                    <SingleComment
                        key={comment.id}
                        comment={comment}
                        allComments={comments}
                        setPost={setPost}
                        isLiking={isLiking}
                        onCommentLike={onCommentLike}
                    />
                ))}
            </div>
        );
    };