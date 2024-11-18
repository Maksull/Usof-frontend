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

    constructor(
        id: number,
        authorId: number,
        author: User,
        publishDate: Date,
        content: string,
        postId: number,
        post: Post,
        likes: Like[] = []
    ) {
        this.id = id;
        this.authorId = authorId;
        this.author = author;
        this.publishDate = publishDate;
        this.content = content;
        this.postId = postId;
        this.post = post;
        this.likes = likes;
    }
}