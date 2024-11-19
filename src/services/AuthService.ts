import axios from 'axios';
import { AxiosService } from '.';
import config from '../config';
import { LoginRequest, LoginResponse, RegisterRequest, UserDto } from '../dtos';

export class AuthService {
    private static saveToken(token: string): void {
        localStorage.setItem('authToken', token);
    }

    private static removeToken(): void {
        localStorage.removeItem('authToken');
    }

    static getToken(): string | null {
        return localStorage.getItem('authToken');
    }

    static async login(credentials: LoginRequest): Promise<UserDto> {
        try {
            const response = await axios.post<LoginResponse>(
                `${config.backendUrl}/auth/login`,
                credentials
            );
            this.saveToken(response.data.token);
            AxiosService.setAuthorizationToken();

            return response.data.user;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    static async register(userData: RegisterRequest): Promise<UserDto> {
        try {
            const response = await axios.post<UserDto>(
                `${config.backendUrl}/auth/register`,
                userData
            );
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    static async logout(): Promise<void> {
        try {
            await axios.post(`${config.backendUrl}/auth/logout`);
            this.removeToken();
            delete axios.defaults.headers.common['Authorization'];
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }

    static isAuthenticated(): boolean {
        return !!this.getToken();
    }

    static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
        try {
            await axios.post(`${config.backendUrl}/auth/change-password`, {
                currentPassword,
                newPassword,
            });
        } catch (error) {
            console.error('Change password error:', error);
            throw error;
        }
    }
}
