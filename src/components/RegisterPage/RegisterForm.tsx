"use client";

import { useState } from "react";
import Image from "next/image";
import { User, Mail, LockKeyhole, Phone, EyeIcon } from "lucide-react";
import Link from "next/link";
import { EyeCloseIcon } from "@/icons";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    senha: "",
    repetirSenha: "",
  });

  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 6)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(
        6
      )}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
      7,
      11
    )}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.nome ||
      !formData.telefone ||
      !formData.email ||
      !formData.senha ||
      !formData.repetirSenha
    ) {
      setError("Preencha todos os campos.");
      return;
    }

    if (formData.senha !== formData.repetirSenha) {
      setError("As senhas não coincidem.");
      return;
    }

    setError("");
    console.log("✅ Formulário enviado:", formData);
  };

  return (
    <div
      className="flex flex-col justify-center items-center 
       z-10 
      bg-[linear-gradient(134deg,#15358D_20%,#0C0869_70%,#66B132_100%)] 
      border-l-2 border-[#C7E6FE]"
    >
      <div className="relative w-[140px] h-[90px] mb-6">
        <Image
          src={"/images/ninna-logo.svg"}
          alt="ninna-logo"
          fill
          className="object-contain"
        />
      </div>

      <h1 className="font-semibold text-[28px] text-white mb-6">Cadastro</h1>

      <form
        className="flex flex-col items-center w-[300px]"
        onSubmit={handleSubmit}
      >

        {/* Full name */}
        <div className="relative w-full mb-4">
          <input
            type="text"
            placeholder="Nome Completo"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            className="w-full bg-white text-black rounded-full pl-12 pr-4 py-3 shadow-sm"
          />
          <User className="absolute top-3 left-4" color="#6B7280" size={20} />
        </div>

        {/* Phone */}
        <div className="relative w-full mb-4">
          <input
            type="tel"
            placeholder="Telefone"
            value={formData.telefone}
            onChange={(e) =>
              setFormData({ ...formData, telefone: formatTelefone(e.target.value) })
            }
            className="w-full bg-white text-black rounded-full pl-12 pr-4 py-3 shadow-sm"
          />
          <Phone className="absolute top-3 left-4" color="#6B7280" size={20} />
        </div>

        {/* Email */}
        <div className="relative w-full mb-4">
          <input
            type="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full bg-white text-black rounded-full pl-12 pr-4 py-3 shadow-sm"
          />
          <Mail className="absolute top-3 left-4" color="#6B7280" size={20} />
        </div>
          
        {/* Password */}
        <div className="relative w-full mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            value={formData.senha}
            onChange={(e) =>
              setFormData({ ...formData, senha: e.target.value })
            }
            className="w-full bg-white text-black rounded-full pl-12 pr-10 py-3 shadow-sm"
          />
          <LockKeyhole
            className="absolute top-3 left-4"
            color="#6B7280"
            size={20}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            {showPassword ? (
              <EyeIcon size={20} className="text-gray-500 dark:text-gray-400" />
            ) : (
              <EyeCloseIcon size={20} className="text-gray-500 dark:text-gray-400" />
            )}
          </span>
        </div>

        {/* Repeat password */}
        <div className="relative w-full mb-4">
          <input
            type={showRepeatPassword ? "text" : "password"}
            placeholder="Repetir senha"
            value={formData.repetirSenha}
            onChange={(e) =>
              setFormData({ ...formData, repetirSenha: e.target.value })
            }
            className="w-full bg-white text-black rounded-full pl-12 pr-10 py-3 shadow-sm"
          />
          <LockKeyhole
            className="absolute top-3 left-4"
            color="#6B7280"
            size={20}
          />
          <span
            onClick={() => setShowRepeatPassword(!showRepeatPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            {showRepeatPassword ? (
              <EyeIcon size={20} className="text-gray-500 dark:text-gray-400" />
            ) : (
              <EyeCloseIcon size={20} className="text-gray-500 dark:text-gray-400" />
            )}
          </span>
        </div>
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <div className="w-[300px] text-center mb-5">
          <p className="text-base text-[#D2F5FB] font-light">
            Já possui cadastro?
            <Link href="/login" className="relative text-white font-normal cursor-pointer
              after:content-[''] after:absolute after:left-0 after:-bottom-0.5
              after:h-[1.5px] after:w-full after:bg-white
              after:origin-center after:scale-x-0 after:transition-transform 
              after:duration-300 hover:after:scale-x-100">
              {" "}
              Faça login
            </Link>
          </p>
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-gradient-to-r from-[#0C0869] to-[#15358D] 
          text-white text-lg font-semibold py-3 shadow hover:scale-[1.02] 
          transition-transform duration-300 mb-4"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}
