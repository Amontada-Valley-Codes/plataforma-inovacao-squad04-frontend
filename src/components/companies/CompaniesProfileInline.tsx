"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { FaRegImage, FaMapMarkedAlt } from "react-icons/fa";
import type { ShowOneEnterpriseResponse } from "@/api/payloads/enterprise.payload";
import { enterpriseService } from "@/api/services/enterprise.service";

type Props = {
  data: ShowOneEnterpriseResponse | null; 
  editable?: boolean;
};
type MediaTarget = "logo" | "cover" | null;

function getId(e: ShowOneEnterpriseResponse | null | undefined): string | undefined {
  return e?.id ? String(e.id) : undefined;
}
function getCover(e: ShowOneEnterpriseResponse | null | undefined): string | undefined {
  return e?.cover ?? undefined;
}
function getLogo(e: ShowOneEnterpriseResponse | null | undefined): string | undefined {
  return e?.logo ?? undefined;
}

export default function CompaniesProfileInline({ data, editable = false }: Props) {
  const [company, setCompany] = useState<ShowOneEnterpriseResponse | null>(data);
  const [editInfo, setEditInfo] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [editMedia, setEditMedia] = useState(false);
  const [editSocial, setEditSocial] = useState(false);
  const [editLocation, setEditLocation] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mediaTarget, setMediaTarget] = useState<MediaTarget>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setCompany(data);
    if (!editable) {
      setEditInfo(false);
      setEditMedia(false);
      setEditSocial(false);
      setEditLocation(false);
    }
  }, [data, editable]);

  const enterpriseId = useMemo(() => getId(company), [company]);
  if (!company) return null;

  async function savePatchInfo(patch: {
    sector?: string;
    description?: string;
    address?: string;
    email?: string;
  }) {
    if (!editable) return alert("Sem permissão para editar.");
    if (!enterpriseId) return alert("ID da empresa não encontrado.");

    setBusy(true);
    try {
      const updated = await enterpriseService.updateEnterprise(enterpriseId, patch);
      setCompany(updated); // backend retorna detalhe
      alert("Informações atualizadas.");
    } catch {
      alert("Falha ao salvar as informações.");
    } finally {
      setBusy(false);
    }
  }

  // Placeholder (preencha com dados reais quando houver endpoint)
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
{/*             {editable && (
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
            )} */}
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
                  {company.name}
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
                    {company.description}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <span className="bg-gray-100 dark:bg-gray-800 text-blue-900 dark:text-[#ced3db] px-4 py-1 rounded-md text-sm font-medium">
                      Área de Atuação: {company.sector ?? "—"}
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-800 text-blue-900 dark:text-[#ced3db] px-4 py-1 rounded-md text-sm font-medium">
                      Endereço: {company.address ?? "—"}
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-800 text-blue-900 dark:text-[#ced3db] px-4 py-1 rounded-md text-sm font-medium">
                      E-mail: {company.email ?? "—"}
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
                desafios.map((d) => (
                  <div
                    key={`${d.companyId}-${d.ChallengeTitle}`}
                    className="border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 relative shadow-sm hover:shadow-md transition"
                  >
                    <h4 className="font-semibold text-blue-900 dark:text-blue-800">
                      {d.ChallengeTitle}
                    </h4>
                    <p className="text-gray-600 dark:text-[#ced3db] text-sm">{d.Author}</p>
                    <ul className="mt-3 text-sm text-gray-700 dark:text-[#ced3db] space-y-1">
                      <li>🏷 {d.Category}</li>
                      <li>🟢 {d.Status}</li>
                      {d.Date && <li>📅 {d.Date}</li>}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Direita: Social + Location + Media */}
          <div className="w-full lg:w-96 px-4 pt-3 pb-6 bg-white dark:bg-gray-900">
            {/* Redes sociais */}
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
                    href={company.instagram ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center bg-[#F3F8FF] hover:bg-[#E6F0FF] text-blue-900 dark:text-white py-2 rounded-md text-sm font-medium transition"
                  >
                    Instagram
                  </a>
                  <a
                    href={company.whatsapp ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center bg-[#F3F8FF] hover:bg-[#E6F0FF] text-blue-900 dark:text-white py-2 rounded-md text-sm font-medium transition"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={company.linkedin ?? "#"}
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
                    setCompany((prev) => (prev ? { ...prev, ...form } : prev));
                    setEditSocial(false);
                  }}
                  onCancel={() => setEditSocial(false)}
                  busy={busy}
                />
              )}
            </section>

            {/* Localização */}
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
                  href={company.locationUrl ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full h-40 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-sm hover:shadow-md transition"
                  title={company.locationUrl ?? "—"}
                >
                  <FaMapMarkedAlt className="text-blue-700 dark:text-blue-300 text-4xl" />
                </a>
              ) : (
                <LocationForm
                  company={company}
                  onSave={async (form) => {
                    setCompany((prev) => (prev ? { ...prev, ...form } : prev));
                    setEditLocation(false);
                  }}
                  onCancel={() => setEditLocation(false)}
                  busy={busy}
                />
              )}
            </section>

            {/* Mídia: upload de arquivos */}
            {/* {editMedia && (
              <section id="media" className="space-y-3 mt-10">
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-800">Mídia</h3>
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
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Forms ===== */

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
  company: ShowOneEnterpriseResponse;
  onSave: (p: { sector?: string; description?: string; address?: string; email?: string }) => Promise<void>;
  onCancel: () => void;
  busy?: boolean;
}) {
  const [form, setForm] = useState({
    sector: company.sector ?? "",
    description: company.description ?? "",
    address: company.address ?? "",
    email: company.email ?? "",
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

function SocialForm({
  company,
  onSave,
  onCancel,
  busy,
}: {
  company: ShowOneEnterpriseResponse;
  onSave: (p: Partial<ShowOneEnterpriseResponse>) => Promise<void>;
  onCancel: () => void;
  busy?: boolean;
}) {
  const [form, setForm] = useState({
    instagram: company.instagram ?? "",
    whatsapp: company.whatsapp ?? "",
    linkedin: company.linkedin ?? "",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
      className="grid md:grid-cols-3 gap-4 mt-3"
    >
      <Row label="Instagram (URL)">
        <input className="rounded-xl border px-3 py-[10px]" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} placeholder="https://instagram.com/..." />
      </Row>
      <Row label="WhatsApp (URL ou número)">
        <input className="rounded-xl border px-3 py-[10px]" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="https://wa.me/55..." />
      </Row>
      <Row label="LinkedIn (URL)">
        <input className="rounded-xl border px-3 py-[10px]" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} placeholder="https://linkedin.com/company/..." />
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
  company: ShowOneEnterpriseResponse;
  onSave: (p: Partial<ShowOneEnterpriseResponse>) => Promise<void>;
  onCancel: () => void;
  busy?: boolean;
}) {
  const [locationUrl, setLocationUrl] = useState(company.locationUrl ?? "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ locationUrl });
      }}
      className="grid md:grid-cols-2 gap-4 mt-3"
    >
      <Row label="URL do Google Maps">
        <input className="rounded-xl border px-3 py-[10px]" value={locationUrl} onChange={(e) => setLocationUrl(e.target.value)} placeholder="https://maps.google.com/?q=..." />
      </Row>
      <div className="md:col-span-2">
        <Actions onCancel={onCancel} busy={busy} />
      </div>
    </form>
  );
}
