/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  FaClipboardList,
  FaEnvelope,
  FaInstagram,
  FaLinkedin,
  FaMapMarkedAlt,
  FaRegImage,
  FaRocket,
  FaWhatsapp,
} from "react-icons/fa";
import { X, Edit3, Save, Loader2, UploadCloud, ImageUp } from "lucide-react";
import { ShowAllStartupsResponse } from "@/api/payloads/startup.payload";
import { startupService } from "@/api/services/startup.service";

/* ------------------------------- Helpers ------------------------------- */

// pega a primeira chave que existir com URL/string válida
function pick(obj: any, keys: string[]): string | null {
  for (const k of keys) {
    const v = obj?.[k];
    if (typeof v === "string" && v.trim()) return v;
  }
  return null;
}

// prefixa base quando caminho é relativo
function absolutize(url?: string | null): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "";
  const path = url.replace(/^\/+/, "");
  return base ? `${base}/${path}` : `/${path}`;
}

// forçar refresh após upload
function withBust(url?: string | null): string | null {
  if (!url) return null;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}v=${Date.now()}`;
}

// se imagens exigirem Authorization, use (opcionalmente) o proxy interno
const REQUIRE_AUTH =
  String(process.env.NEXT_PUBLIC_REQUIRE_AUTH_IMAGES || "").toLowerCase() === "true";

function proxyUrl(raw: string): string {
  return `/api/proxy/image?src=${encodeURIComponent(raw)}`;
}

function imageSrc(raw?: string | null): string | null {
  if (!raw) return null;
  return REQUIRE_AUTH ? proxyUrl(raw) : raw;
}

// valida imagem (tipo e tamanho)
function validateImage(file: File) {
  const MAX_MB = 5;
  const okType = /^image\//.test(file.type);
  const okSize = file.size <= MAX_MB * 1024 * 1024;
  return {
    ok: okType && okSize,
    reason: !okType
      ? "Tipo de arquivo inválido (use uma imagem)."
      : !okSize
      ? `Arquivo muito grande (máx. ${MAX_MB}MB).`
      : "",
  };
}

// normalizadores de link
function normalizeHttp(url?: string | null): string | null {
  if (!url) return null;
  const u = url.trim();
  if (!u) return null;
  if (/^https?:\/\//i.test(u)) return u;
  return `https://${u}`;
}
function normalizeInstagram(handle?: string | null): string | null {
  if (!handle) return null;
  const h = handle.trim().replace(/^@/, "");
  return h ? `https://instagram.com/${h}` : null;
}
function normalizeWhatsapp(v?: string | null): string | null {
  if (!v) return null;
  const digits = v.replace(/\D+/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}
function normalizeLinkedin(url?: string | null): string | null {
  return normalizeHttp(url);
}
function normalizeEmail(email?: string | null): string | null {
  if (!email) return null;
  const e = email.trim();
  return e ? `mailto:${e}` : null;
}
function normalizeMaps({
  lat,
  lng,
  address,
  mapsUrl,
}: {
  lat?: string | number | null;
  lng?: string | number | null;
  address?: string | null;
  mapsUrl?: string | null;
}): string | null {
  if (mapsUrl) return normalizeHttp(mapsUrl);
  if (lat != null && lng != null) return `https://www.google.com/maps?q=${lat},${lng}`;
  if (address) return `https://www.google.com/maps?q=${encodeURIComponent(address)}`;
  return null;
}

/* ------------------------------- Component ------------------------------- */

type Props = {
  data: ShowAllStartupsResponse;
  onClose?: () => void; // modal
  isPage?: boolean; // ajustes de scroll
   onMutateMe?: () => void | Promise<any>;
};

export default function StartupProfileContent({ data, onClose, isPage, onMutateMe }: Props) {
  const anyData = data as any;

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // uploads
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const coverRef = useRef<HTMLInputElement | null>(null);
  const avatarRef = useRef<HTMLInputElement | null>(null);

  // URLs iniciais (aceitando várias chaves do backend)
  const initialCoverRaw =
    absolutize(
      pick(anyData, ["coverImageUrl", "cover_url", "coverImage", "cover", "bannerUrl", "banner_url"])
    ) || null;

  const initialAvatarRaw =
    absolutize(
      pick(anyData, ["profileImageUrl", "profile_image_url", "avatarUrl", "avatar", "profileImage", "photo_url"])
    ) || null;

  const [coverUrl, setCoverUrl] = useState<string | null>(initialCoverRaw ? withBust(initialCoverRaw) : null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarRaw ? withBust(initialAvatarRaw) : null);

  // guarda o último URL que carregou com sucesso (evita "aparece e some")
  const [lastGoodCover, setLastGoodCover] = useState<string | null>(coverUrl);
  const [lastGoodAvatar, setLastGoodAvatar] = useState<string | null>(avatarUrl);

  // flags para tentar proxy apenas uma vez quando não estiver usando proxy por padrão
  const [triedProxyCover, setTriedProxyCover] = useState(false);
  const [triedProxyAvatar, setTriedProxyAvatar] = useState(false);

  // sincroniza se o pai passar outro "data" (mas não durante upload para não sobrescrever preview)
  const uploading = uploadingCover || uploadingAvatar;
  useEffect(() => {
    if (uploading) return;

    const cover = absolutize(
      pick(data as any, ["coverImageUrl", "cover_url", "coverImage", "cover", "bannerUrl", "banner_url"])
    );
    const avatar = absolutize(
      pick(data as any, ["profileImageUrl", "profile_image_url", "avatarUrl", "avatar", "profileImage", "photo_url"])
    );

    if (cover) {
      setTriedProxyCover(false);
      setCoverUrl(withBust(cover));
    }
    if (avatar) {
      setTriedProxyAvatar(false);
      setAvatarUrl(withBust(avatar));
    }
  }, [data, uploading]);

  // formulário
  const [form, setForm] = useState({
    name: data?.name ?? anyData?.startupName ?? anyData?.title ?? "Nome da Startup",
    description: anyData?.description ?? anyData?.about ?? anyData?.bio ?? anyData?.pitch ?? "",
    technologies_used: anyData?.technologies_used ?? anyData?.technologies ?? anyData?.stack ?? "",
    founders: anyData?.founders ?? anyData?.gestor ?? anyData?.owner ?? "",
    industry_segment:
      anyData?.industry_segment ?? anyData?.segment ?? anyData?.sector ?? anyData?.area ?? anyData?.category ?? "",
    cnpj: anyData?.cnpj ?? anyData?.document ?? "",
    website: anyData?.website ?? anyData?.site ?? anyData?.url ?? anyData?.homepage ?? "",
    instagram: anyData?.instagram ?? anyData?.instagram_url ?? anyData?.instagramHandle ?? anyData?.socialInstagram ?? "",
    whatsapp: anyData?.whatsapp ?? anyData?.phone ?? "",
    linkedin: anyData?.linkedin ?? anyData?.linkedin_url ?? "",
    email: anyData?.email ?? anyData?.contactEmail ?? "",
    // localização (qualquer que seja o que vier)
    address: anyData?.address ?? anyData?.endereco ?? "",
    latitude: anyData?.latitude ?? anyData?.lat ?? null,
    longitude: anyData?.longitude ?? anyData?.lng ?? anyData?.long ?? null,
    maps_url: anyData?.maps_url ?? anyData?.mapsUrl ?? "",
  });

  const onChange =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const PUT_CASING = (process.env.NEXT_PUBLIC_STARTUP_PUT_CASING || "snake").toLowerCase();

  function buildUpdatePayload(src: typeof form) {
    const snake = {
      name: src.name,
      description: src.description,
      technologies_used: src.technologies_used,
      founders: src.founders,
      industry_segment: src.industry_segment,
      cnpj: src.cnpj,
      website: src.website,
    };

    const camel = {
      name: src.name,
      description: src.description,
      technologiesUsed: src.technologies_used,
      founders: src.founders,
      industrySegment: src.industry_segment,
      cnpj: src.cnpj,
      website: src.website,
    };

    const base = PUT_CASING === "camel" ? camel : snake;

    // remove vazios
    const out: Record<string, any> = {};
    for (const k of Object.keys(base)) {
      const v = (base as any)[k];
      if (v !== undefined && v !== null && String(v).trim() !== "") {
        out[k] = v;
      }
    }
    return out;
  }

  const onSave = async () => {
    if (!data?.id) return;
    setSaving(true);
    try {
      const payload = buildUpdatePayload(form);
      await startupService.updateOne(data.id, payload as any);
      await onMutateMe?.();
setIsEditing(false);

      // 🔁 Refetch para garantir persistência real do que o back gravou
      const fresh = await startupService.getMyStartup();

      // Reidrata o form com o que veio do servidor
      setForm((prev) => ({
        ...prev,
        name: (fresh as any)?.name ?? prev.name,
        description: (fresh as any)?.description ?? prev.description,
        technologies_used: (fresh as any)?.technologies_used ?? (fresh as any)?.technologiesUsed ?? prev.technologies_used,
        founders: (fresh as any)?.founders ?? prev.founders,
        industry_segment:
          (fresh as any)?.industry_segment ?? (fresh as any)?.industrySegment ?? prev.industry_segment,
        cnpj: (fresh as any)?.cnpj ?? prev.cnpj,
        website: (fresh as any)?.website ?? prev.website,
        // redes e afins não entram no PUT (evita 400), mas se o back devolver, mantemos:
        instagram: (fresh as any)?.instagram ?? prev.instagram,
        whatsapp: (fresh as any)?.whatsapp ?? prev.whatsapp,
        linkedin: (fresh as any)?.linkedin ?? prev.linkedin,
        email: (fresh as any)?.email ?? prev.email,
        address: (fresh as any)?.address ?? prev.address,
        latitude: (fresh as any)?.latitude ?? prev.latitude,
        longitude: (fresh as any)?.longitude ?? prev.longitude,
        maps_url: (fresh as any)?.maps_url ?? (fresh as any)?.mapsUrl ?? prev.maps_url,
      }));

      // Reidrata capa/avatar se o back já devolver URLs
      const newCover = absolutize(
        pick(fresh as any, ["coverImageUrl", "cover_url", "coverImage", "cover", "bannerUrl", "banner_url"])
      );
      const newAvatar = absolutize(
        pick(fresh as any, ["profileImageUrl", "profile_image_url", "avatarUrl", "avatar", "profileImage", "photo_url"])
      );
      if (newCover) {
        setTriedProxyCover(false);
        setCoverUrl(withBust(newCover));
      }
      if (newAvatar) {
        setTriedProxyAvatar(false);
        setAvatarUrl(withBust(newAvatar));
      }

      setIsEditing(false);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (Array.isArray(err?.response?.data?.errors) ? err.response.data.errors.join(", ") : "") ||
        err?.message ||
        "Erro ao salvar dados.";
      console.error("Falha no update:", err?.response?.status, err?.response?.data);
      alert(`Não foi possível salvar: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  // uploads
  const onPickCover = () => coverRef.current?.click();
  const onPickAvatar = () => avatarRef.current?.click();

  const onUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !data?.id) return;

    const v = validateImage(file);
    if (!v.ok) {
      alert(v.reason);
      e.target.value = "";
      return;
    }

    // preview otimista
    const preview = URL.createObjectURL(file);
    setCoverUrl(preview);

    setUploadingCover(true);
    try {
      await startupService.updateCoverImage(file, { startupId: data.id });
      await onMutateMe?.();

      // refetch para pegar URL final da capa
      const latest = await startupService.getMyStartup();
      const newCover = absolutize(
        pick(latest as any, ["coverImageUrl", "cover_url", "coverImage", "cover", "bannerUrl", "banner_url"])
      );
      setTriedProxyCover(false);
      setCoverUrl(withBust(newCover || preview));
    } catch (err: any) {
      console.error("Falha ao enviar capa:", err?.response?.data || err);
      alert("Não foi possível atualizar a capa.");
      setCoverUrl(initialCoverRaw ?? null);
    } finally {
      setUploadingCover(false);
      e.target.value = "";
    }
  };

  const onUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !data?.id) return;

    const v = validateImage(file);
    if (!v.ok) {
      alert(v.reason);
      e.target.value = "";
      return;
    }

    // preview otimista
    const preview = URL.createObjectURL(file);
    setAvatarUrl(preview);

    setUploadingAvatar(true);
    try {
      await startupService.updateProfileImage(file, { startupId: data.id });
      await onMutateMe?.();

      // refetch para pegar URL final do avatar
      const latest = await startupService.getMyStartup();
      const newAvatar = absolutize(
        pick(latest as any, ["profileImageUrl", "profile_image_url", "avatarUrl", "avatar", "profileImage", "photo_url"])
      );
      setTriedProxyAvatar(false);
      setAvatarUrl(withBust(newAvatar || preview));
    } catch (err: any) {
      console.error("Falha ao enviar avatar:", err?.response?.data || err);
      alert("Não foi possível atualizar a foto de perfil.");
      setAvatarUrl(initialAvatarRaw ?? null);
    } finally {
      setUploadingAvatar(false);
      e.target.value = "";
    }
  };

  const bodyScrollClasses = isPage ? "overflow-visible" : "overflow-y-auto max-h-[calc(95vh-56px)]";
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg w-full max-w-full md:max-w-5xl relative overflow-hidden max-h-[95vh] md:max-h-none flex flex-col">
      {/* Banner */}
      <div className="relative h-48 sm:h-56 md:h-64 w-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
        {/* Imagem ou placeholder */}
        {coverUrl ? (
          <img
            src={imageSrc(coverUrl) || undefined}
            alt="Capa da startup"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
            onLoad={() => {
              setLastGoodCover(coverUrl);
            }}
            onError={() => {
              if (!REQUIRE_AUTH && !triedProxyCover && coverUrl) {
                setTriedProxyCover(true);
                setCoverUrl(proxyUrl(coverUrl));
                return;
              }
              if (lastGoodCover && lastGoodCover !== coverUrl) {
                setCoverUrl(lastGoodCover);
              } else {
                setCoverUrl(null);
              }
            }}
          />
        ) : (
          <FaRegImage className="text-gray-500 dark:text-[#ced3db] text-4xl sm:text-5xl" />
        )}

        {/* Fechar */}
        {!isPage && onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 sm:right-8 top-4 sm:top-6 w-10 sm:w-12 h-10 sm:h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center shadow-md hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            <X className="text-gray-400 hover:text-gray-600 transition" size={20} />
          </button>
        )}

        {/* Botão de alterar capa (só em edição) */}
        {isEditing && (
          <>
            <button
              onClick={onPickCover}
              disabled={uploadingCover}
              className="absolute right-4 bottom-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 dark:bg-gray-900/80 hover:bg-white shadow text-sm"
              title="Trocar capa"
            >
              {uploadingCover ? <Loader2 className="animate-spin" size={16} /> : <UploadCloud size={16} />}
              {uploadingCover ? "Enviando..." : "Trocar capa"}
            </button>
            <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={onUploadCover} />
          </>
        )}

        {/* Avatar */}
        <div className="absolute left-10 bottom-[-4rem] sm:bottom-[-5rem]">
          <div className="w-28 sm:w-36 h-28 sm:h-36 rounded-full bg-gray-100 dark:bg-gray-700 border-4 sm:border-8 border-white dark:border-gray-900 flex items-center justify-center shadow-md relative overflow-hidden">
            {avatarUrl ? (
              <img
                src={imageSrc(avatarUrl) || undefined}
                alt="Foto de perfil"
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
                onLoad={() => {
                  setLastGoodAvatar(avatarUrl);
                }}
                onError={() => {
                  if (!REQUIRE_AUTH && !triedProxyAvatar && avatarUrl) {
                    setTriedProxyAvatar(true);
                    setAvatarUrl(proxyUrl(avatarUrl));
                    return;
                  }
                  if (lastGoodAvatar && lastGoodAvatar !== avatarUrl) {
                    setAvatarUrl(lastGoodAvatar);
                  } else {
                    setAvatarUrl(null);
                  }
                }}
              />
            ) : (
              <FaRegImage className="text-gray-500 dark:text-[#ced3db] text-4xl sm:text-5xl" />
            )}

            {/* Botão de alterar avatar (só em edição) */}
            {isEditing && (
              <>
                <button
                  onClick={onPickAvatar}
                  disabled={uploadingAvatar}
                  className="absolute -right-2 -bottom-2 inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-white/80 dark:bg-gray-900/80 hover:bg-white shadow"
                  title="Trocar foto de perfil"
                >
                  {uploadingAvatar ? <Loader2 className="animate-spin" size={14} /> : <ImageUp size={14} />}
                  {uploadingAvatar ? "Enviando" : "trocar"}
                </button>
                <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={onUploadAvatar} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className={`${bodyScrollClasses} px-5 sm:px-8 pb-8 mt-20 sm:mt-24 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Lado esquerdo */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between gap-2">
              {isEditing ? (
                <input
                  value={form.name}
                  onChange={onChange("name")}
                  className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-800 bg-transparent border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-0"
                />
              ) : (
                <h2 className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-800">{form.name}</h2>
              )}

              <div className="flex items-center gap-2">
                {isEditing ? (
                  <button
                    onClick={onSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
                  >
                    {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    Salvar
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-blue-900 dark:text-[#ced3db] px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <Edit3 size={16} /> Editar
                  </button>
                )}
              </div>
            </div>

            {/* Descrição */}
            <EditableText label="Descrição" value={form.description} isEditing={isEditing} onChange={onChange("description")} />

            {/* Tecnologias */}
            <EditableText
              label="Tecnologias usadas"
              value={form.technologies_used}
              isEditing={isEditing}
              onChange={onChange("technologies_used")}
            />

            {/* Badges principais */}
            <div className="flex flex-wrap gap-3 mt-5">
              <EditableBadge label="Gestor" value={form.founders} isEditing={isEditing} onChange={onChange("founders")} />
              <EditableBadge
                label="Área de atuação"
                value={form.industry_segment}
                isEditing={isEditing}
                onChange={onChange("industry_segment")}
              />
              <EditableBadge label="CNPJ" value={form.cnpj} isEditing={isEditing} onChange={onChange("cnpj")} />
            </div>

            {/* Cards (mock) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-[#ced3db]">Posição</p>
                    <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-800">10</h2>
                    <p className="text-blue-900 dark:text-[#ced3db] font-medium">Entre as startups mais utilizadas</p>
                    <p className="text-sm text-gray-600 dark:text-[#ced3db] mt-1">
                      Subiu <span className="text-green-500 font-medium">2</span> posições esse mês
                    </p>
                  </div>
                  <FaRocket className="text-blue-900 dark:text-blue-800 text-xl" />
                </div>
              </div>

              <div className="border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-[#ced3db]">Quantidade</p>
                    <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-800">150</h2>
                    <p className="text-blue-900 dark:text-[#ced3db] font-medium">Solicitações Resolvidas</p>
                    <p className="text-sm text-gray-600 dark:text-[#ced3db] mt-1">
                      <span className="text-green-500 font-medium">10%</span> desde o último mês
                    </p>
                  </div>
                  <FaClipboardList className="text-blue-900 dark:text-blue-800 text-xl" />
                </div>
              </div>

              <div className="border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
                <p className="text-sm text-gray-600 dark:text-[#ced3db] mb-2">Tecnologias</p>
                <p className="text-blue-900 dark:text-[#ced3db]">{form.technologies_used || "React, Node.js, TypeScript"}</p>
              </div>
            </div>
          </div>

          {/* Lado direito */}
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 pt-5 lg:pt-0 lg:pl-6 flex flex-col gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-800 mb-2">Redes Sociais</h3>

              {/* Instagram */}
              <EditableLink
                icon={FaInstagram}
                label="Instagram"
                href={normalizeInstagram(form.instagram)}
                rawValue={form.instagram}
                isEditing={isEditing}
                onChange={onChange("instagram")}
              />
              {/* WhatsApp */}
              <EditableLink
                icon={FaWhatsapp}
                label="WhatsApp"
                href={normalizeWhatsapp(form.whatsapp)}
                rawValue={form.whatsapp}
                isEditing={isEditing}
                onChange={onChange("whatsapp")}
              />
              {/* LinkedIn */}
              <EditableLink
                icon={FaLinkedin}
                label="LinkedIn"
                href={normalizeLinkedin(form.linkedin)}
                rawValue={form.linkedin}
                isEditing={isEditing}
                onChange={onChange("linkedin")}
              />
              {/* Email */}
              <EditableLink
                icon={FaEnvelope}
                label="E-mail"
                href={normalizeEmail(form.email)}
                rawValue={form.email}
                isEditing={isEditing}
                onChange={onChange("email")}
              />
              {/* Site */}
              <EditableLink
                icon={FaRegImage /* apenas para manter um ícone no layout */}
                label="Site"
                href={normalizeHttp(form.website)}
                rawValue={form.website}
                isEditing={isEditing}
                onChange={onChange("website")}
              />
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-800 mb-2">Localização</h3>

              {isEditing ? (
                <div className="space-y-2">
                  <input
                    value={form.address}
                    onChange={onChange("address")}
                    placeholder="Endereço (opcional)"
                    className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      value={String(form.latitude ?? "")}
                      onChange={onChange("latitude")}
                      placeholder="Latitude"
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm"
                    />
                    <input
                      value={String(form.longitude ?? "")}
                      onChange={onChange("longitude")}
                      placeholder="Longitude"
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                  <input
                    value={form.maps_url}
                    onChange={onChange("maps_url")}
                    placeholder="URL do Google Maps (opcional)"
                    className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm"
                  />
                </div>
              ) : (
                <a
                  href={
                    normalizeMaps({
                      lat: form.latitude as any,
                      lng: form.longitude as any,
                      address: form.address,
                      mapsUrl: form.maps_url,
                    }) || undefined
                  }
                  target={
                    normalizeMaps({
                      lat: form.latitude as any,
                      lng: form.longitude as any,
                      address: form.address,
                      mapsUrl: form.maps_url,
                    })
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    normalizeMaps({
                      lat: form.latitude as any,
                      lng: form.longitude as any,
                      address: form.address,
                      mapsUrl: form.maps_url,
                    })
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className={`w-full h-36 sm:h-40 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-sm hover:shadow-md transition ${
                    normalizeMaps({
                      lat: form.latitude as any,
                      lng: form.longitude as any,
                      address: form.address,
                      mapsUrl: form.maps_url,
                    })
                      ? "cursor-pointer"
                      : "cursor-default opacity-70"
                  }`}
                  title={
                    normalizeMaps({
                      lat: form.latitude as any,
                      lng: form.longitude as any,
                      address: form.address,
                      mapsUrl: form.maps_url,
                    })
                      ? "Abrir no Google Maps"
                      : "Localização não informada"
                  }
                >
                  <FaMapMarkedAlt className="text-blue-700 dark:text-blue-800 text-3xl sm:text-4xl" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Subcomponents ----------------------------- */

function EditableText({
  label,
  value,
  onChange,
  isEditing,
}: {
  label: string;
  value: string;
  onChange: (e: any) => void;
  isEditing: boolean;
}) {
  return (
    <div className="mt-3">
      <p className="text-gray-600 dark:text-[#ced3db] text-sm sm:text-base">
        <strong>{label}:</strong>{" "}
        {isEditing ? (
          <textarea
            value={value}
            onChange={onChange}
            className="w-full mt-1 bg-transparent border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 text-sm"
          />
        ) : (
          value || "Não informado"
        )}
      </p>
    </div>
  );
}

function EditableBadge({
  label,
  value,
  onChange,
  isEditing,
}: {
  label: string;
  value: string;
  onChange: (e: any) => void;
  isEditing: boolean;
}) {
  return (
    <span className="bg-gray-100 dark:bg-gray-800 text-blue-900 dark:text-[#ced3db] px-4 py-2 rounded-md text-sm font-medium">
      {label}:{" "}
      {isEditing ? (
        <input value={value} onChange={onChange} className="bg-transparent border-b border-gray-300 dark:border-gray-700 focus:outline-none ml-1" />
      ) : (
        value || "Não informado"
      )}
    </span>
  );
}

function EditableLink({
  icon: Icon,
  label,
  href,
  rawValue,
  onChange,
  isEditing,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string | null;
  rawValue: string;
  onChange: (e: any) => void;
  isEditing: boolean;
}) {
  return (
    <div className="mb-2">
      {isEditing ? (
        <input
          value={rawValue}
          onChange={onChange}
          placeholder={label}
          className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm"
        />
      ) : (
        <a
          href={href || undefined}
          target={href ? "_blank" : undefined}
          rel={href ? "noopener noreferrer" : undefined}
          className={`bg-gray-100 dark:bg-gray-800 text-blue-900 dark:text-[#ced3db] px-4 py-2 rounded-md text-sm w-full flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition ${
            href ? "" : "opacity-50 pointer-events-none"
          }`}
          title={href ? label : `${label} não informado`}
        >
          <Icon />
          {href ? `${label}` : `${label} não informado`}
        </a>
      )}
    </div>
  );
}
