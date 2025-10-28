"use client";
import Image from "next/image";
import React from "react";

export default function PlataformaInovacao() {
  return (
    <section
      className="w-full min-h-screen flex flex-col items-center justify-center text-white px-10 py-20 gap-16"
      style={{
        background: `
          linear-gradient(190deg, 
            #0C0668 0%, 
            #111C79 100%)
        `,
      }}
    >
      {/* Bloco de título e descrição */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl border border-white/40 rounded-2xl p-10 gap-10 backdrop-blur-sm"
        style={{
        border: "2px solid transparent",
        backgroundImage:
        "linear-gradient(#0B0B66, #0B0B66), linear-gradient(90deg, #455BA3, #E6E9EF)",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
    }}>
        {/* Título */}
        <h2 className="text-4xl md:text-5xl font-bold leading-snug md:w-1/3">
          Plataforma <br /> de Inovação
        </h2>

        {/* Texto descritivo */}
        <p className="text-base md:text-lg leading-relaxed text-gray-200 md:w-2/3">
          Plataforma web de inovação aberta voltada para corporações, com foco na
          gestão de desafios, captação de ideias e conexão com startups. A
          plataforma deve seguir um funil estruturado de inovação e permitir o
          atendimento a múltiplas empresas (multiempresa) com áreas restritas e
          relatórios segmentados.
        </p>
      </div>

      {/* Cards abaixo */}
      <div className="flex flex-wrap justify-center gap-8 w-full max-w-6xl">
        {/* Card 1 */}
        <div className="bg-white text-[#0B005E] w-[160px] h-[160px] rounded-xl flex flex-col items-center justify-center gap-1 shadow-lg hover:scale-105 transition-transform">
          <Image src="/images/gestao.png" alt="Gestão de Desafios" width={90} height={90} />
          <span className="text-center font-semibold text-lg">Gestão de<br />Desafios</span>
        </div>

        {/* Card 2 */}
        <div className="bg-white text-[#0B005E] w-[160px] h-[160px] rounded-xl flex flex-col items-center justify-center gap-1 shadow-lg hover:scale-105 transition-transform">
          <Image src="/images/ideias.png" alt="Captação de Ideias" width={90} height={90} />
          <span className="text-center font-semibold text-lg">Captação de<br />Ideias</span>
        </div>

        {/* Card 3 */}
        <div className="bg-white text-[#0B005E] w-[160px] h-[160px] rounded-xl flex flex-col items-center justify-center gap-1 shadow-lg hover:scale-105 transition-transform">
          <Image src="/images/funil.png" alt="Funil de Inovação" width={90} height={90} />
          <span className="text-center font-semibold text-lg">Funil de<br />Inovação Visual</span>
        </div>

        {/* Card 4 */}
        <div className="bg-white text-[#0B005E] w-[160px] h-[160px] rounded-xl flex flex-col items-center justify-center gap-1 shadow-lg hover:scale-105 transition-transform">
          <Image src="/images/startups.png" alt="Conexão com Startups" width={90} height={90} />
          <span className="text-center font-semibold text-lg">Conexão com<br />Startups</span>
        </div>

        {/* Card 5 */}
        <div className="bg-white text-[#0B005E] w-[160px] h-[160px] rounded-xl flex flex-col items-center justify-center gap-1 shadow-lg hover:scale-105 transition-transform">
          <Image src="/images/relatorios.png" alt="Avaliação e Relatórios" width={90} height={90} />
          <span className="text-center font-semibold text-lg">Avaliação e<br />Relatórios</span>
        </div>
      </div>
    </section>
  );
}
