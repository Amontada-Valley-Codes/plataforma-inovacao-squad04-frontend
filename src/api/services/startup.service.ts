// src/api/services/startup.service.ts
import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import type {
  ShowAllStartupsResponse,
  UpdateStartupPayload,
} from "../payloads/startup.payload";

/* ------------------------------- Helpers ------------------------------- */

// Evita cache agressivo de CDN inserindo um query param
function withBust(url: string) {
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}v=${Date.now()}`;
}

// Remove campos vazios e normaliza formatos sensíveis
function cleanPayload(p: UpdateStartupPayload): UpdateStartupPayload {
  const norm: UpdateStartupPayload = {
    ...p,
    // se existir whatsapp/instagram em string, normaliza formatos comuns
    whatsapp: p.whatsapp ? p.whatsapp.replace(/\D+/g, "") : undefined,
    instagram: p.instagram ? p.instagram.replace(/^@/, "") : undefined,
  };

  for (const k of Object.keys(norm)) {
    const v = (norm as any)[k];
    if (v === "" || v === null || v === undefined) {
      delete (norm as any)[k];
    }
  }
  return norm;
}

// Compara original x editado e devolve só o que mudou (superficial)
function diffPayload(
  original: Partial<ShowAllStartupsResponse>,
  edited: UpdateStartupPayload
): UpdateStartupPayload {
  const out: UpdateStartupPayload = {};
  (Object.keys(edited) as (keyof UpdateStartupPayload)[]).forEach((k) => {
    const before = (original as any)?.[k];
    const after = (edited as any)?.[k];

    // compara como string para evitar false-positives (ex.: 0 vs "0")
    if (String(before ?? "") !== String(after ?? "")) {
      (out as any)[k] = after;
    }
  });
  return out;
}

/* -------------------------------- Service ------------------------------- */

export const startupService = {
  // Listagem completa (usado pelo StartupCard)
  async showAllStartups(): Promise<ShowAllStartupsResponse[]> {
    try {
      const { data } = await api.get<ShowAllStartupsResponse[]>(
        ENDPOINTS.STARTUP.SHOW_ALL
      );
      return Array.isArray(data) ? data : [];
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404) {
        console.warn("[STARTUP] GET SHOW_ALL → 404 ([])");
        return [];
      }
      console.error("[STARTUP] GET SHOW_ALL falhou:", {
        status,
        url: err?.config?.url,
        baseURL: err?.config?.baseURL,
        data: err?.response?.data,
      });
      throw err;
    }
  },

  // Traz a startup do usuário logado
  async getMyStartup(): Promise<ShowAllStartupsResponse> {
    const url = withBust(ENDPOINTS.STARTUP.ME);
    const { data } = await api.get(url, {
      headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
    });
    return data;
  },

  // Alias para compatibilidade
  async showStartupMe(): Promise<ShowAllStartupsResponse> {
    return this.getMyStartup();
  },

  // Update parcial com limpeza + diff opcional
  async updateOne(
    id: string,
    payload: UpdateStartupPayload,
    options?: {
      sendDiff?: boolean;
      original?: Partial<ShowAllStartupsResponse>;
      strip?: (keyof UpdateStartupPayload)[];
    }
  ): Promise<ShowAllStartupsResponse> {
    let body: UpdateStartupPayload = payload;

    if (options?.sendDiff && options.original) {
      body = diffPayload(options.original, payload);
    }
    if (options?.strip?.length) {
      for (const key of options.strip) delete (body as any)[key];
    }

    body = cleanPayload(body);
    if (Object.keys(body).length === 0) {
      throw new Error("Nenhuma alteração para enviar.");
    }

    const { data } = await api.put(ENDPOINTS.STARTUP.UPDATE_ONE(id), body, {
      headers: { "Content-Type": "application/json", "Cache-Control": "no-cache" },
    });

    return data ?? (await this.getMyStartup());
  },

  // Upload de capa → refetch do /me
  async updateCoverImage(
    file: File,
    opts?: { startupId?: string }
  ): Promise<ShowAllStartupsResponse> {
    const form = new FormData();
    form.append("file", file);
    form.append("image", file);
    form.append("cover", file);
    form.append("coverImage", file);
    if (opts?.startupId) form.append("startupId", opts.startupId);

    await api.patch(ENDPOINTS.STARTUP.PATCH_COVER, form);
    return await this.getMyStartup();
  },

  // Upload de avatar → refetch do /me
  async updateProfileImage(
    file: File,
    opts?: { startupId?: string }
  ): Promise<ShowAllStartupsResponse> {
    const form = new FormData();
    form.append("file", file);
    form.append("image", file);
    form.append("avatar", file);
    form.append("profileImage", file);
    if (opts?.startupId) form.append("startupId", opts.startupId);

    await api.patch(ENDPOINTS.STARTUP.PATCH_PROFILE, form);
    return await this.getMyStartup();
  },
};
