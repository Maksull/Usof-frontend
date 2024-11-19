import axios from "axios";
import config from '../config';
import { UserDto } from "../dtos";

export class UsersService {
    static async getUserProfile(): Promise<UserDto> {
        try {
            const response = await axios.get<UserDto>(`${config.backendUrl}/users/profile`);
            return response.data;

        } catch (error) {
            console.error('Get profile error:', error);
            throw error;
        }
    }

    static async updateProfile(data: { login?: string; fullName?: string }): Promise<UserDto> {
        try {
            const response = await axios.put<UserDto>(`${config.backendUrl}/users/profile`, data);
            return response.data;
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    }

    static async updateProfileImage(file: File): Promise<UserDto> {
        const formData = new FormData();
        formData.append('image', file);

        const response = await axios.post<UserDto>(
            `${config.backendUrl}/users/profile/image`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        return response.data;
    }

}