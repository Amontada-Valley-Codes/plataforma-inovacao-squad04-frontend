"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section
      id="startups"
      className="w-full text-white overflow-hidden"
      style={{ background: "linear-gradient(190deg,#0C0668 0%,#111C79 100%)" }}
    >
      <div className="px-5 sm:px-8 lg:px-20 pt-8 md:pt-10 pb-10 md:pb-12">
        <div className="mx-auto w-full max-w-[980px] md:max-w-[1050px]">
          {/* GRID PRINCIPAL */}
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-1 lg:gap-[6px] xl:gap-[10px]">
            {/* ESQUERDA */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, amount: 0.4 }}
              className="
                w-full 
                flex flex-col 
                items-center text-center 
                lg:items-start lg:text-left
              "
            >
              {/* TÍTULO */}
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
                viewport={{ once: true }}
                className="ml-10 font-semibold tracking-tight leading-[1.18] text-[22px] sm:text-[26px] md:text-[34px]"
              >
                <span className="block">Submeta a desafios em</span>
                <span className="block">nossa plataforma e conecte-se</span>
              </motion.h1>

              {/* SUBTÍTULO */}
              <motion.p
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
                viewport={{ once: true }}
                className="ml-10 mt-2 text-[13px] sm:text-[14px] md:text-[15.5px] text-white/85 leading-relaxed max-w-[520px]"
              >
                Na nossa plataforma as startups podem submeter as suas ideias aos desafios de forma prática e fluida, num portal pensado para simplificar cada etapa da candidatura.
              </motion.p>

              {/* DOIS CARDS — sempre lado a lado */}
              <div className="mt-6 ml-10 flex flex-nowrap justify-center lg:justify-start gap-3 lg:gap-4 items-center">
                {[1, 2].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.5 + i * 0.15,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    viewport={{ once: true }}
                    className="flex-none flex justify-center items-center w-[150px] sm:w-[180px] md:w-[200px] lg:w-[220px]"
                  >
                    <Image
                      src="/images/card.svg"
                      alt={`Card ilustrativo ${i}`}
                      width={220}
                      height={220}
                      priority
                      className="object-contain w-full h-auto"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* DIREITA — aparece apenas em telas grandes */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="hidden lg:flex w-full justify-end"
            >
              <Image
                src="/images/reuniaoo.svg"
                alt="Equipe discutindo ideias"
                width={560}
                height={560}
                priority
                className="object-contain h-auto w-[82%] lg:w-[84%] xl:w-[500px]"
              />
            </motion.div>
          </div>

          {/* BOTÕES (ajuste para não quebrar em <630px) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="
              mt-4 flex items-center justify-center flex-nowrap gap-3
              [@media(max-width:630px)]:gap-2
            "
          >
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Link
                href="#"
                className="
        inline-flex items-center justify-center
        shrink min-w-0 whitespace-nowrap
        rounded-full px-6 py-2.5
        bg-white text-[#00145A] font-semibold text-[13px]
        shadow-[0_6px_18px_rgba(0,0,0,0.15)] transition
        [@media(max-width:630px)]:px-4
        [@media(max-width:630px)]:py-2
        [@media(max-width:630px)]:text-[12px]
      "
              >
                <span className="truncate">Visualizar Desafios</span>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Link
                href="#"
                className="
        inline-flex items-center justify-center
        shrink min-w-0 whitespace-nowrap
        rounded-full px-6 py-2.5
        bg-[#62D105] text-[#0B005E] font-semibold text-[13px]
        shadow-[0_6px_18px_rgba(0,0,0,0.15)] transition
        [@media(max-width:630px)]:px-4
        [@media(max-width:630px)]:py-2
        [@media(max-width:630px)]:text-[12px]
      "
              >
                <span className="truncate">Registre sua Startup</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
