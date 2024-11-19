import axios from "axios";

export class AxiosService {
    static getToken(): string | null {
        return localStorage.getItem('authToken');
    }

    static setAuthorizationToken(): void {
        const token = this.getToken();
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }

    static configureAxios(): void {
        this.setAuthorizationToken();
    }
}