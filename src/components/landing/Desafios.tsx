"use client";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      className="w-full text-white flex flex-col items-center py-12 px-6"
      style={{
        background: `
          linear-gradient(190deg, 
            #0C0668 0%, 
            #111C79 100%)
        `,
      }}
    >
      <div className="max-w-[1200px] w-full flex flex-col lg:flex-row items-center justify-between">
        {/* LADO ESQUERDO */}
        <div className="flex flex-col w-full lg:w-1/2 lg:mt-[-40px]">
          {/* TÍTULO */}
          <h1 className="text-[42px] font-semibold leading-snug mb-3">
            Submeta-se a desafios em <br />
            nossa plataforma e conecte-se
          </h1>

          {/* PARÁGRAFO */}
          <p className="text-[18px] text-gray-200 mb-6 leading-relaxed">
            Na nossa plataforma, os participantes podem enviar as ideias de forma
            prática através de um portal intuitivo.
          </p>

          {/* CARDS */}
<div className="flex flex-row gap-5 mb-2 flex-wrap">
  {[1, 2].map((i) => (
    <div
      key={i}
      className="relative text-[#00145A] bg-white rounded-2xl shadow-md p-5 w-[245px] h-[285px] flex flex-col justify-between border border-[#E6E6E6] overflow-hidden"
    >

      <div>
        <h2 className="text-[14px] font-semibold text-[#0A2A88] mb-2">
          Desafios de Agricultura
        </h2>
        <p className="text-[13px] text-[#6B7280] mb-1">
          Tech Solutions VLTDA
        </p>
        <p className="text-[12px] text-[#9CA3AF] mb-3">Autor desconhecido</p>
        <p className="text-[12px] text-[#9CA3AF] mb-1">Outro</p>
        <p className="text-[12px] text-[#9CA3AF] mb-1">Ideação</p>
        <p className="text-[12px] text-[#9CA3AF] mb-1">
          20/12/2025 - 20/12/2025
        </p>
        <p className="text-[12px] text-[#9CA3AF]">Público</p>
      </div>

      <Link
        href="#"
        className="block text-center bg-[#00145A] text-white text-[13px] font-semibold py-2 rounded-xl hover:opacity-90 transition"
      >
        Candidatar-se
      </Link>
    </div>
  ))}
</div>
</div>
        
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end lg:translate-y-[-30px]">
          <Image
            src="/images/reuniao.svg"
            alt="Equipe discutindo ideias"
            width={709.14}
            height={709.14}
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* BOTÕES CENTRALIZADOS ABAIXO DE TUDO */}
      <div className="flex justify-center gap-3">
        <Link
          href="#"
          className="bg-white text-[#00145A] font-semibold text-[14px] px-24 py-2.5 rounded-full hover:opacity-90 transition"
        >
          Visualizar Desafios
        </Link>
        <Link
          href="#"
          className="bg-[#00C853] text-white font-semibold text-[14px] px-24 py-2.5 rounded-full hover:opacity-90 transition"
        >
          Registre sua Startup
        </Link>
      </div>
    </section>
  );
}
