// src/components/companies/CompaniesProfileInline.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { FaRegImage, FaMapMarkedAlt } from "react-icons/fa";
import type {
  ShowAllEnterpriseResponse,
  ShowOneEnterpriseResponse,
} from "@/api/payloads/enterprise.payload";
import { enterpriseService } from "@/api/services/enterprise.service";

type Enterprise = ShowAllEnterpriseResponse | ShowOneEnterpriseResponse;

type Props = { data: Enterprise | null; editable?: boolean };
type MediaTarget = "logo" | "cover" | null;

// helpers para campos que mudam de nome entre DTOs
function getEnterpriseId(e: Enterprise | null | undefined): string | undefined {
  if (!e) return undefined;
  return String(
    (e as any).id ??
    (e as any).enterpriseId ??
    (e as any).companyId ??
    (e as any).uuid ??
    ""
  );
}
function getCover(e: Enterprise | null | undefined): string | undefined {
  if (!e) return undefined;
  return (e as any).coverImage ?? (e as any).cover ?? undefined;
}
function getLogo(e: Enterprise | null | undefined): string | undefined {
  if (!e) return undefined;
  return (e as any).profileImage ?? (e as any).logo ?? undefined;
}

export default function CompaniesProfileInline({ data, editable = false }: Props) {
  const [company, setCompany] = useState<Enterprise | null>(data);
  const [editInfo, setEditInfo] = useState(false);
  const [editMedia, setEditMedia] = useState(false);
  const [editSocial, setEditSocial] = useState(false);
  const [editLocation, setEditLocation] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<MediaTarget>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!editable) {
      setEditInfo(false);
      setEditMedia(false);
      setEditSocial(false);
      setEditLocation(false);
    }
  }, [editable]);

  const enterpriseId = useMemo(() => getEnterpriseId(company), [company]);

  if (!company) return null;

  async function savePatchInfo(patch: Partial<Enterprise>) {
    if (!editable) {
      alert("Sem permissão para editar.");
      return;
    }
    if (!enterpriseId) {
      alert("ID da empresa não encontrado.");
      return;
    }
    setBusy(true);
    try {
      const payload = {
        sector: (patch as any).sector,
        description: (patch as any).description,
        address: (patch as any).address,
        email: (patch as any).email,
      };
      const updated = await enterpriseService.updateEnterprise(enterpriseId, payload);
      setCompany(updated);
      alert("Informações atualizadas.");
    } catch {
      alert("Falha ao salvar as informações.");
    } finally {
      setBusy(false);
    }
  }

  async function saveCoverFile(file: File) {
    setBusy(true);
    try {
      await enterpriseService.updateCoverImage(file);
      if (enterpriseId) {
        const fresh = await enterpriseService.showOneEnterprise(enterpriseId);
        setCompany(fresh);
      }
      alert("Capa atualizada.");
    } catch {
      alert("Falha ao atualizar a capa.");
    } finally {
      setBusy(false);
    }
  }

  async function saveProfileFile(file: File) {
    setBusy(true);
    try {
      await enterpriseService.updateProfileImage(file);
      if (enterpriseId) {
        const fresh = await enterpriseService.showOneEnterprise(enterpriseId);
        setCompany(fresh);
      }
      alert("Imagem de perfil atualizada.");
    } catch {
      alert("Falha ao atualizar a imagem de perfil.");
    } finally {
      setBusy(false);
    }
  }

  const desafios: Array<{
    ChallengeTitle: string;
    Author: string;
    Category: string;
    Status: string;
    Date?: string;
    companyId?: string | number;
  }> = [];

  return (
    <div className="flex items-center justify-center pt-2 lg:pt-4 pb-5 lg:pb-8">
      <div className="w-[80vw] rounded-2xl shadow-md overflow-hidden bg-white dark:bg-gray-900">
        {/* Header / Capa */}
        <div className="relative group">
          <div className="relative h-45 w-full bg-gray-200 dark:bg-gray-800">
            {getCover(company) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getCover(company)!}
                alt="capa"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            {editable && (
              <button
                type="button"
                onClick={() => {
                  setMediaTarget("cover");
                  setEditMedia(true);
                }}
                className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/35 transition"
                title="Alterar capa"
              >
                <span className="text-white text-4xl font-bold leading-none">+</span>
              </button>
            )}
          </div>

          {/* Logo */}
          <div className="absolute left-12 -bottom-24">
            <div className="relative w-36 h-36 rounded-full bg-gray-100 dark:bg-gray-700 border-8 border-white dark:border-gray-900 shadow-md overflow-hidden group/logo">
              {getLogo(company) ? (
                <Image
                  src={getLogo(company)!}
                  alt="logo"
                  width={144}
                  height={144}
                  unoptimized
                  className="object-cover w-36 h-36"
                />
              ) : (
                <div className="w-full h-full grid place-items-center">
                  <FaRegImage className="text-gray-500 dark:text-[#ced3db] text-5xl" />
                </div>
              )}
              {editable && (
                <button
                  type="button"
                  onClick={() => {
                    setMediaTarget("logo");
                    setEditMedia(true);
                  }}
                  className="absolute inset-0 hidden group-hover/logo:flex items-center justify-center bg-black/40 transition rounded-full"
                  title="Alterar logo"
                >
                  <span className="text-white text-4xl font-bold leading-none">+</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_24rem]">
          <span className="hidden lg:block absolute top-6 bottom-6 right-[24rem] w-px bg-gray-200 dark:bg-gray-800" />

          {/* Esquerda: Info + Desafios */}
          <div className="flex-1 px-12 mt-28 pb-8">
            {/* Informações */}
            <section id="info" className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-800">
                  {(company as any)?.name}
                </h2>
                {editable && (
                  <button
                    onClick={() => setEditInfo((v) => !v)}
                    className="px-3 py-1.5 rounded-xl border text-sm disabled:opacity-50"
                    disabled={busy}
                  >
                    {editInfo ? "Cancelar" : "Editar"}
                  </button>
                )}
              </div>

              {!editInfo ? (
                <>
                  <p className="text-gray-600 dark:text-[#ced3db] mt-1">
                    {(company as any)?.description}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <span className="bg-gray-100 dark:bg-gray-800 text-blue-900 dark:text-[#ced3db] px-4 py-1 rounded-md text-sm font-medium">
                      Área de Atuação: {(company as any)?.sector ?? "—"}
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-800 text-blue-900 dark:text-[#ced3db] px-4 py-1 rounded-md text-sm font-medium">
                      Endereço: {(company as any)?.address ?? "—"}
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-800 text-blue-900 dark:text-[#ced3db] px-4 py-1 rounded-md text-sm font-medium">
                      E-mail: {(company as any)?.email ?? "—"}
                    </span>
                  </div>
                </>
              ) : (
                <InfoForm
                  company={company}
                  onSave={async (form) => {
                    await savePatchInfo(form);
                    setEditInfo(false);
                  }}
                  onCancel={() => setEditInfo(false)}
                  busy={busy}
                />
              )}
            </section>

            {/* Desafios (placeholder) */}
            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-800 mt-10">
              Desafios
            </h3>
            <div className="grid md:grid-cols-3 gap-6 mt-4">
              {desafios.length === 0 ? (
                <div className="border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 shadow-sm">
                  <p className="text-gray-600 dark:text-[#ced3db] text-sm">
                    Nenhum desafio encontrado para esta empresa.
                  </p>
                </div>
              ) : (
                desafios.map((desafio) => (
                  <div
                    key={`${desafio.companyId}-${desafio.ChallengeTitle}`}
                    className="border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 relative shadow-sm hover:shadow-md transition"
                  >
                    <h4 className="font-semibold text-blue-900 dark:text-blue-800">
                      {desafio.ChallengeTitle}
                    </h4>
                    <p className="text-gray-600 dark:text-[#ced3db] text-sm">
                      {desafio.Author}
                    </p>
                    <ul className="mt-3 text-sm text-gray-700 dark:text-[#ced3db] space-y-1">
                      <li>🏷 {desafio.Category}</li>
                      <li>🟢 {desafio.Status}</li>
                      {desafio.Date && <li>📅 {desafio.Date}</li>}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Direita: Social + Location + Media */}
          <div className="w-full lg:w-96 px-4 pt-3 pb-6 bg-white dark:bg-gray-900">
            {/* Redes sociais (client-only) */}
            <section id="social" className="space-y-3 mt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">
                  Redes Sociais
                </h3>
                {editable && (
                  <button
                    onClick={() => setEditSocial((v) => !v)}
                    className="px-3 py-1.5 rounded-xl border text-sm disabled:opacity-50"
                    disabled={busy}
                  >
                    {editSocial ? "Cancelar" : "Editar"}
                  </button>
                )}
              </div>

              {!editSocial ? (
                <div className="flex flex-col gap-2 mt-3">
                  <a
                    href={(company as any)?.instagram ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center bg-[#F3F8FF] hover:bg-[#E6F0FF] text-blue-900 dark:text-white py-2 rounded-md text-sm font-medium transition"
                  >
                    Instagram
                  </a>
                  <a
                    href={(company as any)?.whatsapp ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center bg-[#F3F8FF] hover:bg-[#E6F0FF] text-blue-900 dark:text-white py-2 rounded-md text-sm font-medium transition"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={(company as any)?.linkedin ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center bg-[#F3F8FF] hover:bg-[#E6F0FF] text-blue-900 dark:text-white py-2 rounded-md text-sm font-medium transition"
                  >
                    LinkedIn
                  </a>
                </div>
              ) : (
                <SocialForm
                  company={company}
                  onSave={async (form) => {
                    setCompany((prev) => (prev ? ({ ...prev, ...form } as any) : prev));
                    setEditSocial(false);
                  }}
                  onCancel={() => setEditSocial(false)}
                  busy={busy}
                />
              )}
            </section>

            {/* Localização (client-only) */}
            <section id="location" className="space-y-3 mt-10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-800">
                  Localização Maps
                </h3>
                {editable && (
                  <button
                    onClick={() => setEditLocation((v) => !v)}
                    className="px-3 py-1.5 rounded-xl border text-sm disabled:opacity-50"
                    disabled={busy}
                  >
                    {editLocation ? "Cancelar" : "Editar"}
                  </button>
                )}
              </div>

              {!editLocation ? (
                <a
                  href={(company as any)?.locationUrl ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full h-40 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-sm hover:shadow-md transition"
                  title={(company as any)?.locationUrl ?? "—"}
                >
                  <FaMapMarkedAlt className="text-blue-700 dark:text-blue-300 text-4xl" />
                </a>
              ) : (
                <LocationForm
                  company={company}
                  onSave={async (form) => {
                    setCompany((prev) => (prev ? ({ ...prev, ...form } as any) : prev));
                    setEditLocation(false);
                  }}
                  onCancel={() => setEditLocation(false)}
                  busy={busy}
                />
              )}
            </section>

            {/* Mídia: upload real de arquivos */}
            {editMedia && (
              <section id="media" className="space-y-3 mt-10">
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-800">
                  Mídia
                </h3>
                <MediaForm
                  initialTarget={mediaTarget}
                  onSave={async ({ logoFile, coverFile }) => {
                    if (coverFile) await saveCoverFile(coverFile);
                    if (logoFile) await saveProfileFile(logoFile);
                    setEditMedia(false);
                    setMediaTarget(null);
                  }}
                  onCancel={() => {
                    setEditMedia(false);
                    setMediaTarget(null);
                  }}
                  busy={busy}
                />
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Forms

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
function Actions({ onCancel, busy }: { onCancel: () => void; busy?: boolean }) {
  return (
    <div className="flex gap-2">
      <button type="submit" disabled={busy} className="px-4 py-2 rounded-xl bg-[#15358D] text-white disabled:opacity-50">
        Salvar
      </button>
      <button type="button" onClick={onCancel} disabled={busy} className="px-4 py-2 rounded-xl border disabled:opacity-50">
        Cancelar
      </button>
    </div>
  );
}

function InfoForm({
  company,
  onSave,
  onCancel,
  busy,
}: {
  company: Enterprise;
  onSave: (p: Partial<Enterprise>) => Promise<void>;
  onCancel: () => void;
  busy?: boolean;
}) {
  const [form, setForm] = useState({
    sector: (company as any).sector ?? "",
    description: (company as any).description ?? "",
    address: (company as any).address ?? "",
    email: (company as any).email ?? "",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
      className="grid md:grid-cols-2 gap-4 mt-3"
    >
      <Row label="Área de Atuação">
        <input
          className="rounded-xl border px-3 py-[10px]"
          value={form.sector}
          onChange={(e) => setForm({ ...form, sector: e.target.value })}
        />
      </Row>
      <Row label="E-mail da Empresa">
        <input
          className="rounded-xl border px-3 py-[10px]"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </Row>
      <Row label="Endereço">
        <input
          className="rounded-xl border px-3 py-[10px]"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
      </Row>
      <div className="md:col-span-2">
        <Row label="Descrição">
          <textarea
            className="w-full rounded-xl border px-3 py-[10px] min-h-28"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Row>
      </div>
      <div className="md:col-span-2">
        <Actions onCancel={onCancel} busy={busy} />
      </div>
    </form>
  );
}

function MediaForm({
  initialTarget = null,
  onSave,
  onCancel,
  busy,
}: {
  initialTarget?: MediaTarget;
  onSave: (p: { logoFile?: File; coverFile?: File }) => Promise<void>;
  onCancel: () => void;
  busy?: boolean;
}) {
  const [logoFile, setLogoFile] = useState<File | undefined>(undefined);
  const [coverFile, setCoverFile] = useState<File | undefined>(undefined);
  const logoRef = useRef<HTMLInputElement | null>(null);
  const coverRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (initialTarget === "logo") logoRef.current?.focus();
    if (initialTarget === "cover") coverRef.current?.focus();
  }, [initialTarget]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ logoFile, coverFile });
      }}
      className="grid md:grid-cols-2 gap-4 mt-3"
    >
      <Row label="Logo (arquivo)">
        <input
          ref={logoRef}
          type="file"
          accept="image/*"
          className="rounded-xl border px-3 py-[10px]"
          onChange={(e) => setLogoFile(e.target.files?.[0])}
        />
      </Row>
      <Row label="Capa (arquivo)">
        <input
          ref={coverRef}
          type="file"
          accept="image/*"
          className="rounded-xl border px-3 py-[10px]"
          onChange={(e) => setCoverFile(e.target.files?.[0])}
        />
      </Row>
      <div className="md:col-span-2">
        <Actions onCancel={onCancel} busy={busy} />
      </div>
    </form>
  );
}

function SocialForm({
  company,
  onSave,
  onCancel,
  busy,
}: {
  company: Enterprise;
  onSave: (p: Partial<Enterprise>) => Promise<void>;
  onCancel: () => void;
  busy?: boolean;
}) {
  const [form, setForm] = useState({
    instagram: ((company as any).instagram as string) ?? "",
    whatsapp: ((company as any).whatsapp as string) ?? "",
    linkedin: ((company as any).linkedin as string) ?? "",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form as any);
      }}
      className="grid md:grid-cols-3 gap-4 mt-3"
    >
      <Row label="Instagram (URL)">
        <input
          className="rounded-xl border px-3 py-[10px]"
          value={form.instagram}
          onChange={(e) => setForm({ ...form, instagram: e.target.value })}
          placeholder="https://instagram.com/..."
        />
      </Row>
      <Row label="WhatsApp (URL ou número)">
        <input
          className="rounded-xl border px-3 py-[10px]"
          value={form.whatsapp}
          onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
          placeholder="https://wa.me/55..."
        />
      </Row>
      <Row label="LinkedIn (URL)">
        <input
          className="rounded-xl border px-3 py-[10px]"
          value={form.linkedin}
          onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
          placeholder="https://linkedin.com/company/..."
        />
      </Row>
      <div className="md:col-span-3">
        <Actions onCancel={onCancel} busy={busy} />
      </div>
    </form>
  );
}

function LocationForm({
  company,
  onSave,
  onCancel,
  busy,
}: {
  company: Enterprise;
  onSave: (p: Partial<Enterprise>) => Promise<void>;
  onCancel: () => void;
  busy?: boolean;
}) {
  const [locationUrl, setLocationUrl] = useState(((company as any).locationUrl as string) ?? "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ locationUrl } as any);
      }}
      className="grid md:grid-cols-2 gap-4 mt-3"
    >
      <Row label="URL do Google Maps">
        <input
          className="rounded-xl border px-3 py-[10px]"
          value={locationUrl}
          onChange={(e) => setLocationUrl(e.target.value)}
          placeholder="https://maps.google.com/?q=..."
        />
      </Row>
      <div className="md:col-span-2">
        <Actions onCancel={onCancel} busy={busy} />
      </div>
    </form>
  );
}
