"use client";

import {
  FaRegImage,
  FaInstagram,
  FaWhatsapp,
  FaLinkedin,
  FaMapMarkedAlt,
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
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg w-full max-w-full sm:max-w-md md:max-w-3xl p-5 sm:p-8 lg:p-10 relative max-h-[90vh] overflow-auto">
          {/* Header */}
          <div className="relative h-48 sm:h-56 md:h-64 w-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
            <div className="absolute left-4 sm:left-12 -bottom-20 sm:-bottom-24">
              <div className="w-28 sm:w-36 h-28 sm:h-36 rounded-full bg-gray-100 dark:bg-gray-700 border-4 sm:border-8 border-white dark:border-gray-900 flex items-center justify-center shadow-md">
                <FaRegImage className="text-gray-500 dark:text-[#ced3db] text-4xl sm:text-5xl" />
              </div>
            </div>

            <div className="absolute left-20 top-4 sm:top-6 w-10 sm:w-12 h-10 sm:h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center shadow-md hover:bg-gray-200 dark:hover:bg-gray-600 transition">
              <FaRegImage className="text-gray-600 dark:text-[#ced3db] text-lg sm:text-xl" />
            </div>

            <button
              className="absolute right-4 sm:right-10 top-4 sm:top-6 w-10 sm:w-12 h-10 sm:h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center shadow-md hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              onClick={onClose}
            >
              <X className="text-gray-400 hover:text-gray-600 transition duration-400 hover:scale-[1.05] active:scale-[0.98]" size={20} />
            </button>
          </div>

          {/* Conteúdo */}
          <div className="flex flex-col lg:flex-row mt-28 lg:mt-12 gap-6">
            {/* Esquerda */}
            <div className="flex-1 px-2 sm:px-6">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-800">
                {data?.name}
              </h2>
              <p className="text-gray-600 dark:text-[#ced3db] mt-1 text-sm sm:text-base">{data?.description}</p>

              <div className="flex flex-wrap gap-2 sm:gap-3 mt-4">
                <span className="bg-gray-100 dark:bg-gray-800 text-blue-900 dark:text-[#ced3db] px-3 py-1 sm:px-4 sm:py-1 rounded-md text-xs sm:text-sm font-medium">
                  Gestor: {data?.gestorEmail}
                </span>
                <span className="bg-gray-100 dark:bg-gray-800 text-blue-900 dark:text-[#ced3db] px-3 py-1 sm:px-4 sm:py-1 rounded-md text-xs sm:text-sm font-medium">
                  Área de Atuação: {data?.sector}
                </span>
                <span className="bg-gray-100 dark:bg-gray-800 text-blue-900 dark:text-[#ced3db] px-3 py-1 sm:px-4 sm:py-1 rounded-md text-xs sm:text-sm font-medium">
                  CNPJ: {data?.cnpj}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-800 mt-8 sm:mt-10">
                Desafios
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-4">
                {desafios.map((desafio) => (
                  <div
                    key={desafio.ChallengeTitle}
                    className="border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 sm:p-5 relative shadow-sm hover:shadow-md transition"
                  >
                    <h4 className="font-semibold text-blue-900 dark:text-blue-800">{desafio.ChallengeTitle}</h4>
                    <p className="text-gray-600 dark:text-[#ced3db] text-sm">{desafio.Author}</p>
                    <ul className="mt-2 sm:mt-3 text-sm text-gray-700 dark:text-[#ced3db] space-y-1">
                      <li>🏷 {desafio.Category}</li>
                      <li>🟢 {desafio.Status}</li>
                      <li>📅 {desafio.Date}</li>
                    </ul>
                    <button className="absolute top-2 sm:top-3 right-2 sm:right-3 text-gray-500 dark:text-[#ced3db] hover:text-gray-700 dark:hover:text-gray-200">
                      ...
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Direita */}
            <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 p-4 sm:p-6 bg-white dark:bg-gray-900 flex flex-col gap-4">
              <h3 className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-800">Redes Sociais</h3>
              <div className="flex flex-col gap-2 sm:gap-3">
                {[
                  { icon: FaInstagram, label: "Instagram" },
                  { icon: FaWhatsapp, label: "WhatsApp" },
                  { icon: FaLinkedin, label: "Linkedin" },
                ].map(({ icon: Icon, label }) => (
                  <button key={label} className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-blue-900 dark:text-[#ced3db] px-3 py-2 rounded-md text-sm sm:text-base font-medium flex items-center justify-center transition gap-2">
                    <Icon /> <span>{label}</span>
                  </button>
                ))}
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-800 mt-6 sm:mt-10">Localização Maps</h3>
              <div className="mt-2 sm:mt-4 w-full h-36 sm:h-40 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-sm hover:shadow-md transition">
                <FaMapMarkedAlt className="text-blue-700 dark:text-blue-300 text-3xl sm:text-4xl" />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
