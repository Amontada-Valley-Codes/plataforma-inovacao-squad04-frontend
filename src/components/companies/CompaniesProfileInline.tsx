// src/components/companies/CompaniesProfileInline.tsx
"use client";

import {
  FaRegImage,
  FaInstagram,
  FaWhatsapp,
  FaLinkedin,
  FaMapMarkedAlt,
} from "react-icons/fa";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Companie } from "@/mocks/CompaniesData";
import { useSearchParams } from "next/navigation";
import { Challenge, challengesData } from "@/mocks/ChallengeData";

type Props = { data: Companie | null; editable?: boolean };
type MediaTarget = "logo" | "cover" | null;

export default function CompaniesProfileInline({ data, editable = false }: Props) {
  if (!data) return null;

  const [company, setCompany] = useState<Companie>(data);
  const [editInfo, setEditInfo] = useState(false);
  const [editMedia, setEditMedia] = useState(false);
  const [editSocial, setEditSocial] = useState(false);
  const [editLocation, setEditLocation] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<MediaTarget>(null);

  // fecha qualquer estado de edição se perder permissão
  useEffect(() => {
    if (!editable) {
      setEditInfo(false);
      setEditMedia(false);
      setEditSocial(false);
      setEditLocation(false);
    }
  }, [editable]);

  // mantém querystring (role, userId, etc.) nas chamadas PUT
  const searchParams = useSearchParams();
  const qs = searchParams?.toString();
  const suffix = qs ? `?${qs}` : "";

  async function savePatch(patch: Partial<Companie>) {
    if (!editable) {
      alert("Sem permissão para editar.");
      return;
    }
    const res = await fetch(`/api/company/${company.id}${suffix}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      alert(`Não foi possível salvar (HTTP ${res.status}).`);
      return;
    }
    const updated = (await res.json()) as Companie;
    setCompany(updated);
    alert("Salvo!");
  }

  // DESAFIOS: filtra de forma robusta por companyId
  const desafios: Challenge[] = challengesData.filter(
    (ch) => Number(ch.companyId) === Number(company.id)
  );

  return (
    <div className="flex items-center justify-center pt-2 lg:pt-4 pb-5 lg:pb-8">
      <div className="w-[80vw] rounded-2xl shadow-md overflow-hidden bg-white dark:bg-gray-900">
        {/* Header / Capa com overlay */}
        <div className="relative group">
          <div className="relative h-45 w-full bg-gray-200 dark:bg-gray-800">
            {company.cover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={company.cover}
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

          {/* Logo com overlay */}
          <div className="absolute left-12 -bottom-24">
            <div className="relative w-36 h-36 rounded-full bg-gray-100 dark:bg-gray-700 border-8 border-white dark:border-gray-900 shadow-md overflow-hidden group/logo">
              {company.logo ? (
                <Image
                  src={company.logo}
                  alt="logo"
                  width={144}
                  height={144}
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
            {/* ====== INFORMAÇÕES ====== */}
            <section id="info" className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-800">
                  {company.nome}
                </h2>
                {editable && (
                  <button
                    onClick={() => setEditInfo((v) => !v)}
                    className="px-3 py-1.5 rounded-xl border text-sm"
                  >
                    {editInfo ? "Cancelar" : "Editar"}
                  </button>
                )}
              </div>

              {!editInfo ? (
                <>
                  <p className="text-gray-600 dark:text-[#ced3db] mt-1">
                    {company.descricao}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <span className="bg-gray-100 dark:bg-gray-800 text-blue-900 dark:text-[#ced3db] px-4 py-1 rounded-md text-sm font-medium">
                      Gestor: {company.gestor}
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-800 text-blue-900 dark:text-[#ced3db] px-4 py-1 rounded-md text-sm font-medium">
                      Área de Atuação: {company.areaAtuacao}
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-800 text-blue-900 dark:text-[#ced3db] px-4 py-1 rounded-md text-sm font-medium">
                      CNPJ: {company.cnpj}
                    </span>
                  </div>
                </>
              ) : (
                <InfoForm
                  company={company}
                  onSave={async (form) => {
                    await savePatch(form);
                    setEditInfo(false);
                  }}
                  onCancel={() => setEditInfo(false)}
                />
              )}
            </section>

            {/* ====== DESAFIOS ====== */}
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
                      <li>📅 {desafio.Date}</li>
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Direita: Social + Location + Media */}
        <div className="w-full lg:w-96 px-4 pt-3 pb-6 bg-white dark:bg-gray-900">

            {/* ====== REDES ====== */}
           {/* ====== REDES ====== */}
<section id="social" className="space-y-3 mt-2">
  <div className="flex items-center justify-between">
    <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">
      Redes Sociais
    </h3>
    {editable && (
      <button
        onClick={() => setEditSocial((v) => !v)}
        className="px-3 py-1.5 rounded-xl border text-sm"
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
        await savePatch(form);
        setEditSocial(false);
      }}
      onCancel={() => setEditSocial(false)}
    />
  )}
</section>
            {/* ====== LOCALIZAÇÃO ====== */}
            <section id="location" className="space-y-3 mt-10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-800">
                  Localização Maps
                </h3>
                {editable && (
                  <button
                    onClick={() => setEditLocation((v) => !v)}
                    className="px-3 py-1.5 rounded-xl border text-sm"
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
                    await savePatch(form);
                    setEditLocation(false);
                  }}
                  onCancel={() => setEditLocation(false)}
                />
              )}
            </section>

            {/* ====== MÍDIA (logo/capa) — aparece após clicar no “+” ====== */}
            {editMedia && (
              <section id="media" className="space-y-3 mt-10">
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-800">
                  Mídia
                </h3>
                <MediaForm
                  company={company}
                  initialTarget={mediaTarget}
                  onSave={async (form) => {
                    await savePatch(form);
                    setEditMedia(false);
                    setMediaTarget(null);
                  }}
                  onCancel={() => {
                    setEditMedia(false);
                    setMediaTarget(null);
                  }}
                />
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
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
function Actions({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="flex gap-2">
      <button type="submit" className="px-4 py-2 rounded-xl bg-[#15358D] text-white">
        Salvar
      </button>
      <button type="button" onClick={onCancel} className="px-4 py-2 rounded-xl border">
        Cancelar
      </button>
    </div>
  );
}

function InfoForm({
  company,
  onSave,
  onCancel,
}: {
  company: Companie;
  onSave: (p: Partial<Companie>) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    nome: company.nome,
    gestor: company.gestor,
    cnpj: company.cnpj,
    email: company.email,
    setor: company.setor,
    areaAtuacao: company.areaAtuacao,
    descricao: company.descricao,
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
      className="grid md:grid-cols-2 gap-4 mt-3"
    >
      <Row label="Nome">
        <input
          className="rounded-xl border px-3 py-[10px]"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
        />
      </Row>
      <Row label="Gestor">
        <input
          className="rounded-xl border px-3 py-[10px]"
          value={form.gestor}
          onChange={(e) => setForm({ ...form, gestor: e.target.value })}
        />
      </Row>
      <Row label="CNPJ">
        <input
          className="rounded-xl border px-3 py-[10px]"
          value={form.cnpj}
          onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
        />
      </Row>
      <Row label="E-mail">
        <input
          className="rounded-xl border px-3 py-[10px]"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </Row>
      <Row label="Setor">
        <input
          className="rounded-xl border px-3 py-[10px]"
          value={form.setor}
          onChange={(e) => setForm({ ...form, setor: e.target.value })}
        />
      </Row>
      <Row label="Área de Atuação">
        <input
          className="rounded-xl border px-3 py-[10px]"
          value={form.areaAtuacao}
          onChange={(e) => setForm({ ...form, areaAtuacao: e.target.value })}
        />
      </Row>
      <div className="md:col-span-2">
        <Row label="Descrição">
          <textarea
            className="w-full rounded-xl border px-3 py={[10px]} min-h-28"
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          />
        </Row>
      </div>
      <div className="md:col-span-2">
        <Actions onCancel={onCancel} />
      </div>
    </form>
  );
}

function MediaForm({
  company,
  initialTarget = null,
  onSave,
  onCancel,
}: {
  company: Companie;
  initialTarget?: MediaTarget;
  onSave: (p: Partial<Companie>) => Promise<void>;
  onCancel: () => void;
}) {
  const [logo, setLogo] = useState(company.logo ?? "");
  const [cover, setCover] = useState(company.cover ?? "");
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
        onSave({ logo, cover });
      }}
      className="grid md:grid-cols-2 gap-4 mt-3"
    >
      <Row label="Logo (URL)">
        <input
          ref={logoRef}
          className="rounded-xl border px-3 py-[10px]"
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
          placeholder="https://..."
        />
      </Row>
      <Row label="Capa (URL)">
        <input
          ref={coverRef}
          className="rounded-xl border px-3 py-[10px]"
          value={cover}
          onChange={(e) => setCover(e.target.value)}
          placeholder="https://..."
        />
      </Row>
      <div className="md:col-span-2">
        <Actions onCancel={onCancel} />
      </div>
    </form>
  );
}

function SocialForm({
  company,
  onSave,
  onCancel,
}: {
  company: Companie;
  onSave: (p: Partial<Companie>) => Promise<void>;
  onCancel: () => void;
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
        <input
          className="rounded-xl border px-3 py-[10px]"
          value={form.instagram}
          onChange={(e) => setForm({ ...form, instagram: e.target.value })}
          placeholder="https://instagram.com/..."
        />
      </Row>
      <Row label="WhatsApp (link ou número)">
        <input
          className="rounded-xl border px-3 py-[10px]"
          value={form.whatsapp}
          onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
          placeholder="https://wa.me/..."
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
        <Actions onCancel={onCancel} />
      </div>
    </form>
  );
}

function LocationForm({
  company,
  onSave,
  onCancel,
}: {
  company: Companie;
  onSave: (p: Partial<Companie>) => Promise<void>;
  onCancel: () => void;
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
        <input
          className="rounded-xl border px-3 py-[10px]"
          value={locationUrl}
          onChange={(e) => setLocationUrl(e.target.value)}
          placeholder="https://maps.google.com/..."
        />
      </Row>
      <div className="md:col-span-2">
        <Actions onCancel={onCancel} />
      </div>
    </form>
  );
}
