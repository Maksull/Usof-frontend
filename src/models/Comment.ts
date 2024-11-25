import { Like, Post, User } from ".";

export class Comment {
    id: number;
    authorId: number;
    author: User;
    publishDate: Date;
    content: string;
    postId: number;
    post: Post;
    likes: Like[];
    replyToId?: number;
    replyTo?: Comment;
    replies?: Comment[];

    constructor(
        id: number,
        authorId: number,
        author: User,
        publishDate: Date,
        content: string,
        postId: number,
        post: Post,
        likes: Like[] = [],
        replyToId?: number,
        replyTo?: Comment,
        replies: Comment[] = []
    ) {
        this.id = id;
        this.authorId = authorId;
        this.author = author;
        this.publishDate = publishDate;
        this.content = content;
        this.postId = postId;
        this.post = post;
        this.likes = likes;
        this.replyToId = replyToId;
        this.replyTo = replyTo;
        this.replies = replies;
    }
}