import { Category, Like, User, Comment } from ".";

export enum PostStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

export class Post {
    id: number;
    authorId: number;
    author: User;
    title: string;
    publishDate: Date;
    status: PostStatus;
    content: string;
    image?: string;
    categories: Category[];
    comments: Comment[];
    likes: Like[];

    constructor(
        id: number,
        authorId: number,
        author: User,
        title: string,
        publishDate: Date,
        status: PostStatus,
        content: string,
        image?: string,
        categories: Category[] = [],
        comments: Comment[] = [],
        likes: Like[] = []
    ) {
        this.id = id;
        this.authorId = authorId;
        this.author = author;
        this.title = title;
        this.publishDate = publishDate;
        this.status = status;
        this.content = content;
        this.image = image;
        this.categories = categories;
        this.comments = comments;
        this.likes = likes;
    }
}