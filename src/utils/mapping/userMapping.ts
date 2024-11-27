import { UserDto } from "../../dtos";
import { User } from "../../models";

export const mapDtoToUser = (dto: UserDto): User => {
    return new User(
        dto.id,
        dto.login,
        '', // password is empty as it's not returned from API
        dto.fullName,
        dto.email,
        dto.postsCount,
        dto.commentsCount,
        dto.profilePicture,
        dto.rating,
        dto.role,
        [], // posts
        [], // comments
        []  // likes
    );
};