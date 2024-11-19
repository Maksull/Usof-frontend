import { UserRole } from "../models";

export interface RegisterResponse {
    id: number;
    login: string;
    fullName: string;
    email: string;
    profilePicture?: string;
    rating: number;
    role: UserRole;
}