/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User, CheckCircle2, XCircle, Loader2, Phone, LockKeyhole, EyeIcon, EyeClosedIcon } from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { inviteService } from "@/api/services/invite.service";
import { authService } from "@/api/services/auth.service";
import { useRouter } from "next/navigation";

export default function ForgotForm() {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [validationFormError, setValidationFormError] = useState("");
  const [redesignFormError, setRedesignFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationToken, setValidationToken] = useState("");

  const router = useRouter(); 

  const showCustomToast = (message: string, type: "success" | "error") => {
    toast.custom((t) => (
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border border-white/20 
          text-white font-medium transition-all duration-300 transform ${t.visible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}
          ${
            type === "success"
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

  function maskPhoneNumber(value: string) {
    return value
      .replace(/\D/g, "")               
      .replace(/^(\d{2})(\d)/, "($1) $2") 
      .replace(/(\d{5})(\d)/, "$1-$2")   
      .replace(/(-\d{4})\d+?$/, "$1");  
  }

  const validationUserCredentials = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !phoneNumber.trim()) {
      setValidationFormError("Preencha e-mail e telefone.");
      return;
    }
    if (!email.includes("@")) {
      setValidationFormError("E-mail inválido.");
      return;
    }

    setValidationFormError("");
    setLoading(true);

    try {
      const response = await inviteService.sendForgotPasswordCode({
        email: email,
        phone: phoneNumber
      })

      if (!response.token) {
        showCustomToast("Dados inválidos ou sem cadastro no sistema.", "error");
        setLoading(false)
        return
      }

      setValidationToken(response.token)

      setLoading(false);
      showCustomToast("Dados validados com sucesso!", "success");
    } catch(err: any) {
      console.log(phoneNumber)
      setLoading(false);
      const msg = err?.response?.data?.message || "Erro ao recuperar senha.";
      setValidationFormError(msg);
      showCustomToast(msg, "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

   if (password !== repeatPassword) {
      setRedesignFormError("As senhas não coincidem");
      return;
    }

    setRedesignFormError("");
    setLoading(true);

    try {
      await authService.resetPassword({
        email: email,
        newPassword: password,
        phone: String(phoneNumber),
        token: validationToken 
      })

      setLoading(false);
      showCustomToast("Senha redefinida com sucesso!", "success");

      router.push("/auth/login");

    } catch(err: any) {
      setLoading(false);
      const msg = err?.response?.data?.message || "Erro ao recuperar senha.";
      setValidationFormError(msg);
      showCustomToast(msg, "error");
      console.log(phoneNumber)
    }
  }

  return (
    <div>
      {validationToken ? (
        <div
          className="flex flex-col justify-center items-center min-h-screen 
          bg-[linear-gradient(134deg,#15358D_10%,#0C0869_70%,#66B132_100%)]
          px-6 sm:px-10 py-8 md:border-l-2 border-[#C7E6FE]"
        >
          <Toaster position="top-right" reverseOrder={false} />

          {/* Logo */}
          <div className="relative w-[90px] h-[65px] sm:w-[110px] sm:h-[80px] mb-6 sm:mb-8">
            <Image src="/images/logo/ninna-logo.svg" alt="ninna-logo" fill className="object-contain" priority />
          </div>

          <h1 className="font-semibold text-xl sm:text-3xl text-white mb-5 sm:mb-6 text-center">Redefinir senha</h1>

          <form onSubmit={handleSubmit} className="w-5/6 max-w-[360px] flex flex-col items-center gap-3 sm:gap-4">

            <div className="relative w-5/6">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block bg-white text-black w-full rounded-full pl-11 pr-4 py-2.5 sm:py-3
                  placeholder-gray-500 text-sm sm:text-base shadow-sm focus:outline-none"
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
                {showRepeatPassword ? (
                  <EyeIcon size={20} className="text-gray-500 dark:text-gray-400" />
                ) : (
                  <EyeClosedIcon size={20} className="text-gray-500 dark:text-gray-400" />
                )}
              </span>
            </div>

            <div className="relative w-5/6">
              <input
                type={showRepeatPassword ? "text" : "password"}
                placeholder="Repita a senha"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                className="block bg-white text-black w-full rounded-full pl-11 pr-4 py-2.5 sm:py-3
                  placeholder-gray-500 text-sm sm:text-base shadow-sm focus:outline-none"
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
                  <EyeClosedIcon size={20} className="text-gray-500 dark:text-gray-400" />
                )}
              </span>
            </div>

            {redesignFormError && <p className="text-red-400 text-sm text-center w-full">{redesignFormError}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-3 w-5/6 py-2.5 sm:py-3 rounded-full text-white font-semibold text-sm sm:text-base
              bg-[linear-gradient(90deg,#0C0869_0%,#15358D_100%)]
              hover:scale-[1.03] transition-transform duration-300"
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5 sm:w-6 sm:h-6 text-blue-300 mx-auto" />
              ) : (
                "Redefinir senha"
              )}
            </button>
          </form>
        </div>
      ) : (
        <div
          className="flex flex-col justify-center items-center min-h-screen 
          bg-[linear-gradient(134deg,#15358D_10%,#0C0869_70%,#66B132_100%)]
          px-6 sm:px-10 py-8 md:border-l-2 border-[#C7E6FE]"
        >
          <Toaster position="top-right" reverseOrder={false} />

          {/* Logo */}
          <div className="relative w-[90px] h-[65px] sm:w-[110px] sm:h-[80px] mb-6 sm:mb-8">
            <Image src="/images/logo/ninna-logo.svg" alt="ninna-logo" fill className="object-contain" priority />
          </div>

          <h1 className="font-semibold text-xl sm:text-3xl text-white mb-5 sm:mb-6 text-center">Esqueci minha senha</h1>

          <form onSubmit={validationUserCredentials} className="w-5/6 max-w-[360px] flex flex-col items-center gap-3 sm:gap-4">
            <div className="relative w-5/6">
              <input
                type="email"
                placeholder="Digite o e-mail cadastrado"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block bg-white text-black w-full rounded-full pl-11 pr-4 py-2.5 sm:py-3
                  placeholder-gray-500 text-sm sm:text-base shadow-sm focus:outline-none"
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2" color="#6B7280" size={18} />
            </div>

            <div className="relative w-5/6">
              <input
                type="tel"
                placeholder="Digite o telefone cadastrado"
                value={maskPhoneNumber(phoneNumber)}
                onChange={(e) => {
                  const onlyNumbers = e.target.value.replace(/\D/g, "");
                  setPhoneNumber(onlyNumbers);
                }}
                className="block bg-white text-black w-full rounded-full pl-11 pr-4 py-2.5 sm:py-3
                  placeholder-gray-500 text-sm sm:text-base shadow-sm focus:outline-none"
              />
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2" color="#6B7280" size={18} />
            </div>

            {validationFormError && <p className="text-red-400 text-sm text-center w-full">{validationFormError}</p>}

            <div className="text-center mt-1 space-y-1">
              <Link href="/auth/login" className="relative text-white font-normal cursor-pointer
                  after:content-[''] after:absolute after:left-0 after:-bottom-0.5
                  after:h-[1.5px] after:w-full after:bg-white
                  after:origin-center after:scale-x-0 after:transition-transform 
                  after:duration-300 hover:after:scale-x-100">
                Voltar para o login
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-3 w-5/6 py-2.5 sm:py-3 rounded-full text-white font-semibold text-sm sm:text-base
              bg-[linear-gradient(90deg,#0C0869_0%,#15358D_100%)]
              hover:scale-[1.03] transition-transform duration-300"
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5 sm:w-6 sm:h-6 text-blue-300 mx-auto" />
              ) : (
                "Recuperar a senha"
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
