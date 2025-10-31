import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import { ShowAllUsersResponse, ShowLoggedUserResponse } from "../payloads/user.payload";

export const userService = {
    async showAllUsers(): Promise<ShowAllUsersResponse> {
        const { data } = await api.get<ShowAllUsersResponse>(ENDPOINTS.USER.SHOW_ALL);
        return data;
    },

    async showLoggedUser(): Promise<ShowLoggedUserResponse> {
        const { data } = await api.get(ENDPOINTS.USER.SHOW_LOGGED);
        return data;
    }
};
