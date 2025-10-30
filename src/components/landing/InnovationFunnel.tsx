"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function FunilInovacao() {
  return (
    <section
      id="funil-inovacao"
      className="
        relative w-full text-white
        py-12 sm:py-16 md:py-20
        flex items-center justify-center
        overflow-hidden
      "
    >
      {/* Background com imagem e gradiente */}
      <Image
        src="/images/gerencie.svg"
        alt=""
        fill
        priority
        className="object-cover -z-20"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0C0668]/70 via-[#0F1172]/60 to-[#111C79]/70" />

      {/* Conteúdo principal */}
      <div
        className="
          w-full max-w-[1100px]
          px-4 sm:px-8 lg:px-16
          mx-auto flex flex-col items-center text-center
          gap-1 sm:gap-2
        "
      >
        {/* Título + Subtítulo */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="w-full max-w-[900px] mb-3 sm:mb-4 md:mb-6 pb-0"

        >
          <h2
            className="
              font-bold leading-tight tracking-tight
              text-[clamp(20px,6vw,36px)]
              sm:text-[clamp(26px,4.2vw,40px)]
              mb-2 sm:mb-4 md:mb-6
              break-words [text-wrap:balance]
            "
          >
            Gerencie seus desafios de inovação com eficácia
          </h2>

          <p
            className="
              text-[clamp(13px,4vw,17px)]
              sm:text-[clamp(15px,2.2vw,18px)]
              text-gray-200 leading-[1.4]
              max-w-[60ch] mx-auto mb-0 pb-0
            "
          >
            Utilize o <span className="font-semibold text-white">PIAC</span> para
            criar e organizar desafios, acompanhar as submissões de ideias,
            conectar startups e analisar resultados facilmente!
          </p>
        </motion.div>

        {/* Imagem do foguete */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="
            w-full flex justify-center
            mt-[-8px] sm:mt-[-20px] md:mt-[-30px] lg:mt-[-40px]
          "
        >
          <Image
            src="/images/foguete.svg"
            alt="Funil de Inovação em formato de foguete"
            width={500}
            height={100}
            className="
              object-contain drop-shadow-lg select-none
              w-[90%] sm:w-[85%] md:w-[80%] lg:w-[850px]
            "
            sizes="(max-width: 640px) 95vw, (max-width: 1024px) 88vw, 850px"
            priority
          />
        </motion.div>

        {/* Botão animado (Link disfarçado de botão) */}
        <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.2 }}
    className="flex justify-center sm:justify-center md:justify-center w-full -mt-6 sm:-mt-8 md:-mt-10"

  >
    <Link
      href="/auth/register-companies"
      className="
        inline-block rounded-full px-8 md:px-12 py-3 text-[clamp(14px,1.8vw,18px)] 
        font-semibold bg-[#62D105] text-[#0C0668] shadow-lg transition-transform duration-200 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#62D105] 
        focus:ring-offset-transparent
      "
    >
      Registre sua Corporação
    </Link>
  </motion.div>

      </div>
    </section>
  );
}
