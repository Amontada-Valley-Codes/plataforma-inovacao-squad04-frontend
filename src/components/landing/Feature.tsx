"use client";
import Image from "next/image";

export default function FeaturesSection() {
  return (
    <section className="w-full px-6 md:px-16 py-16 bg-gradient-to-b from-[#0C0668] to-[#111C79] text-white">
      <div className="max-w-6xl mx-auto">
        {/* Título centralizado e em linha única */}
        <h2 className="text-center text-4xl md:text-4xl lg:text-[2.8rem] font-semibold mb-14 leading-snug">
          Tudo o que o <span className="font-bold">PIAC</span> oferece para transformar ideias em resultados
        </h2>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Texto */}
          <div className="md:w-1/2 flex flex-col justify-center gap-6">
            <div className="flex flex-col gap-4 mt-4 text-lg">
              <div>
                <h3 className="font-semibold text-3xl">Dashboard de Inovação</h3>
                <p className="text-gray-300 text-xl">Painel de métricas e relatórios.</p>
              </div>
              <div>
                <h3 className="font-semibold text-3xl">Desafios corporativos</h3>
                <p className="text-gray-300 text-xl">Usuários lançam desafios reais.</p>
              </div>
              <div>
                <h3 className="font-semibold text-3xl">Kanban de desafios</h3>
                <p className="text-gray-300 text-xl">Centralização de ideias e soluções.</p>
              </div>
              <div>
                <h3 className="font-semibold text-3xl">Match de Startups</h3>
                <p className="text-gray-300 text-xl">Conecta corporações a startups.</p>
              </div>
            </div>
          </div>

          {/* Imagens */}
          <div className="md:w-1/2 grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg flex justify-center items-center p-4">
              <Image
                src="/images/desktop.svg"
                alt="Dashboard de Inovação"
                width={200}
                height={150}
                className="object-contain"
              />
            </div>
            <div className="bg-white rounded-xl overflow-hidden shadow-lg flex justify-center items-center p-4">
              <Image
                src="/images/desafios.svg"
                alt="Desafios corporativos"
                width={200}
                height={150}
                className="object-contain"
              />
            </div>
            <div className="bg-white rounded-xl overflow-hidden shadow-lg flex justify-center items-center p-4">
              <Image
                src="/images/kanban.svg"
                alt="Kanban de desafios"
                width={200}
                height={150}
                className="object-contain"
              />
            </div>
            <div className="bg-white rounded-xl overflow-hidden shadow-lg flex justify-center items-center p-4">
              <Image
                src="/images/conexoes.svg"
                alt="Match de Startups"
                width={200}
                height={150}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
