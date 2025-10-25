// src/api/services/auth.service.ts
import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from "../payloads/auth.payload";

// helper opcional p/ limpar cookie do mesmo domínio
function clearFrontendCookie(name: string) {
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export const authService = {
  async login(loginPayload: LoginPayload): Promise<LoginResponse> {
    // 👇 FORÇA sem credenciais (sem cookies) para não tropeçar em CORS
    const response = await api.post(ENDPOINTS.AUTH.LOGIN, loginPayload, { withCredentials: false });
    // espere { access_token } no response; ajuste o tipo se seu back usa outro nome
    return response.data;
  },

  async register(registerPayload: RegisterPayload): Promise<RegisterResponse> {
    // idem: evitar credenciais aqui também
    const response = await api.post(ENDPOINTS.AUTH.REGISTER, registerPayload, { withCredentials: false });
    return response.data;
  },

  logout() {
    localStorage.removeItem("access_token");
    // 👇 se você espelha o token em cookie no LoginForm, apague aqui também:
    clearFrontendCookie("access_token");
  },
};
