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
        py-12 md:py-16
        flex items-center justify-center
        overflow-hidden
      "
    >
      {/* Background com imagem e gradiente */}
      <Image
        src="/images/gerenciar-desafios.jpg"
        alt=""
        fill
        priority
        className="object-cover -z-20"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0C0668]/70 via-[#0F1172]/60 to-[#111C79]/70" />

      {/* Conteúdo principal */}
      <div className="w-full max-w-[1100px] px-6 sm:px-8 lg:px-16 mx-auto flex flex-col gap-10">
        {/* Título + Subtítulo */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="text-center mx-auto mb-4 md:mb-6 w-full max-w-[1400px]"
        >
          <h2 className="font-bold leading-tight text-[clamp(32px,2.8vw,36px)] mb-2 whitespace-nowrap">
            Gerencie seus desafios de inovação com eficácia
          </h2>
          <p className="text-[clamp(14px,2vw,18px)] text-gray-200 leading-relaxed">
            Utilize o <span className="font-semibold text-white">PIAC</span> para
            criar e organizar desafios, acompanhar as submissões de ideias,
            conectar startups e analisar resultados facilmente!
          </p>
        </motion.div>

        {/* Grid principal */}
        <div
          className="
            grid grid-cols-1 lg:grid-cols-2
            items-start justify-items-center
            gap-6 md:gap-8 lg:gap-6
            -mt-12 mx-auto w-full
          "
        >
          {/* Esquerda: Funil */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <h3 className="text-[clamp(18px,2.2vw,22px)] font-semibold mb-3 translate-x-10">
              Nosso Funil de Inovações
            </h3>

            <Image
              src="/images/InnovationFunnel.png"
              alt="Funil de Inovações"
              width={720}
              height={820}
              priority
              className="object-contain w-full max-w-[460px] translate-x-10"
              sizes="(max-width: 1024px) 90vw, 460px"
            />
          </motion.div>

          {/* Direita: Ilustração + CTA */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center text-center"
          >
            <Image
              src="/images/Innovation.png"
              alt="Pessoa com notebook"
              width={420}
              height={420}
              className="object-contain mb-4 max-w-[360px] w-full -mt-14"
              sizes="(max-width: 1024px) 80vw, 360px"
            />

            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Link
                href="/auth/register-startups"
                className="
                  inline-block rounded-full px-8 md:px-12 py-3
                  text-[clamp(14px,1.8vw,18px)] font-semibold
                  bg-[#62D105] text-[#0C0668]
                  shadow-lg transition-transform duration-200
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#62D105] focus:ring-offset-transparent -mt-8
                "
              >
                Registre sua Corporação
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
