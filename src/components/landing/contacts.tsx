"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";

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
        "service_uohjslh", // ✅ seu Service ID
        "template_sxmev45", // ✅ seu Template ID
        form,
        "C9fF9UztfXH_DxUC3" // ✅ sua Public Key
      )
      .then(() => {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 3000); // volta ao normal após 3s
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
          <div>
            <label htmlFor="name" className="block text-sm mb-2">
              Nome
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-[#0B005E] border border-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#A2FF00]"
              placeholder="Seu nome completo"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm mb-2">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-[#0B005E] border border-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#A2FF00]"
              placeholder="Seu e-mail"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm mb-2">
              Mensagem
            </label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full p-3 rounded-lg bg-[#0B005E] border border-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#A2FF00]"
              placeholder="Digite sua mensagem aqui..."
            />
          </div>

          {/* Botão com animação */}
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
            {status === "loading" && (
              <span className="w-5 h-5 border-2 border-[#0B005E] border-t-transparent rounded-full animate-spin"></span>
            )}

            {status === "loading"
              ? "Enviando..."
              : status === "success"
              ? "Enviado "
              : "Enviar Mensagem"}
          </button>
        </form>
      </div>

      <footer className="text-gray-400 text-sm text-center mt-8">
        © {new Date().getFullYear()} Ninna | Todos os direitos reservados.
      </footer>
    </div>
  );
}
