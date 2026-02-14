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
} from "lucide-react";
import { enterpriseService } from "@/api/services/enterprise.service";
import { ShowOneEnterpriseResponse } from "@/api/payloads/enterprise.payload";
import toast, { Toaster } from "react-hot-toast";



interface EditableFields {
  sector: string;
  description: string;
  address: string;
  email: string;
  gestorEmail: string;
  numeroGestor: string;
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatCnpj(raw: string) {
  return raw.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5"
  );
}

const PRIMARY = "#15358c";

// ─── sub-componentes ─────────────────────────────────────────────────────────

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
    <div className="flex items-start space-x-3">
      <div className="mt-1">
        <Icon size={20} style={{ color: PRIMARY }} className="opacity-70" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-500 mb-0.5">{label}</p>
        {isEditing && editKey && !readOnly ? (
          <input
            type="text"
            value={editedData[editKey]}
            onChange={(e) => onChange(editKey, e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-gray-700 text-sm"
            style={{ focusRingColor: PRIMARY } as React.CSSProperties}
          />
        ) : (
          <p className="font-medium text-gray-800 text-sm">{value || "—"}</p>
        )}
      </div>
    </div>
  );
}



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
      const payload = {
        sector: editedData.sector,
        description: editedData.description,
        address: editedData.address,
        email: editedData.email,
      };
      const updated = await enterpriseService.updateEnterprise(
        enterprise.id,
        payload
      );
      setEnterprise({ ...updated, gestorEmail: editedData.gestorEmail, numeroGestor: editedData.numeroGestor });
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
      setProfilePreview(enterprise?.profileImage?.url ?? enterprise?.logo ?? null);
    } finally {
      setUploadingProfile(false);
    }
  };

 if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground dark:text-gray-400">Carregando </p>
        </div>
      </div>
    );
  }

  if (error || !enterprise) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle size={36} className="text-red-400" />
        <p className="text-gray-600 text-sm">{error ?? "Empresa não encontrada."}</p>
        <button
          onClick={fetchEnterprise}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm"
          style={{ background: PRIMARY }}
        >
          <RefreshCw size={15} /> Tentar novamente
        </button>
      </div>
    );
  }

  // ── render principal ──────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Toaster position="top-right" />

      {/* ── Header ── */}
      <div
        className="rounded-t-2xl p-8 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY}dd 100%)`,
        }}
      >
        {/* Decoração de fundo */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white opacity-5" />
          <div className="absolute -left-10 -bottom-10 w-60 h-60 rounded-full bg-white opacity-5" />
        </div>

        <div className="relative flex items-center justify-between flex-wrap gap-4">
          {/* Logo / avatar */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-24 h-24 bg-white rounded-xl shadow-lg flex items-center justify-center overflow-hidden">
                {uploadingProfile ? (
                  <Loader2
                    size={32}
                    className="animate-spin"
                    style={{ color: PRIMARY }}
                  />
                ) : profilePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profilePreview}
                    alt="Logo da empresa"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 size={48} style={{ color: PRIMARY }} />
                )}
              </div>

              {/* Botão de trocar foto — disponível sempre que estiver em modo edição */}
              {isEditing && (
                <label
                  className="absolute -bottom-2 -right-2 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                  style={{ color: PRIMARY }}
                  title="Trocar foto de perfil"
                >
                  <Camera size={16} />
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
              <h1 className="text-3xl font-bold text-white">
                {enterprise.name}
              </h1>
              <p className="text-white opacity-80 mt-1">{enterprise.sector}</p>
              <span
                className={`mt-2 inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${
                  enterprise.status === "APPROVED"
                    ? "bg-green-400/20 text-green-200"
                    : "bg-yellow-400/20 text-yellow-200"
                }`}
              >
                {enterprise.status === "APPROVED" ? "Aprovada" : enterprise.status}
              </span>
            </div>
          </div>

          {/* Ações */}
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg hover:shadow-lg transition-all"
              style={{ color: PRIMARY }}
            >
              <Pencil size={18} />
              <span>Editar</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Check size={18} />
                )}
                <span>{saving ? "Salvando…" : "Salvar"}</span>
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all disabled:opacity-60"
              >
                <X size={18} />
                <span>Cancelar</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="bg-white rounded-b-2xl shadow-xl p-8">
        {/* Descrição */}
        <div className="mb-8">
          <h2
            className="text-lg font-semibold mb-3"
            style={{ color: PRIMARY }}
          >
            Sobre a empresa
          </h2>
          {isEditing ? (
            <textarea
              value={editedData.description}
              onChange={(e) =>
                handleFieldChange("description", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-gray-700 text-sm"
              rows={3}
            />
          ) : (
            <p className="text-gray-600 leading-relaxed">
              {enterprise.description || "Nenhuma descrição cadastrada."}
            </p>
          )}
        </div>

        {/* Grid de campos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* somente leitura */}
          <FieldRow
            icon={Building2}
            label="Nome"
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

          {/* editáveis */}
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

        {/* Card adicional */}
        <div className="mt-8 p-6 rounded-xl border border-gray-100 bg-gray-50">
          <h3
            className="text-sm font-medium mb-4"
            style={{ color: PRIMARY }}
          >
            Informações Adicionais
          </h3>
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: PRIMARY }}
              />
              <span>
                ID:{" "}
                <strong className="font-mono text-xs">{enterprise.id}</strong>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: PRIMARY }}
              />
              <span>
                CNPJ: <strong>{formatCnpj(enterprise.cnpj)}</strong>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: PRIMARY }}
              />
              <span>
                Criado em:{" "}
                <strong>
                  {new Date(enterprise.createdAt).toLocaleDateString("pt-BR")}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}