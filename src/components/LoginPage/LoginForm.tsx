"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User, LockKeyhole, EyeIcon, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { EyeCloseIcon } from "@/icons";
import { authService } from "@/api/services/auth.service";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { redirectByRole } from "@/utils/redirectByRole";


export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const showCustomToast = (message: string, type: "success" | "error") => {
    toast.custom((t) => (
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border border-white/20 
          text-white font-medium transition-all duration-300 transform ${t.visible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          }
          ${type === "success"
            ? "bg-[linear-gradient(135deg,#0C0869_0%,#15358D_60%,#66B132_100%)]"
            : "bg-[linear-gradient(135deg,#A00_0%,#C62828_60%,#EF5350_100%)]"
          }`}
      >
        {type === "success" ? (
          <CheckCircle2 className="text-green-300" size={22} />
        ) : (
          <XCircle className="text-red-300" size={22} />
        )}
        <span>{message}</span>
      </div>
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !senha) {
      setError("Preencha e-mail e senha.");
      return;
    }
    if (!email.includes("@")) {
      setError("E-mail inválido.");
      return;
    }

    setError("");

    try {
      const data = await authService.login({ email, password: senha });
      localStorage.setItem("access_token", data.access_token);

      showCustomToast("Login realizado com sucesso!", "success");

      setTimeout(() => {
        redirectByRole(data.access_token);
      }, 1500);
    } catch (err: any) {
      console.log(err);
      setError(err.response?.data?.message);
    }
  };

  return (
    <div
      className="flex flex-col justify-center items-center 
       z-10
       bg-[linear-gradient(134deg,#15358D_20%,#0C0869_70%,#66B132_100%)] 
      border-l-2 border-[#C7E6FE]"
    >
      {/* ✅ Toaster global */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="relative w-[135px] h-[101px] mb-6">
        <Image
          src={"/images/logo/ninna-logo.svg"}
          alt="ninna-logo"
          fill
          className="object-cover"
        />
      </div>
      <h1 className="font-semibold text-[34px] text-white mb-4">Login</h1>
      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className="relative w-[300px] mb-6">
          <input
            type="text"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block bg-white text-black hover:bg-gray-100 hover:shadow-lg w-full rounded-3xl pl-12 p-3 cursor-pointer
            placeholder:text-lg placeholder-[#6B7280] focus:outline-none transition-all duration-300 ease-in-out"
          />
          <User
            className="absolute top-3 left-3.5 pointer-events-none"
            color="#6B7280"
          />
        </div>

        {/* Password */}
        <div className="relative w-[300px] mb-5">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="block bg-white text-black hover:bg-gray-100 hover:shadow-lg w-[300px] rounded-3xl pl-12 p-3 cursor-pointer 
            placeholder:text-lg placeholder-[#6B7280] focus:outline-none transition-all duration-300 ease-in-out"
          />
          <LockKeyhole
            className="absolute top-3 left-3.5 pointer-events-none"
            color="#6B7280"
          />

          {/* Botão de mostrar/ocultar senha */}
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            {showPassword ? (
              <EyeIcon size={20} className="text-gray-500 dark:text-gray-400" />
            ) : (
              <EyeCloseIcon
                size={20}
                className="text-gray-500 dark:text-gray-400"
              />
            )}
          </span>
        </div>
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
        <div className="w-[300px] text-center mb-5">
          <Link
            href={"#"}
            className="relative text-base text-white cursor-pointer
            after:content-[''] after:absolute after:left-0 after:-bottom-0.5
            after:h-[1.5px] after:w-full after:bg-white
            after:origin-center after:scale-x-0 after:transition-transform after:duration-300
            hover:after:scale-x-100"
          >
            Esqueceu a senha?
          </Link>
          <p className="text-base text-[#D2F5FB] font-light">
            Não possui cadastro?
            <Link
              href={"/auth/register"}
              className="relative text-white font-normal cursor-pointer
              after:content-[''] after:absolute after:left-0 after:-bottom-0.5
              after:h-[1.5px] after:w-full after:bg-white
              after:origin-center after:scale-x-0 after:transition-transform 
              after:duration-300 hover:after:scale-x-100"
            >
              {" "}
              Inscreva-se
            </Link>
          </p>
        </div>
        <div className="w-[300px] mb-6">
          <button
            type="submit"
            className="w-full bg-linear-to-r hover:scale-[102.5%] from-[#0C0869] from-5% cursor-pointer
            to-[#15358D] rounded-3xl p-[10px] shadow text-2xl font-semibold text-white transition-all duration-300 ease-in-out"
          >
            Entrar
          </button>
        </div>
      </form>
    </div>
  );
}
