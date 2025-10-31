"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import Image from "next/image";
import { Linkedin, Instagram, Phone, Loader2 } from "lucide-react";

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
      .send("service_uohjslh", "template_sxmev45", form, "C9fF9UztfXH_DxUC3")
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
    <section
      id="contatos"
      className="min-h-screen flex flex-col justify-between text-white"
      style={{
        background: `linear-gradient(190deg, #0C0668 0%, #111C79 100%)`,
      }}
    >
      {/* TOPO COM LOGOS */}
      <div className="w-full bg-[#09065E] flex flex-wrap justify-center md:justify-around items-center gap-6 py-10 px-4">
        <Image
          src="/images/logos.svg"
          alt="Logos dos parceiros"
          width={800}
          height={100}
          className="object-contain"
        />
      </div>

      {/* CONTEÚDO CENTRAL */}
      <div className="flex flex-col items-center justify-center flex-grow px-6 py-10">
        <div className="max-w-xl w-full text-center">
          <h1 className="text-4xl font-bold mb-3">
            Entre em <span className="text-[#A2FF00]">Contato</span>
          </h1>
          <p className="text-gray-300 mb-8">
            Preencha o formulário abaixo e nossa equipe retornará o mais breve possível.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Nome Completo"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:border-[#A2FF00] transition-all"
            />

            <input
              type="email"
              name="email"
              placeholder="E-mail"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:border-[#A2FF00] transition-all"
            />

            <textarea
              name="message"
              placeholder="Mensagem"
              rows={5}
              required
              value={form.message}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:border-[#A2FF00] transition-all resize-none"
            ></textarea>

            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className={`w-full py-3 rounded-lg font-semibold text-white flex justify-center items-center gap-2 transition-all duration-300 ${
                status === "loading"
                  ? "bg-[#3b3b80] cursor-wait"
                  : status === "success"
                  ? "bg-[#3b3b80] text-blue-900"
                  : "bg-gradient-to-r from-[#1A26B8] to-[#0B0450] hover:opacity-90"
              }`}
            >
              {status === "loading" ? (
                <Loader2 className="animate-spin w-6 h-6" />
              ) : status === "success" ? (
                "Mensagem Enviada!"
              ) : (
                "Enviar Mensagem"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* RODAPÉ */}
      <div className="flex flex-col items-center gap-3 py-6">
        <div className="flex gap-6 text-white">
          {[
            { icon: <Linkedin size={22} />, href: "#" },
            { icon: <Phone size={22} />, href: "#" },
            { icon: <Instagram size={22} />, href: "#" },
          ].map((item, i) => (
            <a
              key={i}
              href={item.href}
              className="transition-all duration-300 transform hover:-translate-y-1 hover:text-[#A2FF00]"
            >
              {item.icon}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}