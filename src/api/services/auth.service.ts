import api from "../axios"
import { ENDPOINTS } from "../endpoints"
import { LoginPayload, LoginResponse } from "../payloads/auth.payload"

export const authService = {
  async login(loginPayload: LoginPayload): Promise<LoginResponse> {
    const response = await api.post(ENDPOINTS.AUTH.LOGIN, loginPayload);
    console.log(response.data);
    return response.data;
  }
}