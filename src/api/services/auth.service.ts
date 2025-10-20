import { LogOut } from "lucide-react";
import api from "../axios"
import { ENDPOINTS } from "../endpoints"
import { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from "../payloads/auth.payload"

export const authService = {
  async login(loginPayload: LoginPayload): Promise<LoginResponse> {
    const response = await api.post(ENDPOINTS.AUTH.LOGIN, loginPayload);
    console.log(response.data);
    return response.data;
  },

  async Register(registerPayload: RegisterPayload): Promise<RegisterResponse> {
    const response = await api.post(ENDPOINTS.AUTH.REGISTER, registerPayload);
    console.log(response.data);
    return response.data;
  },

  Logout() {
    localStorage.removeItem("access_token");
  }
}