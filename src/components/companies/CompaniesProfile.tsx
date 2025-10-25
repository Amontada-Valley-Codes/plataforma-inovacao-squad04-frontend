// src/components/companies/CompaniesProfile.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { FaRegImage, FaMapMarkedAlt } from "react-icons/fa";

import { Modal } from "../ui/modal";

import type {
  ShowAllEnterpriseResponse,
  ShowOneEnterpriseResponse,
} from "@/api/payloads/enterprise.payload";
import { enterpriseService } from "@/api/services/enterprise.service";

type Enterprise = ShowAllEnterpriseResponse | ShowOneEnterpriseResponse;

function getId(e: Enterprise) {
  return String(
    (e as any).id ??
      (e as any).enterpriseId ??
      (e as any).companyId ??
      (e as any).uuid ??
      ""
  );
}
function getCover(e: Enterprise): string | undefined {
  return (e as any).coverImage ?? (e as any).cover ?? undefined;
}
function getLogo(e: Enterprise): string | undefined {
  return (e as any).profileImage ?? (e as any).logo ?? undefined;
}

type Props = {
  data: Enterprise | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function CompaniesProfile({ data, isOpen, onClose }: Props) {
  const [company, setCompany] = useState<Enterprise | null>(data);
  const [editInfo, setEditInfo] = useState(false);
  const [editSocial, setEditSocial] = useState(false);
  const [editLocation, setEditLocation] = useState(false);
  const [editMedia, setEditMedia] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setCompany(data);
    setEditInfo(false);
    setEditSocial(false);
    setEditLocation(false);
    setEditMedia(false);
  }, [data, isOpen]);

  const enterpriseId = useMemo(() => (company ? getId(company) : undefined), [company]);

  async function savePatchInfo(patch: {
    sector?: string;
    description?: string;
    address?: string;
    email?: string;
  }) {
    if (!enterpriseId) return;
    setBusy(true);
    try {
      const updated = await enterpriseService.updateEnterprise(enterpriseId, patch);
      setCompany(updated);
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

  if (!company) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg w-full max-w-full sm:max-w-md md:max-w-5xl relative overflow-hidden max-h-[95vh] flex flex-col">
        <div className="overflow-y-auto max-h-[95vh] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* Banner */}
          <div className="relative h-48 sm:h-56 md:h-64 w-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
            {getCover(company) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getCover(company)!}
                alt="Capa da empresa"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <FaRegImage className="text-gray-500 dark:text-[#ced3db] text-4xl sm:text-5xl" />
            )}

            {/* Fechar */}
            <button
              onClick={onClose}
              className="absolute right-4 sm:right-8 top-4 sm:top-6 w-10 sm:w-12 h-10 sm:h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center shadow-md hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              <X className="text-gray-400 hover:text-gray-600 transition duration-300" size={20} />
            </button>

            {/* Logo */}
            <div className="absolute left-10 bottom-[-4rem] sm:bottom-[-5rem]">
              <div className="w-28 sm:w-36 h-28 sm:h-36 rounded-full bg-gray-100 dark:bg-gray-700 border-4 sm:border-8 border-white dark:border-gray-900 flex items-center justify-center shadow-md overflow-hidden">
                {getLogo(company) ? (
                  <Image
                    src={getLogo(company)!}
                    alt="Logo da empresa"
                    width={144}
                    height={144}
                    unoptimized
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <FaRegImage className="text-gray-500 dark:text-[#ced3db] text-4xl sm:text-5xl" />
                )}
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="flex flex-col lg:flex-row mt-20 sm:mt-24 px-5 sm:px-8 pb-8 gap-8">
            {/* Esquerda */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-800">
                  {(company as any)?.name ?? "Nome da Empresa"}
                </h2>
                <button
                  onClick={() => setEditMedia((v) => !v)}
                  className="px-3 py-1.5 rounded-xl border text-sm"
                  disabled={busy}
                >
                  {editMedia ? "Cancelar mídia" : "Editar mídia"}
                </button>
              </div>

              {!editMedia ? null : (
                <MediaForm
                  onSave={async ({ logoFile, coverFile }) => {
                    if (coverFile) await saveCoverFile(coverFile);
                    if (logoFile) await saveProfileFile(logoFile);
                    setEditMedia(false);
                  }}
                  onCancel={() => setEditMedia(false)}
                  busy={busy}
                />
              )}

              {/* Info */}
              <section className="space-y-3 mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-800">
                    Informações
                  </h3>
                  <button
                    onClick={() => setEditInfo((v) => !v)}
                    className="px-3 py-1.5 rounded-xl border text-sm"
                    disabled={busy}
                  >
                    {editInfo ? "Cancelar" : "Editar"}
                  </button>
                </div>

                {!editInfo ? (
                  <>
                    <p className="text-gray-600 dark:text-[#ced3db] mt-1">
                      {(company as any)?.description ?? "—"}
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
              <h3 className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-800 mt-8 sm:mt-10">
                Desafios da Empresa
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {desafios.length > 0 ? (
                  desafios.map((d) => (
                    <div key={`${d.companyId}-${d.ChallengeTitle}`} className="border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-[#ced3db]">{d.Author}</p>
                        <h2 className="text-lg font-bold text-blue-900 dark:text-blue-800">{d.ChallengeTitle}</h2>
                        <p className="text-blue-900 dark:text-[#ced3db] font-medium">{d.Category}</p>
                        <p className="text-sm text-gray-600 dark:text-[#ced3db] mt-1">
                          Status: <span className="text-green-500 font-medium">{d.Status}</span>
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-[#ced3db] text-sm mt-2">
                    Nenhum desafio disponível.
                  </p>
                )}
              </div>
            </div>

            {/* Direita */}
            <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 pt-5 lg:pt-0 lg:pl-6 flex flex-col gap-4">
              {/* Redes Sociais (client-only) */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-800">
                    Redes Sociais
                  </h3>
                  <button
                    onClick={() => setEditSocial((v) => !v)}
                    className="px-3 py-1.5 rounded-xl border text-sm"
                    disabled={busy}
                  >
                    {editSocial ? "Cancelar" : "Editar"}
                  </button>
                </div>

                {!editSocial ? (
                  <div className="flex flex-col gap-2">
                    <a
                      href={(company as any)?.instagram ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-blue-900 dark:text-[#ced3db] px-4 py-2 rounded-md text-sm font-medium text-center transition"
                    >
                      Instagram
                    </a>
                    <a
                      href={(company as any)?.whatsapp ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-blue-900 dark:text-[#ced3db] px-4 py-2 rounded-md text-sm font-medium text-center transition"
                    >
                      WhatsApp
                    </a>
                    <a
                      href={(company as any)?.linkedin ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-blue-900 dark:text-[#ced3db] px-4 py-2 rounded-md text-sm font-medium text-center transition"
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
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-800">
                    Localização Maps
                  </h3>
                  <button
                    onClick={() => setEditLocation((v) => !v)}
                    className="px-3 py-1.5 rounded-xl border text-sm"
                    disabled={busy}
                  >
                    {editLocation ? "Cancelar" : "Editar"}
                  </button>
                </div>

                {!editLocation ? (
                  <a
                    href={(company as any)?.locationUrl ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-36 sm:h-40 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-sm hover:shadow-md transition"
                    title={(company as any)?.locationUrl ?? "—"}
                  >
                    <FaMapMarkedAlt className="text-blue-700 dark:text-blue-800 text-3xl sm:text-4xl" />
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
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* =================== FORMS =================== */

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
  onSave: (p: { sector?: string; description?: string; address?: string; email?: string }) => Promise<void>;
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
        <input className="rounded-xl border px-3 py-[10px]" value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })} />
      </Row>
      <Row label="E-mail da Empresa">
        <input className="rounded-xl border px-3 py-[10px]" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </Row>
      <Row label="Endereço">
        <input className="rounded-xl border px-3 py-[10px]" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      </Row>
      <div className="md:col-span-2">
        <Row label="Descrição">
          <textarea className="w-full rounded-xl border px-3 py-[10px] min-h-28" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Row>
      </div>
      <div className="md:col-span-2">
        <Actions onCancel={onCancel} busy={busy} />
      </div>
    </form>
  );
}

function MediaForm({
  onSave,
  onCancel,
  busy,
}: {
  onSave: (p: { logoFile?: File; coverFile?: File }) => Promise<void>;
  onCancel: () => void;
  busy?: boolean;
}) {
  const [logoFile, setLogoFile] = useState<File | undefined>();
  const [coverFile, setCoverFile] = useState<File | undefined>();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ logoFile, coverFile });
      }}
      className="grid md:grid-cols-2 gap-4 mt-3"
    >
      <Row label="Logo (arquivo)">
        <input type="file" accept="image/*" className="rounded-xl border px-3 py-[10px]" onChange={(e) => setLogoFile(e.target.files?.[0])} />
      </Row>
      <Row label="Capa (arquivo)">
        <input type="file" accept="image/*" className="rounded-xl border px-3 py-[10px]" onChange={(e) => setCoverFile(e.target.files?.[0])} />
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
    instagram: (company as any).instagram ?? "",
    whatsapp: (company as any).whatsapp ?? "",
    linkedin: (company as any).linkedin ?? "",
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
        <input className="rounded-xl border px-3 py-[10px]" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
      </Row>
      <Row label="WhatsApp (URL ou número)">
        <input className="rounded-xl border px-3 py-[10px]" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
      </Row>
      <Row label="LinkedIn (URL)">
        <input className="rounded-xl border px-3 py-[10px]" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
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
  const [locationUrl, setLocationUrl] = useState((company as any).locationUrl ?? "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ locationUrl } as any);
      }}
      className="grid md:grid-cols-2 gap-4 mt-3"
    >
      <Row label="URL do Google Maps">
        <input className="rounded-xl border px-3 py-[10px]" value={locationUrl} onChange={(e) => setLocationUrl(e.target.value)} />
      </Row>
      <div className="md:col-span-2">
        <Actions onCancel={onCancel} busy={busy} />
      </div>
    </form>
  );
}
