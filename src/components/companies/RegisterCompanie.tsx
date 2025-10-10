"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Building2,
  FileText,
  Layers,
  User,
  Mail,
  MapPin,
  AlignLeft,
} from "lucide-react";
import Link from "next/link";
import { EyeCloseIcon } from "@/icons";

export default function RegisterCompany() {
  const [formData, setFormData] = useState({
    nomeEmpresa: "",
    cnpj: "",
    setor: "",
    gestor: "",
    email: "",
    endereco: "",
    descricao: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("✅ Dados enviados:", formData);
  };
  return (
    <div
      className="flex flex-col justify-center items-center 
       z-10 
      bg-[linear-gradient(134deg,#15358D_20%,#0C0869_70%,#66B132_100%)] 
      border-l-2 border-[#C7E6FE]"
    >
           {/* Logo */}
      <div className="relative w-[140px] h-[90px] mb-4">
        <Image
          src="/images/logo/ninna-logo.svg"
          alt="ninna-logo"
          fill
          className="object-contain"
        />
      </div>

      {/* Título */}
      <h1 className="text-2xl font-semibold text-white mb-6">
        Cadastro Empresa
      </h1>

      {/* Formulário */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-[330px] text-white"
      >
        {/* Nome da Empresa */}
        <div className="relative w-full mb-3">
          <input
            type="text"
            placeholder="Nome da Empresa"
            value={formData.nomeEmpresa}
            onChange={(e) => handleChange("nomeEmpresa", e.target.value)}
            className="w-full bg-white text-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm placeholder-gray-400 focus:outline-none"
          />
          <Building2 className="absolute top-3 left-4 text-gray-400" size={18} />
        </div>

        {/* CNPJ */}
        <div className="relative w-full mb-3">
          <input
            type="text"
            placeholder="CNPJ"
            value={formData.cnpj}
            onChange={(e) => handleChange("cnpj", e.target.value)}
            className="w-full bg-white text-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm placeholder-gray-400 focus:outline-none"
          />
          <FileText className="absolute top-3 left-4 text-gray-400" size={18} />
        </div>

        {/* Setor */}
        <div className="relative w-full mb-3">
          <input
            type="text"
            placeholder="Setor"
            value={formData.setor}
            onChange={(e) => handleChange("setor", e.target.value)}
            className="w-full bg-white text-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm placeholder-gray-400 focus:outline-none"
          />
          <Layers className="absolute top-3 left-4 text-gray-400" size={18} />
        </div>

        {/* Gestor */}
        <div className="relative w-full mb-3">
          <input
            type="text"
            placeholder="Gestor"
            value={formData.gestor}
            onChange={(e) => handleChange("gestor", e.target.value)}
            className="w-full bg-white text-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm placeholder-gray-400 focus:outline-none"
          />
          <User className="absolute top-3 left-4 text-gray-400" size={18} />
        </div>

        {/* Email */}
        <div className="relative w-full mb-3">
          <input
            type="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full bg-white text-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm placeholder-gray-400 focus:outline-none"
          />
          <Mail className="absolute top-3 left-4 text-gray-400" size={18} />
        </div>

        {/* Endereço */}
        <div className="relative w-full mb-3">
          <input
            type="text"
            placeholder="Endereço"
            value={formData.endereco}
            onChange={(e) => handleChange("endereco", e.target.value)}
            className="w-full bg-white text-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm placeholder-gray-400 focus:outline-none"
          />
          <MapPin className="absolute top-3 left-4 text-gray-400" size={18} />
        </div>

        {/* Descrição */}
        <div className="relative w-full mb-5">
          <textarea
            placeholder="Descrição"
            value={formData.descricao}
            onChange={(e) => handleChange("descricao", e.target.value)}
            className="w-full bg-white text-gray-800 rounded-2xl pl-11 pr-4 py-3 text-sm placeholder-gray-400 focus:outline-none h-24 resize-none"
          />
          <AlignLeft className="absolute top-3 left-4 text-gray-400" size={18} />
        </div>

        {/* Botão */}
        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-[#0C0869] to-[#15358D] text-white text-lg font-semibold py-3 shadow hover:scale-[1.02] transition-transform duration-300"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}

