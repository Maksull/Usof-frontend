import axios from 'axios';
import { Post, PostStatus } from '../models';
import config from '../config';

interface PostFilters {
    categoryIds?: number[];
    dateInterval?: { startDate: string; endDate: string };
    status?: PostStatus;
    searchQuery?: string;
}

interface PaginationParams {
    page: number;
    pageSize: number;
}

type SortBy = 'publishDate' | 'likesCount' | 'commentsCount';

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
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async updatePost(postId: number, formData: FormData): Promise<Post> {
        try {
            const response = await axios.put(`${config.backendUrl}/posts/${postId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async deletePost(postId: number): Promise<void> {
        try {
            await axios.delete(`${config.backendUrl}/posts/${postId}`);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async getPosts(
        filters: PostFilters = {},
        sortBy: SortBy = 'publishDate',
        pagination: PaginationParams = { page: 1, pageSize: 10 }
    ): Promise<GetPostsResponse> {
        try {
            console.log("Filters")
            console.log(filters)
            const params = new URLSearchParams();

            if (filters.searchQuery) {
                params.append('searchQuery', filters.searchQuery?.toString());
            }

            // Pagination
            params.append('page', pagination.page.toString());
            params.append('pageSize', pagination.pageSize.toString());

            // Sorting
            // Convert frontend sort values to backend expected values
            const sortMapping: Record<SortBy, string> = {
                publishDate: 'date',
                likesCount: 'likes',
                commentsCount: 'comments'
            };
            params.append('sortBy', sortMapping[sortBy]);

            // Filters
            if (filters.categoryIds?.length) {
                filters.categoryIds.forEach(id => params.append('categoryIds', id.toString()));
            }

            if (filters.dateInterval) {
                const { startDate, endDate } = filters.dateInterval;
                if (startDate) params.append('startDate', new Date(startDate).toISOString().split('T')[0]);
                if (endDate) params.append('endDate', new Date(endDate).toISOString().split('T')[0]);
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

    static async getPostById(postId: number): Promise<Post> {
        try {
            const response = await axios.get(`${config.backendUrl}/posts/${postId}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    private static handleError(error: any): Error {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.error || error.message;
            return new Error(`Posts service error: ${message}`);
        }
        return new Error('An unexpected error occurred in the posts service');
    }
}