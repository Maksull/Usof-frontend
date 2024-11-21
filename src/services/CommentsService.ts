import axios from "axios";
import config from "../config";

export class CommentsService {

    static async createComment(postId: number, content: string): Promise<Comment> {
        try {
            const response = await axios.post(`${config.backendUrl}/posts/${postId}/comments`, { content });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async getPostComments(postId: number): Promise<Comment[]> {
        try {
            const response = await axios.get(`${config.backendUrl}/posts/${postId}/comments`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async deleteComment(commentId: number): Promise<void> {
        try {
            await axios.delete(`${config.backendUrl}/comments/${commentId}`);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    private static handleError(error: any): Error {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.error || error.message;
            return new Error(`Comments service error: ${message}`);
        }
        return new Error('An unexpected error occurred in the comments service');
    }
}