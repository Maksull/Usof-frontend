import { Post } from ".";

export class Category {
    id: number;
    title: string;
    description: string;
    posts: Post[];

    constructor(id: number, title: string, description: string, posts: Post[]) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.posts = posts;
    }
}