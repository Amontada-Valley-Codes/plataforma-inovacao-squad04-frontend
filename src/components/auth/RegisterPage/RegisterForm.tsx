/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { User, Mail, LockKeyhole, Phone, EyeIcon, Loader2, EyeClosedIcon, Building2 } from "lucide-react";
import Link from "next/link";
import { authService } from "@/api/services/auth.service";
import { useSearchParams, useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    repeatPassword: "",
    sector: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const [token, setToken] = useState<string>("");
  const router = useRouter();

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  useEffect(() => {
    const t = searchParams.get("token");
    if (t) setToken(t);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.email || !formData.password || !formData.repeatPassword || !formData.sector) {
      setError("Preencha todos os campos.");
      return;
    }
    if (formData.password !== formData.repeatPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    if (!token) {
      setError("Token de convite ausente. Abra o link recebido por e-mail.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { repeatPassword, ...dataToSend } = formData;

      console.log(dataToSend)
      console.log(token)

      // 1) registra com token de convite
      await authService.register({ ...dataToSend, token });

      // 2) login automático (back retorna { access_token })
      const { access_token } = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      // 3) guarda o token p/ o axios interceptor
      localStorage.setItem("access_token", access_token);

      // 4) redireciona
      toast.success("Conta criada com sucesso! Redirecionando…");
      router.push("/admin/dashboard"); 
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Erro ao criar conta.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }

  };

  const handleSectorChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      sector: value,
    }));
  };
  return (
    <div
      className="flex flex-col justify-center items-center 
       z-10 
      bg-[linear-gradient(134deg,#15358D_20%,#0C0869_70%,#66B132_100%)] 
      md:border-l-2 border-[#C7E6FE]"
    >
      <Toaster position="top-right" richColors />

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

        <div className="relative w-full mb-4">
          <Select
            value={formData.sector}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, sector: value }))
            }
          >
            <SelectTrigger 
              className="w-full bg-white text-base text-black rounded-full pl-12 pr-4 py-[23.2px] shadow-sm"
            >
              <SelectValue 
                placeholder="Selecione o setor" 
                className="text-base data-[placeholder]:text-base placeholder:text-[#98A2B3]"
              />
            </SelectTrigger>

            <SelectContent className="z-[100000]">
              <SelectItem value="ADMINISTRATIVE">Administrativo</SelectItem>
              <SelectItem value="FINANCIAL">Financeiro</SelectItem>
              <SelectItem value="ACCOUNTING">Contábil</SelectItem>
              <SelectItem value="LEGAL">Jurídico</SelectItem>
              <SelectItem value="HUMAN_RESOURCES">Recursos Humanos</SelectItem>
              <SelectItem value="MARKETING">Marketing</SelectItem>
              <SelectItem value="SALES">Vendas</SelectItem>
              <SelectItem value="COMMERCIAL">Comercial</SelectItem>
              <SelectItem value="SUPPLY">Suprimentos</SelectItem>
              <SelectItem value="LOGISTICS">Logística</SelectItem>
              <SelectItem value="PRODUCTION">Produção</SelectItem>
              <SelectItem value="TECHNOLOGY">Tecnologia</SelectItem>
              <SelectItem value="ENGINEERING">Engenharia</SelectItem>
              <SelectItem value="CUSTOMER_SERVICE">Atendimento ao Cliente</SelectItem>
              <SelectItem value="QUALITY">Qualidade</SelectItem>
              <SelectItem value="RESEARCH_DEVELOPMENT">
                Pesquisa e Desenvolvimento
              </SelectItem>
              <SelectItem value="HEALTH_SAFETY">Saúde e Segurança</SelectItem>
              <SelectItem value="OTHER">Outro</SelectItem>
            </SelectContent>
          </Select>
          <Building2 className="absolute top-3 left-4" color="#6B7280" size={20}/>
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
              <EyeClosedIcon size={20} className="text-gray-500 dark:text-gray-400" />
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
              <EyeClosedIcon size={20} className="text-gray-500 dark:text-gray-400" />
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
          className="mt-3 w-full  py-2.5 sm:py-3 rounded-full text-white font-semibold text-sm sm:text-base bg-[linear-gradient(90deg,#0C0869_0%,#15358D_100%)] hover:scale-[1.03] transition-transform duration-300"
        >
          {loading ? <Loader2 className="animate-spin w-8 h-8 text-blue-600" /> : 'Cadastrar'}
        </button>
      </form>
    </div>
  );
}
