"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function FunilInovacao() {
  return (
    <section
      className="w-full min-h-screen flex flex-col items-center justify-center text-white px-4 py-6"
    style={{
        background: `
          linear-gradient(190deg, 
            #0C0668 0%, 
            #111C79 100%)
        `,
      }}
    >
      {/* Título */}
      <div className="text-center max-w-4xl mb-2">
        <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-2">
          Gerencie seus desafios de inovação com eficácia
        </h2>
        <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
          Utilize o <span className="font-semibold text-white">PIAC</span> para
          criar e organizar desafios, acompanhar as submissões de ideias,
          conectar startups e analisar resultados facilmente!
        </p>
      </div>

      {/* Conteúdo principal */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-24 w-full max-w-7xl">
        {/* Lado esquerdo - Funil */}
        <div className="flex flex-col items-center md:items-start justify-center w-full md:w-1/2">
          <h3 className="text-2xl md:text-3xl font-semibold mb-6">
            Nosso Funil de Inovações
          </h3>
          <Image
            src="/images/InnovationFunnel.png"
            alt="Funil de Inovações"
            width={500}
            height={400}
            className="object-contain w-[420px] md:w-[500px]"
          />
        </div>

        {/* Lado direito - Ilustração + botão */}
        <div className="flex flex-col items-center md:items-center justify-center w-full md:w-1/2">
          <Image
            src="/images/Innovation.png"
            alt="Pessoa com notebook"
            width={420}
            height={420}
            className="object-contain mb-6"
          />

          <Link
            href="/auth/register-startups"
            className="bg-[#44E043] hover:bg-[#3cd13a] text-[#0C0668] font-semibold text-lg px-10 py-3 rounded-full shadow-lg transition-all duration-200 inline-block"
          >
            Registre sua Corporação
          </Link>
        </div>
      </div>
    </section>
  );
}
