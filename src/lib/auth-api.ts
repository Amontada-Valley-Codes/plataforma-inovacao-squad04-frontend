// src/lib/auth-api.ts
import { ENDPOINTS } from "@/api/endpoints";
import api from "@/lib/axios";
import { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from "@/api/payloads/auth.payload";


/** Registro via convite (usa token do link) */
export async function register(
  payload: RegisterPayload
): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>(
    ENDPOINTS.AUTH.REGISTER,
    payload
  );
  return data;
}

/** Login — back retorna { access_token } e (opcionalmente) seta cookie */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>(
    ENDPOINTS.AUTH.LOGIN,
    payload
  );
  return data;
}
