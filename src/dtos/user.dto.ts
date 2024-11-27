import { UserRole } from "../models";

export interface UserDto {
    id: number;
    login: string;
    fullName: string;
    email: string;
    postsCount: number;
    commentsCount: number;
    profilePicture?: string;
    rating: number;
    role: UserRole;
}