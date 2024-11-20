import axios from 'axios';
import { Post, PostStatus } from '../models';
import config from '../config';

interface PostFilters {
    categoryIds?: number[];
    dateInterval?: {
        startDate: string;
        endDate: string;
    };
    status?: PostStatus;
}

interface PaginationParams {
    page: number;
    pageSize: number;
}

interface GetPostsResponse {
    data: Post[];
    total: number;
    page: number;
    pageSize: number;
}

export class PostsService {
    static async createPost(formData: FormData): Promise<Post> {
        try {
            const response = await axios.post(`${config.backendUrl}/posts/createPost`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async updatePost(
        postId: number,
        formData: FormData
    ): Promise<Post> {
        try {
            const response = await axios.put(`${config.backendUrl}/posts/${postId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Delete a post
     */
    static async deletePost(postId: number): Promise<void> {
        try {
            await axios.delete(`${config.backendUrl}/posts/${postId}`);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Get posts with filters, sorting, and pagination
     */
    static async getPosts(
        filters: PostFilters = {},
        sortBy: 'date' | 'likes' = 'date',
        pagination: PaginationParams = { page: 1, pageSize: 10 }
    ): Promise<GetPostsResponse> {
        try {
            const params = new URLSearchParams();

            // Add pagination parameters
            params.append('page', pagination.page.toString());
            params.append('pageSize', pagination.pageSize.toString());

            // Add sorting
            params.append('sortBy', sortBy);

            // Add filters if they exist
            if (filters.categoryIds?.length) {
                filters.categoryIds.forEach(id => params.append('categoryIds', id.toString()));
            }

            if (filters.dateInterval) {
                params.append('startDate', filters.dateInterval.startDate);
                params.append('endDate', filters.dateInterval.endDate);
            }

            if (filters.status) {
                params.append('status', filters.status);
            }

            const response = await axios.get(`${config.backendUrl}/posts?${params.toString()}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Get a single post by ID
     */
    static async getPostById(postId: number): Promise<Post> {
        try {
            const response = await axios.get(`${config.backendUrl}/posts/${postId}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Handle API errors
     */
    private static handleError(error: any): Error {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.error || error.message;
            return new Error(`Posts service error: ${message}`);
        }
        return new Error('An unexpected error occurred in the posts service');
    }
}