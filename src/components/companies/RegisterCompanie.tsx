  "use client";

  import { useState } from "react";
  import Image from "next/image";
  import { Building2, FileText, Layers, User, Mail, MapPin, AlignLeft } from "lucide-react";

  export default function RegisterCompany() {
    const [formData, setFormData] = useState({
      name: "",
      cnpj: "",
      sector: "",
      description: "",
      address: "",
      email: "",
      gestorEmail: "",
    });

    const handleChange = (field: string, value: string) => {
      setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
    };

    return (
      <div className="flex flex-col justify-center items-center bg-[linear-gradient(134deg,#15358D_20%,#0C0869_70%,#66B132_100%)] md:border-l-2 border-[#C7E6FE]">
        <div className="relative w-[140px] h-[90px] mb-4">
          <Image src="/images/logo/ninna-logo.svg" alt="ninna-logo" fill className="object-contain" />
        </div>

        <h1 className="text-2xl font-semibold text-white mb-6">Cadastro Empresa</h1>

        <form onSubmit={handleSubmit} className="flex flex-col items-center w-[330px] text-white">
          <div className="relative w-full mb-3">
            <input
              type="text"
              placeholder="Nome da Empresa"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full bg-white text-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm placeholder-gray-400 focus:outline-none"
            />
            <Building2 className="absolute top-3 left-4 text-gray-400" size={18} />
          </div>

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

          <div className="relative w-full mb-3">
            <input
              type="text"
              placeholder="Setor"
              value={formData.sector}
              onChange={(e) => handleChange("sector", e.target.value)}
              className="w-full bg-white text-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm placeholder-gray-400 focus:outline-none"
            />
            <Layers className="absolute top-3 left-4 text-gray-400" size={18} />
          </div>

          <div className="relative w-full mb-3">
            <input
              type="text"
              placeholder="Gestor"
              value={formData.gestorEmail}
              onChange={(e) => handleChange("gestorEmail", e.target.value)}
              className="w-full bg-white text-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm placeholder-gray-400 focus:outline-none"
            />
            <User className="absolute top-3 left-4 text-gray-400" size={18} />
          </div>

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

          <div className="relative w-full mb-3">
            <input
              type="text"
              placeholder="Endereço"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full bg-white text-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm placeholder-gray-400 focus:outline-none"
            />
            <MapPin className="absolute top-3 left-4 text-gray-400" size={18} />
          </div>

          <div className="relative w-full mb-5">
            <textarea
              placeholder="Descrição"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full bg-white text-gray-800 rounded-2xl pl-11 pr-4 py-3 text-sm placeholder-gray-400 focus:outline-none h-24 resize-none"
            />
            <AlignLeft className="absolute top-3 left-4 text-gray-400" size={18} />
          </div>

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
