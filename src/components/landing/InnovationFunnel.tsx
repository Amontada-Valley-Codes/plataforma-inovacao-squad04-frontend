"use client";

import Image from "next/image";
import React from "react";

export default function InnovationFunnel() {
  return (
    <section
      className="w-full flex flex-col items-center justify-center py-20 text-white"
      style={{
        background: `
          linear-gradient(190deg, 
            #0C0668 0%, 
            #111C79 100%)
        `,
      }}
    >
      {/* Título */}
      <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
        Nosso Funil de Inovações
      </h2>

      {/* Conteúdo principal */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-24 w-full max-w-6xl ">
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="overflow-hidden w-full">
            <Image
              src="/images/InnovationFunnel.png"
              alt="Funil de etapas"
              width={1000}
              height={800}
              className="object-contain "
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center">
          <div className="overflow-hidden rounded-tl-[50px] rounded-br-[50px] shadow-lg">
            <Image
              src="/images/Innovation.png"
              alt="Funil de Inovação"
              width={531}
              height={557}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
