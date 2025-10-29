"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import { Mail, User, MessageSquare, Send, CheckCircle, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    emailjs
      .send(
        "service_uohjslh",
        "template_sxmev45",
        form,
        "C9fF9UztfXH_DxUC3" 
      )
      .then(() => {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 3000);
      })
      .catch(() => {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      });
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 md:px-10 py-12 text-white"
      style={{
        background: `linear-gradient(190deg, #0C0668 0%, #111C79 100%)`,
      }}
    >
      <div className="max-w-2xl w-full bg-[#100078] rounded-2xl shadow-lg p-8 sm:p-10">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
          Entre em <span className="text-[#A2FF00]">Contato</span>
        </h1>
        <p className="text-center text-gray-300 mb-8">
          Preencha o formulário abaixo e nossa equipe retornará o mais breve possível.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Nome */}
          <div>
            <label htmlFor="name" className="block text-sm mb-2">
              Nome
            </label>
            <div className="relative">
              <User className="absolute left-3 top-4 text-gray-400" size={20} />
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full pl-10 p-3 rounded-lg bg-[#0B005E] border border-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#A2FF00]"
                placeholder="Seu nome completo"
              />
            </div>
          </div>

          {/* E-mail */}
          <div>
            <label htmlFor="email" className="block text-sm mb-2">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-4 text-gray-400" size={20} />
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full pl-10 p-3 rounded-lg bg-[#0B005E] border border-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#A2FF00]"
                placeholder="Seu e-mail"
              />
            </div>
          </div>

          {/* Mensagem */}
          <div>
            <label htmlFor="message" className="block text-sm mb-2">
              Mensagem
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-4 text-gray-400" size={20} />
                <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full pl-10 p-3 rounded-lg bg-[#0B005E] border border-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#A2FF00] resize-none"
                placeholder="Digite sua mensagem aqui..."
                />
            </div>
          </div>

          {/* Botão */}
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className={`flex items-center justify-center gap-2 bg-[#A2FF00] text-[#0B005E] font-semibold py-3 rounded-full transition-all duration-300 ${
              status === "loading"
                ? "opacity-80 cursor-not-allowed"
                : status === "success"
                ? "bg-[#A2FF00] text-[#0B0053]"
                : "hover:opacity-90"
            }`}
          >
            {status === "loading" ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Enviando...
              </>
            ) : status === "success" ? (
              <>
                <CheckCircle size={20} />
                Enviado!
              </>
            ) : (
              <>
                <Send size={20} />
                Enviar Mensagem
              </>
            )}
          </button>
        </form>
      </div>

      <footer className="text-gray-400 text-sm text-center mt-8">
        © {new Date().getFullYear()} Ninna | Todos os direitos reservados.
      </footer>
    </div>
  );
}
