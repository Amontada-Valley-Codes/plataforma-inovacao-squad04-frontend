// src/api/services/startup.service.ts
import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import type {
  ShowAllStartupsResponse,
  UpdateStartupPayload,
} from "../payloads/startup.payload";

/* ------------------------------- Helpers ------------------------------- */

function withBust(url: string) {
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}v=${Date.now()}`;
}

/** Remove campos vazios e normaliza formatos sensíveis */
function cleanPayload(p: UpdateStartupPayload): UpdateStartupPayload {
  const norm: UpdateStartupPayload = {
    ...p,
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

/** Calcula diff simples entre original e editado (evita PUT com campos idênticos) */
function diffPayload(
  original: Partial<ShowAllStartupsResponse>,
  edited: UpdateStartupPayload
): UpdateStartupPayload {
  const out: UpdateStartupPayload = {};
  (Object.keys(edited) as (keyof UpdateStartupPayload)[]).forEach((k) => {
    const before = (original as any)?.[k];
    const after = (edited as any)?.[k];
    if (String(before ?? "") !== String(after ?? "")) {
      (out as any)[k] = after;
    }
  });
  return out;
}

/* -------------------------------- Service ------------------------------- */

export const startupService = {
  async getMyStartup(): Promise<ShowAllStartupsResponse> {
    const url = withBust(ENDPOINTS.STARTUP.ME);
    const { data } = await api.get(url, {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });
    return data;
  },

  /** Alias para compatibilidade */
  async showStartupMe(): Promise<ShowAllStartupsResponse> {
    return this.getMyStartup();
  },

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

  /**
   * Atualiza o Avatar/Perfil (multipart/form-data) e retorna a startup fresca do backend.
   */
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
