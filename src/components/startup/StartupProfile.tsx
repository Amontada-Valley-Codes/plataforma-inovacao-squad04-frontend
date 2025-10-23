"use client";
import React from "react";
import {
  FaClipboardList,
  FaEnvelope,
  FaInstagram,
  FaLinkedin,
  FaMapMarkedAlt,
  FaRegImage,
  FaRocket,
  FaWhatsapp,
} from "react-icons/fa";
import { Modal } from "../ui/modal";
import { X } from "lucide-react";
import { ShowAllStartupsResponse } from "@/api/payloads/startup.payload";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: ShowAllStartupsResponse;
};

export default function StartupProfile({ isOpen, onClose, data }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div
        className="
          bg-white dark:bg-gray-900 rounded-2xl shadow-lg 
          w-full max-w-full sm:max-w-md md:max-w-5xl 
          relative overflow-hidden max-h-[95vh] flex flex-col
        "
      >
        <div
          className="
            overflow-y-auto
            max-h-[95vh]
            [scrollbar-width:none]
            [-ms-overflow-style:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {/* Banner */}
          <div className="relative h-48 sm:h-56 md:h-64 w-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
            {/* Ícone de banner */}
            <FaRegImage className="text-gray-500 dark:text-[#ced3db] text-4xl sm:text-5xl" />

            {/* Botão fechar */}
            <button
              onClick={onClose}
              className="absolute right-4 sm:right-8 top-4 sm:top-6 w-10 sm:w-12 h-10 sm:h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center shadow-md hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              <X
                className="text-gray-400 hover:text-gray-600 transition duration-300 hover:scale-[1.05] active:scale-[0.98]"
                size={20}
              />
            </button>

            {/* Foto de perfil alinhada à esquerda */}
            <div className="absolute left-10 bottom-[-4rem] sm:bottom-[-5rem]">
              <div className="w-28 sm:w-36 h-28 sm:h-36 rounded-full bg-gray-100 dark:bg-gray-700 border-4 sm:border-8 border-white dark:border-gray-900 flex items-center justify-center shadow-md">
                <FaRegImage className="text-gray-500 dark:text-[#ced3db] text-4xl sm:text-5xl" />
              </div>
            </div>
          </div>

          {/* Conteúdo principal */}
          <div className="flex flex-col lg:flex-row mt-20 sm:mt-24 px-5 sm:px-8 pb-8 gap-8">
            {/* Lado esquerdo */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-800">
                  {data?.name ?? "Nome da Startup"}
                </h2>
                <button className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-blue-900 dark:text-[#ced3db] px-4 py-2 rounded-md text-sm sm:text-base font-medium transition">
                  Baixar Pitch
                </button>
              </div>

              <p className="text-gray-600 dark:text-[#ced3db] mt-3 text-sm sm:text-base">
                <strong>Descrição:</strong> { "Sem descrição disponível"}
              </p>
              <p className="text-gray-600 dark:text-[#ced3db] mt-1 text-sm sm:text-base">
                <strong>Tecnologias Usadas:</strong> {data?.technologies_used ?? "Não informado"}
              </p>

              {/* Informações principais */}
              <div className="flex flex-wrap gap-3 mt-5">
                <span className="bg-gray-100 dark:bg-gray-800 text-blue-900 dark:text-[#ced3db] px-4 py-2 rounded-md text-sm font-medium">
                  Gestor: {data?.founders ?? "Desconhecido"}
                </span>
                <span className="bg-gray-100 dark:bg-gray-800 text-blue-900 dark:text-[#ced3db] px-4 py-2 rounded-md text-sm font-medium">
                  Área de Atuação: {data?.industry_segment ?? "Não informado"}
                </span>
                <span className="bg-gray-100 dark:bg-gray-800 text-blue-900 dark:text-[#ced3db] px-4 py-2 rounded-md text-sm font-medium">
                  CNPJ: {data?.cnpj ?? "Não informado"}
                </span>
              </div>

              {/* Cards métricas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-[#ced3db]">Posição</p>
                      <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-800">10</h2>
                      <p className="text-blue-900 dark:text-[#ced3db] font-medium">
                        Entre as startups mais utilizadas
                      </p>
                      <p className="text-sm text-gray-600 dark:text-[#ced3db] mt-1">
                        Subiu <span className="text-green-500 font-medium">2</span> posições esse mês
                      </p>
                    </div>
                    <FaRocket className="text-blue-900 dark:text-blue-800 text-xl" />
                  </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-[#ced3db]">Quantidade</p>
                      <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-800">150</h2>
                      <p className="text-blue-900 dark:text-[#ced3db] font-medium">Solicitações Resolvidas</p>
                      <p className="text-sm text-gray-600 dark:text-[#ced3db] mt-1">
                        <span className="text-green-500 font-medium">10%</span> desde o último mês
                      </p>
                    </div>
                    <FaClipboardList className="text-blue-900 dark:text-blue-800 text-xl" />
                  </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
                  <p className="text-sm text-gray-600 dark:text-[#ced3db] mb-2">Tecnologias</p>
                  <p className="text-blue-900 dark:text-[#ced3db]">
                    {data?.technologies_used ?? "React, Node.js, TypeScript"}
                  </p>
                </div>
              </div>
            </div>

            {/* Lado direito */}
            <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 pt-5 lg:pt-0 lg:pl-6 flex flex-col gap-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-800 mb-2">Redes Sociais</h3>
                <div className="flex flex-col gap-2">
                  {[
                    { icon: FaInstagram, label: "Instagram" },
                    { icon: FaWhatsapp, label: "WhatsApp" },
                    { icon: FaLinkedin, label: "Linkedin" },
                    { icon: FaEnvelope, label: "E-mail" },
                  ].map(({ icon: Icon, label }) => (
                    <button
                      key={label}
                      className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-blue-900 dark:text-[#ced3db] px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition"
                    >
                      <Icon /> {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-800 mb-2">Localização Maps</h3>
                <div className="w-full h-36 sm:h-40 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-sm hover:shadow-md transition">
                  <FaMapMarkedAlt className="text-blue-700 dark:text-blue-800 text-3xl sm:text-4xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
