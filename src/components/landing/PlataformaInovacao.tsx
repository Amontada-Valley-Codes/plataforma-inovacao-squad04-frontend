"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

export default function PlataformaInovacao() {
  return (
    <section
      id="plataforma-inovacao"
      className="
        w-full min-h-screen flex flex-col items-center justify-center text-white
        px-4 sm:px-6 lg:px-10 py-16 sm:py-20 lg:py-28 gap-12 sm:gap-14 lg:gap-16
        overflow-hidden
      "
      style={{
        backgroundImage: "url('/images/Plataforma.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Título + Texto */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        className="flex flex-col items-center text-center max-w-[52rem] gap-6 sm:gap-8"
      >
        <h2 className="font-bold leading-tight text-[clamp(2rem,4vw,3.25rem)]">
          Plataforma de Inovação Aberta
        </h2>
        <p className="text-[clamp(0.98rem,1.2vw,1.125rem)] leading-relaxed text-gray-100">
          Plataforma web de inovação aberta voltada para corporações, com foco na
          gestão de desafios, captação de ideias e conexão com startups. A plataforma
          deve seguir um funil estruturado de inovação e permitir o atendimento a
          múltiplas empresas (multiempresa) com áreas restritas e conexões com startups.
        </p>
      </motion.div>

      {/* Cards */}<div
  className="
    w-fit mx-auto                             /* <-- grid fica do tamanho do conteúdo e centraliza */
    grid grid-cols-2 md:grid-cols-4           /* <-- 2 no mobile, 4 no md+ */
    gap-x-4 gap-y-4 sm:gap-x-8 sm:gap-y-6     /* <-- gaps fluidos */
    justify-items-center                       /* <-- itens centralizados dentro da célula */
  "
>
  {[ 
    { img: "gestao", label: "Gestão de\nDesafios" },
    { img: "ideias", label: "Captação de\nIdeias" },
    { img: "funil", label: "Funil de\nInovação Visual" },
    { img: "startups", label: "Conexão com\nStartups" },
  ].map((card, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      className="
        bg-white text-[#0B005E]
        w-[8.75rem] h-[8.75rem] sm:w-40 sm:h-40 lg:w-44 lg:h-44
        rounded-xl flex flex-col items-center justify-center
        shadow-lg transform-gpu will-change-transform
        transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
        motion-reduce:transition-none
        md:hover:scale-105 md:hover:shadow-xl
      "
    >
      <Image
        src={`/images/${card.img}.png`}
        alt={card.label}
        width={96}
        height={96}
        className="
          w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20
          transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
          motion-reduce:transition-none
        "
      />
      <span className="text-center font-semibold mt-1 text-[0.83rem] sm:text-sm md:text-base whitespace-pre-line">
        {card.label}
      </span>
    </motion.div>
  ))}

      </div>
    </section>
  );
}
