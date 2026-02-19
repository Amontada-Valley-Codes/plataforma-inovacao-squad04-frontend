"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Hash,
  Briefcase,
  Pencil,
  Camera,
  Check,
  X,
  Loader2,
  AlertCircle,
  RefreshCw,
  Info,
  Shield,
} from "lucide-react";
import { enterpriseService } from "@/api/services/enterprise.service";
import { ShowOneEnterpriseResponse } from "@/api/payloads/enterprise.payload";
import toast, { Toaster } from "react-hot-toast";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface EditableFields {
  sector: string;
  description: string;
  address: string;
  email: string;
  gestorEmail: string;
  numeroGestor: string;
}

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const PRIMARY = "#15358c";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function formatCnpj(raw: string) {
  return raw.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5"
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR");
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function SectionTitle({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <div
        className="p-1.5 rounded-md"
        style={{ backgroundColor: `${PRIMARY}18` }}
      >
        <Icon size={16} style={{ color: PRIMARY }} />
      </div>
      <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {title}
      </h2>
      <div className="flex-1 h-px bg-gray-100 dark:bg-gray-700 ml-1" />
    </div>
  );
}

function FieldRow({
  icon: Icon,
  label,
  value,
  editKey,
  isEditing,
  editedData,
  onChange,
  readOnly,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  editKey?: keyof EditableFields;
  isEditing: boolean;
  editedData: EditableFields;
  onChange: (key: keyof EditableFields, val: string) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60">
      <div className="shrink-0 mt-0.5">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${PRIMARY}15` }}
        >
          <Icon size={15} style={{ color: PRIMARY }} />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-1">
          {label}
        </p>
        {isEditing && editKey && !readOnly ? (
          <input
            type="text"
            value={editedData[editKey]}
            onChange={(e) => onChange(editKey, e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md
              focus:outline-none focus:ring-2 focus:ring-blue-500/30
              text-gray-800 dark:text-gray-100
              bg-white dark:bg-gray-700
              text-sm transition"
          />
        ) : (
          <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
            {value || (
              <span className="text-gray-400 dark:text-gray-500 font-normal">
                —
              </span>
            )}
          </p>
        )}
      </div>

      {readOnly && (
        <span className="shrink-0 mt-1 text-[10px] font-medium text-gray-400 dark:text-gray-600 bg-gray-200/60 dark:bg-gray-700 px-1.5 py-0.5 rounded">
          fixo
        </span>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isApproved = status === "APPROVED";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
        isApproved
          ? "bg-green-400/20 text-green-200"
          : "bg-yellow-400/20 text-yellow-200"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isApproved ? "bg-green-400" : "bg-yellow-400"
        }`}
      />
      {isApproved ? "Aprovada" : status}
    </span>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

export default function CompanyProfile() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enterprise, setEnterprise] =
    useState<ShowOneEnterpriseResponse | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedData, setEditedData] = useState<EditableFields>({
    sector: "",
    description: "",
    address: "",
    email: "",
    gestorEmail: "",
    numeroGestor: "",
  });
  const profileInputRef = useRef<HTMLInputElement>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [uploadingProfile, setUploadingProfile] = useState(false);

  // ── Data fetching ──────────────────────────

  const fetchEnterprise = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await enterpriseService.getMyEnterprise();
      if (!data) {
        setError("Nenhuma empresa vinculada a este usuário.");
        return;
      }
      setEnterprise(data);
      setProfilePreview(data.profileImage?.url ?? data.logo ?? null);
      setEditedData({
        sector: data.sector ?? "",
        description: data.description ?? "",
        address: data.address ?? "",
        email: data.email ?? "",
        gestorEmail: data.gestorEmail ?? "",
        numeroGestor: data.numeroGestor ?? "",
      });
    } catch {
      setError("Erro ao carregar dados da empresa.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnterprise();
  }, []);

  // ── Edit handlers ──────────────────────────

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    if (!enterprise) return;
    setEditedData({
      sector: enterprise.sector ?? "",
      description: enterprise.description ?? "",
      address: enterprise.address ?? "",
      email: enterprise.email ?? "",
      gestorEmail: enterprise.gestorEmail ?? "",
      numeroGestor: enterprise.numeroGestor ?? "",
    });
    setProfilePreview(enterprise.profileImage?.url ?? enterprise.logo ?? null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!enterprise) return;
    setSaving(true);
    try {
      const updated = await enterpriseService.updateEnterprise(enterprise.id, {
        sector: editedData.sector,
        description: editedData.description,
        address: editedData.address,
        email: editedData.email,
      });
      setEnterprise({
        ...updated,
        gestorEmail: editedData.gestorEmail,
        numeroGestor: editedData.numeroGestor,
      });
      setIsEditing(false);
      toast.success("Dados salvos com sucesso!");
    } catch {
      toast.error("Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (key: keyof EditableFields, val: string) => {
    setEditedData((prev) => ({ ...prev, [key]: val }));
  };

  const handleProfileImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setProfilePreview(reader.result as string);
    reader.readAsDataURL(file);

    setUploadingProfile(true);
    try {
      await enterpriseService.updateProfileImage(file);
      toast.success("Foto de perfil atualizada!");
    } catch {
      toast.error("Erro ao atualizar foto de perfil.");
      setProfilePreview(
        enterprise?.profileImage?.url ?? enterprise?.logo ?? null
      );
    } finally {
      setUploadingProfile(false);
    }
  };

  // ── Loading ────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground dark:text-gray-400">
            Carregando
          </p>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────

  if (error || !enterprise) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle size={36} className="text-red-400" />
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {error ?? "Empresa não encontrada."}
        </p>
        <button
          onClick={fetchEnterprise}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm"
          style={{ background: PRIMARY }}
        >
          <RefreshCw size={15} />
          Tentar novamente
        </button>
      </div>
    );
  }

  // ── Main render ────────────────────────────

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Toaster position="top-right" />

      {/* ── Header ─────────────────────────────── */}
      <div
        className="rounded-t-2xl p-8 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY}cc 100%)`,
        }}
      >
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute -left-8 -bottom-8 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute right-32 bottom-0 w-24 h-24 rounded-full bg-white/5" />
        </div>

        <div className="relative flex items-center justify-between flex-wrap gap-6">
          {/* Avatar + name */}
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl shadow-xl flex items-center justify-center overflow-hidden">
                {uploadingProfile ? (
                  <Loader2 size={28} className="animate-spin text-white" />
                ) : profilePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profilePreview}
                    alt="Logo da empresa"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 size={36} className="text-white/80" />
                )}
              </div>

              {isEditing && (
                <label
                  className="absolute -bottom-2 -right-2 p-1.5 bg-white rounded-full shadow-lg cursor-pointer hover:shadow-xl transition-all hover:scale-110"
                  style={{ color: PRIMARY }}
                  title="Trocar foto de perfil"
                >
                  <Camera size={14} />
                  <input
                    ref={profileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white leading-tight">
                {enterprise.name}
              </h1>
              {enterprise.sector && (
                <p className="text-white/70 text-sm mt-0.5">
                  {enterprise.sector}
                </p>
              )}
              <div className="mt-2">
                <StatusBadge status={enterprise.status} />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 text-white rounded-xl transition-all text-sm font-medium"
              >
                <Pencil size={15} />
                Editar perfil
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl transition-all text-sm font-medium disabled:opacity-50"
                >
                  <X size={15} />
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded-xl transition-all text-sm font-medium shadow-lg disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Check size={15} />
                  )}
                  {saving ? "Salvando…" : "Salvar alterações"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Body ───────────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 rounded-b-2xl shadow-xl border border-t-0 border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">

        {/* Sobre a empresa */}
        <div className="p-8">
          <SectionTitle icon={Info} title="Sobre a empresa" />
          {isEditing ? (
            <textarea
              value={editedData.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              placeholder="Descreva a empresa..."
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl
                focus:outline-none focus:ring-2 focus:ring-blue-500/30
                text-gray-700 dark:text-gray-200
                bg-white dark:bg-gray-800
                text-sm leading-relaxed resize-none transition"
              rows={4}
            />
          ) : (
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
              {enterprise.description || (
                <span className="italic text-gray-400 dark:text-gray-600">
                  Nenhuma descrição cadastrada.
                </span>
              )}
            </p>
          )}
        </div>

        {/* Dados da empresa */}
        <div className="p-8">
          <SectionTitle icon={Building2} title="Dados da empresa" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FieldRow
              icon={Building2}
              label="Razão Social"
              value={enterprise.name}
              isEditing={isEditing}
              editedData={editedData}
              onChange={handleFieldChange}
              readOnly
            />
            <FieldRow
              icon={Hash}
              label="Código"
              value={enterprise.companyCode ?? enterprise.id}
              isEditing={isEditing}
              editedData={editedData}
              onChange={handleFieldChange}
              readOnly
            />
            <FieldRow
              icon={FileText}
              label="CNPJ"
              value={formatCnpj(enterprise.cnpj)}
              isEditing={isEditing}
              editedData={editedData}
              onChange={handleFieldChange}
              readOnly
            />
            <FieldRow
              icon={Briefcase}
              label="Setor"
              value={enterprise.sector}
              editKey="sector"
              isEditing={isEditing}
              editedData={editedData}
              onChange={handleFieldChange}
            />
            <FieldRow
              icon={MapPin}
              label="Endereço"
              value={enterprise.address}
              editKey="address"
              isEditing={isEditing}
              editedData={editedData}
              onChange={handleFieldChange}
            />
            <FieldRow
              icon={Mail}
              label="E-mail da empresa"
              value={enterprise.email}
              editKey="email"
              isEditing={isEditing}
              editedData={editedData}
              onChange={handleFieldChange}
            />
          </div>
        </div>

        {/* Dados do gestor */}
        <div className="p-8">
          <SectionTitle icon={Shield} title="Dados do gestor" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FieldRow
              icon={Mail}
              label="E-mail do gestor"
              value={enterprise.gestorEmail}
              editKey="gestorEmail"
              isEditing={isEditing}
              editedData={editedData}
              onChange={handleFieldChange}
            />
            <FieldRow
              icon={Phone}
              label="Telefone do gestor"
              value={enterprise.numeroGestor ?? ""}
              editKey="numeroGestor"
              isEditing={isEditing}
              editedData={editedData}
              onChange={handleFieldChange}
            />
          </div>
        </div>

        {/* Informações do sistema */}
        <div className="p-8">
          <SectionTitle icon={FileText} title="Informações do sistema" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60">
              <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                ID interno
              </span>
              <span className="text-sm font-mono font-medium text-gray-700 dark:text-gray-300 truncate">
                {enterprise.id}
              </span>
            </div>
            <div className="flex flex-col gap-1 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60">
              <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                CNPJ
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {formatCnpj(enterprise.cnpj)}
              </span>
            </div>
            <div className="flex flex-col gap-1 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60">
              <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                Cadastro em
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {formatDate(enterprise.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}