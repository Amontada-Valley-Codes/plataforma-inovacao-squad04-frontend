/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { User, Mail, LockKeyhole, Phone, EyeIcon, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { EyeCloseIcon } from "@/icons";
import { authService } from "@/api/services/auth.service";
import { useSearchParams, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const [token, setToken] = useState<string>("");
  const router = useRouter();

  const showCustomToast = (message: string, type: "success" | "error") => {
    toast.custom((t) => (
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border border-white/20 
          text-white font-medium transition-all duration-300 transform ${
            t.visible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          }
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

  const formatPhone = (value: string) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.phone ||
      !formData.email ||
      !formData.password ||
      !formData.repeatPassword
    ) {
      setError("Preencha todos os campos.");
      return;
    }

    if (formData.password !== formData.repeatPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setError("");

    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { repeatPassword, ...dataToSend } = formData;
      const data = await authService.Register({ ...dataToSend, token });
      console.log(data);

      setLoading(false);

      showCustomToast("Conta criada com sucesso! Faça login para continuar.", "success");
      setTimeout(() => {
        router.push("/auth/login");
      }, 1000);
    } catch (err: any) {
      setLoading(false);
      console.log(err);
      setError(err.response?.data?.message);
      showCustomToast(err.response?.data?.message || "Erro ao criar conta.", "error");
    }

    console.log("✅ Formulário enviado:", formData);
  };

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) setToken(token);
  }, [searchParams]);

  return (
    <div
      className="flex flex-col justify-center items-center 
       z-10 
      bg-[linear-gradient(134deg,#15358D_20%,#0C0869_70%,#66B132_100%)] 
      border-l-2 border-[#C7E6FE]"
    >
      <Toaster position="top-right" reverseOrder={false} />

      <div className="relative w-[140px] h-[90px] mb-6">
        <Image
          src={"/images/logo/ninna-logo.svg"}
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
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-white text-black rounded-full pl-12 pr-4 py-3 shadow-sm"
          />
          <User className="absolute top-3 left-4" color="#6B7280" size={20} />
        </div>

        {/* Phone */}
        <div className="relative w-full mb-4">
          <input
            type="tel"
            placeholder="Telefone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: formatPhone(e.target.value) })
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
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
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
            value={formData.repeatPassword}
            onChange={(e) =>
              setFormData({ ...formData, repeatPassword: e.target.value })
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
            <Link
              href="/auth/login"
              className="relative text-white font-normal cursor-pointer
              after:content-[''] after:absolute after:left-0 after:-bottom-0.5
              after:h-[1.5px] after:w-full after:bg-white
              after:origin-center after:scale-x-0 after:transition-transform 
              after:duration-300 hover:after:scale-x-100"
            >
              {" "}
              Faça login
            </Link>
          </p>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center bg-gradient-to-r hover:scale-[102.5%]
          from-[#0C0869] to-[#15358D] rounded-3xl p-[10px] shadow text-2xl font-semibold
          text-white transition-all duration-300 ease-in-out"
        >
          {loading ? <Loader2 className="animate-spin w-8 h-8 text-blue-600" /> : 'Cadastrar'}
        </button>
      </form>
    </div>
  );
}
