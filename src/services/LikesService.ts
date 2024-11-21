import axios from "axios";
import { Like } from "../models";
import config from "../config";

export class LikesService {
    static async createLike(postId: number | undefined, commentId: number | undefined, isLike: boolean): Promise<Like> {
        try {
            const response = await axios.post(`${config.backendUrl}/likes`, {
                postId,
                commentId,
                isLike
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async deleteLike(likeId: number): Promise<void> {
        try {
            await axios.delete(`${config.backendUrl}/likes/${likeId}`);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    private static handleError(error: any): Error {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.error || error.message;
            return new Error(`Likes service error: ${message}`);
        }
        return new Error('An unexpected error occurred in the likes service');
    }
}