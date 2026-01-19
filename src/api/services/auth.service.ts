// src/api/services/auth.service.ts
import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse, ResetPasswordPayload, ResetPasswordResponse } from "../payloads/auth.payload";

function clearFrontendCookie(name: string) {
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export const authService = {
  async login(loginPayload: LoginPayload): Promise<LoginResponse> {
    const response = await api.post(ENDPOINTS.AUTH.LOGIN, loginPayload, { withCredentials: false });
    return response.data;
  },

  async register(registerPayload: RegisterPayload): Promise<RegisterResponse> {
    const response = await api.post(ENDPOINTS.AUTH.REGISTER, registerPayload, { withCredentials: false });
    return response.data;
  },

  logout() {
    localStorage.removeItem("access_token");
    clearFrontendCookie("access_token");
  },

  async resetPassword(resetPasswordPayload: ResetPasswordPayload): Promise<ResetPasswordResponse> {
    const response = await api.post(ENDPOINTS.AUTH.RESET_PASSWORD, resetPasswordPayload)
    console.log(response.data)
    return response.data
  }
};
