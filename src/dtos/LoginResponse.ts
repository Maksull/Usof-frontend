import { UserDto } from "./user.dto";

export interface LoginResponse {
    user: UserDto;
    token: string;
}