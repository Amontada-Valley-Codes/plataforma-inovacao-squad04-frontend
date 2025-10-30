"use client";
import Image from "next/image";
import { motion, cubicBezier, type Variants } from "framer-motion";

export default function FeaturesSection() {
  // Easing compatível com FM v11
  const ease = cubicBezier(0.22, 1, 0.36, 1);

  // Variants para animações suaves
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
  };

  const stagger: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
  };

  return (
    <section
      id="resumo"
      className="
        w-full text-white
        px-5 sm:px-8 md:px-12 lg:px-16
        py-12 sm:py-14 md:py-16
        bg-gradient-to-b from-[#0C0668] to-[#111C79]
      "
    >
      <motion.div
        className="max-w-6xl mx-auto transform scale-[0.98] md:scale-[0.95] origin-center"
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Título com fade-up */}
        <motion.h2
          variants={fadeUp}
          className="
            text-center font-semibold leading-snug text-balance
            text-[clamp(1.6rem,3.2vw,2.8rem)]
            mb-8 sm:mb-10 md:mb-14
          "
        >
          Da ideia a solução: veja o que a PIAC proporciona
        </motion.h2>

        <div className="flex flex-col md:flex-row gap-8 sm:gap-10 md:gap-12">
          {/* Texto */}
          <motion.div
            variants={fadeUp}
            className="md:w-1/2 flex flex-col justify-center gap-5 sm:gap-6"
          >
            <div className="flex flex-col gap-4 sm:gap-5 mt-2 sm:mt-3 md:mt-4 text-base sm:text-lg">
              {[
                {
                  title: "Dashboard de Inovação",
                  text: "Acompanhe métricas, relatórios e resultados em tempo real.",
                },
                {
                  title: "Desafios corporativos",
                  text: "Lance desafios reais e envolva colaboradores e startups na busca por soluções.",
                },
                {
                  title: "Kanban de desafios",
                  text: "Centralize ideias, acompanhe o progresso e gere colaboração em todas as etapas.",
                },
                {
                  title: "Match de Startups",
                  text: "Encontre as startups ideais para resolver os desafios do seu negócio.",
                },
              ].map((item, index) => (
                <motion.div key={index} variants={fadeUp}>
                  <h3 className="font-semibold text-2xl sm:text-[26px] md:text-3xl">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 text-[15px] sm:text-base md:text-xl">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Imagens com animação independente */}
          <motion.div
            variants={stagger}
            className="md:w-1/2 grid grid-cols-2 gap-4 sm:gap-5 md:gap-6"
          >
            {[
              { src: "/images/desktop.svg", alt: "Dashboard de Inovação" },
              { src: "/images/desafios.svg", alt: "Desafios corporativos" },
              { src: "/images/kanban.svg", alt: "Kanban de desafios" },
              { src: "/images/conexoes.svg", alt: "Match de Startups" },
            ].map((img, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3, ease }}
                className="bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-lg flex justify-center items-center p-3 sm:p-4"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={200}
                  height={150}
                  className="object-contain w-full h-auto max-w-[160px] sm:max-w-[200px]"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
