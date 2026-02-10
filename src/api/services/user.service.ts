import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import { ShowAllUsersResponse, ShowLoggedUserResponse, ShowPaginetedUsersResponse, UpdatesUserPayload, UpdatesUserResponse } from "../payloads/user.payload";

export const userService = {
    async showAllUsers(): Promise<ShowAllUsersResponse> {
        const { data } = await api.get<ShowAllUsersResponse>(ENDPOINTS.USER.SHOW_ALL);
        return data;
    },

    async showPaginatedUsers(page: number, limit: number): Promise<ShowPaginetedUsersResponse> {
        const { data } = await api.get(ENDPOINTS.USER.SHOW_PAGINATED_USERS(page, limit))
        return data;
    },
    
    async showLoggedUser(): Promise<ShowLoggedUserResponse> {
        const { data } = await api.get(ENDPOINTS.USER.PROFILE);
        return data;
    },

    async updateUser(updateUserPayload: UpdatesUserPayload): Promise<UpdatesUserResponse> {
        const { data } = await api.put(ENDPOINTS.USER.UPDATE, updateUserPayload)
        return data;
    },

    async delete(id: string) {
        const { data } = await api.delete(ENDPOINTS.USER.DELETE(id))
        return data;
    }
};
