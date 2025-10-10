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
  Cpu,
  BarChart3,
  Link as LinkIcon,
  X,
  Plus,
} from "lucide-react";

export default function RegisterStartup() {
  const [formData, setFormData] = useState({
    nomeStartup: "",
    cnpj: "",
    setor: "",
    tecnologias: "",
    estagio: "",
    lider: "",
    pitch: "",
    email: "",
    links: [] as string[],
    endereco: "",
    descricao: "",
  });

  const [isLinksModalOpen, setIsLinksModalOpen] = useState(false);
  const [newLink, setNewLink] = useState("");

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("✅ Dados enviados:", formData);
  };

  const handleAddLink = () => {
    if (newLink.trim() !== "") {
      handleChange("links", [...formData.links, newLink.trim()]);
      setNewLink("");
    }
  };

  const handleRemoveLink = (index: number) => {
    const updatedLinks = formData.links.filter((_, i) => i !== index);
    handleChange("links", updatedLinks);
  };

  return (
    <div
      className="flex flex-col justify-center items-center min-h-screen 
      bg-[linear-gradient(134deg,#15358D_20%,#0C0869_70%,#66B132_100%)] 
      text-white px-4"
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
      <h1 className="text-2xl font-semibold mb-2">Cadastro Startup</h1>

      {/* Formulário */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full max-w-sm"
      >
        {/* Nome da Startup */}
        <div className="relative w-full mb-3">
          <input
            type="text"
            placeholder="Nome da Startup"
            value={formData.nomeStartup}
            onChange={(e) => handleChange("nomeStartup", e.target.value)}
            className="w-full h-10 bg-white text-gray-800 rounded-xl pl-11 pr-4 
                       text-sm placeholder:text-xs placeholder-gray-400 focus:outline-none"
          />
          <Building2 className="absolute top-2.5 left-4 text-gray-400" size={16} />
        </div>

        {/* CNPJ */}
        <div className="relative w-full mb-3">
          <input
            type="text"
            placeholder="CNPJ"
            value={formData.cnpj}
            onChange={(e) => handleChange("cnpj", e.target.value)}
            className="w-full h-10 bg-white text-gray-800 rounded-xl pl-11 pr-4 
                       text-sm placeholder:text-xs placeholder-gray-400 focus:outline-none"
          />
          <FileText className="absolute top-2.5 left-4 text-gray-400" size={16} />
        </div>

        {/* Setor */}
        <div className="relative w-full mb-3">
          <input
            type="text"
            placeholder="Setor"
            value={formData.setor}
            onChange={(e) => handleChange("setor", e.target.value)}
            className="w-full h-10 bg-white text-gray-800 rounded-xl pl-11 pr-4 
                       text-sm placeholder:text-xs placeholder-gray-400 focus:outline-none"
          />
          <Layers className="absolute top-2.5 left-4 text-gray-400" size={16} />
        </div>

        {/* Tecnologias */}
        <div className="relative w-full mb-3">
          <input
            type="text"
            placeholder="Tecnologias Utilizadas"
            value={formData.tecnologias}
            onChange={(e) => handleChange("tecnologias", e.target.value)}
            className="w-full h-10 bg-white text-gray-800 rounded-xl pl-11 pr-4 
                       text-sm placeholder:text-xs placeholder-gray-400 focus:outline-none"
          />
          <Cpu className="absolute top-2.5 left-4 text-gray-400" size={16} />
        </div>

        {/* Estágio */}
        <div className="relative w-full mb-3">
          <select
            value={formData.estagio}
            onChange={(e) => handleChange("estagio", e.target.value)}
            className="w-full h-10 bg-white text-gray-800 rounded-xl pl-10 pr-4 
                       text-sm placeholder:text-xs focus:outline-none"
          >
            <option value="">Estágio de Maturidade</option>
            <option value="ideacao">Ideação</option>
            <option value="tracao">Tração</option>
            <option value="escala">Escala</option>
          </select>
          <BarChart3 className="absolute top-2.5 left-4 text-gray-400" size={16} />
        </div>

        {/* Linha: Líder / Pitch */}
        <div className="flex gap-3 w-full mb-3">
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="Líder"
              value={formData.lider}
              onChange={(e) => handleChange("lider", e.target.value)}
              className="w-full h-10 bg-white text-gray-800 rounded-xl pl-10 pr-4 
                         text-sm placeholder:text-xs placeholder-gray-400 focus:outline-none"
            />
            <User className="absolute top-2.5 left-4 text-gray-400" size={16} />
          </div>
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="Pitch"
              value={formData.pitch}
              onChange={(e) => handleChange("pitch", e.target.value)}
              className="w-full h-10 bg-white text-gray-800 rounded-xl pl-10 pr-4 
                         text-sm placeholder:text-xs placeholder-gray-400 focus:outline-none"
            />
            <FileText className="absolute top-2.5 left-4 text-gray-400" size={16} />
          </div>
        </div>

        {/* Linha: Email / Links */}
        <div className="flex gap-3 w-full mb-3">
          <div className="relative w-1/2">
            <input
              type="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full h-10 bg-white text-gray-800 rounded-xl pl-10 pr-4 
                         text-sm placeholder:text-xs placeholder-gray-400 focus:outline-none"
            />
            <Mail className="absolute top-2.5 left-4 text-gray-400" size={16} />
          </div>
          <button
            type="button"
            onClick={() => setIsLinksModalOpen(true)}
            className="w-1/2 h-10 bg-gray-200 text-gray-700 rounded-xl 
                        font-medium flex items-center justify-center gap-1"
          >
             + Links Úteis
          </button>
        </div>

        {/* Endereço */}
        <div className="relative w-full mb-3">
          <input
            type="text"
            placeholder="Endereço"
            value={formData.endereco}
            onChange={(e) => handleChange("endereco", e.target.value)}
            className="w-full h-10 bg-white text-gray-800 rounded-xl pl-11 pr-4 
                       text-sm placeholder:text-xs placeholder-gray-400 focus:outline-none"
          />
          <MapPin className="absolute top-2.5 left-4 text-gray-400" size={16} />
        </div>

        {/* Descrição */}
        <div className="relative w-full mb-3">
          <textarea
            placeholder="Descrição"
            value={formData.descricao}
            onChange={(e) => handleChange("descricao", e.target.value)}
            className="w-full bg-white text-gray-800 rounded-xl pl-11 pr-4 py-2 
                       text-sm placeholder:text-xs placeholder-gray-400 
                       focus:outline-none h-24 resize-none"
          />
          <AlignLeft className="absolute top-2.5 left-4 text-gray-400" size={16} />
        </div>

        {/* Botão */}
        <button
          type="submit"
          className="w-full h-10 rounded-xl bg-[#0C0869] hover:bg-[#15358D] 
                     text-white text-base font-semibold shadow transition-all duration-300"
        >
          Cadastrar
        </button>
      </form>

      {/* Modal de Links */}
      {isLinksModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white text-gray-800 rounded-2xl p-6 w-80 relative shadow-lg">
            <button
              onClick={() => setIsLinksModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-semibold mb-3 text-center">Adicionar Links</h2>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="https://..."
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                className="flex-1 h-9 bg-gray-100 rounded-lg px-3 text-sm focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddLink}
                className="bg-[#0C0869] text-white rounded-lg px-3 flex items-center justify-center"
              >
                <Plus size={14} />
              </button>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {formData.links.length === 0 ? (
                <p className="text-xs text-gray-400 text-center">
                  Nenhum link adicionado ainda
                </p>
              ) : (
                formData.links.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-100 px-3 py-1 rounded-lg text-sm"
                  >
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-blue-600 hover:underline max-w-[80%]"
                    >
                      {link}
                    </a>
                    <button
                      onClick={() => handleRemoveLink(index)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
