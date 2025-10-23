"use client";

import {
  FaRegImage,
  FaInstagram,
  FaWhatsapp,
  FaLinkedin,
  FaMapMarkedAlt,
  FaClipboardList,
} from "react-icons/fa";
import { Modal } from "../ui/modal";
import { Companie } from "@/mocks/CompaniesData";
import { X } from "lucide-react";
import { Challenge, challengesData } from "@/mocks/ChallengeData";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: Companie | null;
};

export default function CompaniesProfile({ data, isOpen, onClose }: Props) {
  const desafios: Challenge[] = challengesData.filter(
    (challenge) => challenge.companyId === data?.id
  );

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

            {/* Foto perfil */}
            <div className="absolute left-10 bottom-[-4rem] sm:bottom-[-5rem]">
              <div className="w-28 sm:w-36 h-28 sm:h-36 rounded-full bg-gray-100 dark:bg-gray-700 border-4 sm:border-8 border-white dark:border-gray-900 flex items-center justify-center shadow-md">
                <FaRegImage className="text-gray-500 dark:text-[#ced3db] text-4xl sm:text-5xl" />
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="flex flex-col lg:flex-row mt-20 sm:mt-24 px-5 sm:px-8 pb-8 gap-8">
            {/* Lado esquerdo */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-800">
                  {data?.name ?? "Nome da Empresa"}
                </h2>
              </div>

              <p className="text-gray-600 dark:text-[#ced3db] mt-3 text-sm sm:text-base">
                <strong>Descrição:</strong> {data?.description ?? "Sem descrição disponível"}
              </p>

              <div className="flex flex-wrap gap-3 mt-5">
                <span className="bg-gray-100 dark:bg-gray-800 text-blue-900 dark:text-[#ced3db] px-4 py-2 rounded-md text-sm font-medium">
                  Gestor: {data?.gestorEmail ?? "Desconhecido"}
                </span>
                <span className="bg-gray-100 dark:bg-gray-800 text-blue-900 dark:text-[#ced3db] px-4 py-2 rounded-md text-sm font-medium">
                  Área de Atuação: {data?.sector ?? "Não informado"}
                </span>
                <span className="bg-gray-100 dark:bg-gray-800 text-blue-900 dark:text-[#ced3db] px-4 py-2 rounded-md text-sm font-medium">
                  CNPJ: {data?.cnpj ?? "Não informado"}
                </span>
              </div>

              {/* Desafios */}
              <h3 className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-800 mt-8 sm:mt-10">
                Desafios da Empresa
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {desafios.length > 0 ? (
                  desafios.map((desafio) => (
                    <div
                      key={desafio.ChallengeTitle}
                      className="border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-[#ced3db]">
                            {desafio.Author}
                          </p>
                          <h2 className="text-lg font-bold text-blue-900 dark:text-blue-800">
                            {desafio.ChallengeTitle}
                          </h2>
                          <p className="text-blue-900 dark:text-[#ced3db] font-medium">
                            {desafio.Category}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-[#ced3db] mt-1">
                            Status:{" "}
                            <span className="text-green-500 font-medium">
                              {desafio.Status}
                            </span>
                          </p>
                        </div>
                        <FaClipboardList className="text-blue-900 dark:text-blue-800 text-xl" />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-[#ced3db] text-sm mt-2">
                    Nenhum desafio disponível.
                  </p>
                )}
              </div>
            </div>

            {/* Lado direito */}
            <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 pt-5 lg:pt-0 lg:pl-6 flex flex-col gap-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-800 mb-2">
                  Redes Sociais
                </h3>
                <div className="flex flex-col gap-2">
                  {[
                    { icon: FaInstagram, label: "Instagram" },
                    { icon: FaWhatsapp, label: "WhatsApp" },
                    { icon: FaLinkedin, label: "Linkedin" },
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
                <h3 className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-800 mb-2">
                  Localização Maps
                </h3>
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
