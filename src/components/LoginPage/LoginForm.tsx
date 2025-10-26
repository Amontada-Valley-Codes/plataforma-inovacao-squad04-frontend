"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User, LockKeyhole, EyeIcon, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { EyeCloseIcon } from "@/icons";
import { authService } from "@/api/services/auth.service";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

function setFrontendCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === "undefined") return;
  const secure = typeof window !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${value}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

function parseJwt<T = any>(token: string): T | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

function getJwtMaxAge(jwt: string, fallbackSeconds = 60 * 60 * 8) {
  const payload = parseJwt<{ exp?: number }>(jwt);
  if (!payload?.exp) return fallbackSeconds;
  const now = Math.floor(Date.now() / 1000);
  return Math.max(payload.exp - now, 1);
}

function decideDestinyFromToken(jwt: string) {
  const p = parseJwt<{ type_user?: string; enterpriseId?: string | null }>(jwt) || {};
  const type = (p.type_user ?? "").toUpperCase();
  const companyId = p.enterpriseId ? String(p.enterpriseId) : null;

  switch (type) {
    case "ADMINISTRATOR":
      return "/admin/dashboard";
    case "MANAGER":
      return companyId ? `/company/${companyId}/dashboard` : "/company";
    case "EVALUATOR":
      return companyId ? `/company/${companyId}/desafios` : "/company/desafios";
    case "COMMON":
      return "/user/meus-desafios";
    default:
      return "/user/meus-desafios";
  }
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !senha.trim()) {
      setError("Preencha e-mail e senha.");
      return;
    }
    if (!email.includes("@")) {
      setError("E-mail inválido.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const { access_token } = await authService.login({ email, password: senha });

      localStorage.setItem("access_token", access_token);
      const maxAge = getJwtMaxAge(access_token);
      setFrontendCookie("access_token", access_token, maxAge);

      const destiny = decideDestinyFromToken(access_token);

      setLoading(false);
      showCustomToast("Login realizado com sucesso!", "success");
      setTimeout(() => router.push(destiny), 300);
    } catch (err: any) {
      setLoading(false);
      const msg = err?.response?.data?.message || "Erro ao entrar.";
      setError(msg);
      showCustomToast(msg, "error");
    }
  };

  return (
    <div
      className="flex flex-col justify-center items-center min-h-screen 
      bg-[linear-gradient(134deg,#15358D_10%,#0C0869_70%,#66B132_100%)]
      px-6 sm:px-10 py-8"
    >
      <Toaster position="top-right" reverseOrder={false} />

      {/* Logo */}
      <div className="relative w-[90px] h-[65px] sm:w-[110px] sm:h-[80px] mb-6 sm:mb-8">
        <Image src="/images/logo/ninna-logo.svg" alt="ninna-logo" fill className="object-contain" priority />
      </div>

      <h1 className="font-semibold text-xl sm:text-3xl text-white mb-5 sm:mb-6 text-center">Login</h1>

      <form onSubmit={handleSubmit} className="w-5/6 max-w-[360px] flex flex-col items-center gap-3 sm:gap-4">
        <div className="relative w-5/6">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block bg-white text-black w-full rounded-full pl-11 pr-4 py-2.5 sm:py-3
              placeholder-gray-500 text-sm sm:text-base shadow-sm focus:outline-none"
          />
          <User className="absolute left-4 top-1/2 -translate-y-1/2" color="#6B7280" size={18} />
        </div>

        <div className="relative w-5/6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="block bg-white text-black w-full rounded-full pl-11 pr-10 py-2.5 sm:py-3
              placeholder-gray-500 text-sm sm:text-base shadow-sm focus:outline-none"
          />
          <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2" color="#6B7280" size={18} />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeIcon size={18} /> : <EyeCloseIcon size={18} />}
          </button>
        </div>

        {error && <p className="text-red-400 text-sm text-center w-full">{error}</p>}

        <div className="text-center mt-1 space-y-1">
          <Link href="#" className="text-xs sm:text-sm text-white hover:underline">
            Esqueceu a senha?
          </Link>
          <p className="text-xs sm:text-sm text-[#D2F5FB] font-light">
            Não possui cadastro?{" "}
            <Link href="/auth/register" className="text-white font-medium hover:underline">
              Inscreva-se
            </Link>
          </p>
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
            "Entrar"
          )}
        </button>
      </form>
    </div>
  );
}
