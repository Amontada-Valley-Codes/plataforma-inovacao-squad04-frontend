"use client";

import {
  FaRegImage,
  FaInstagram,
  FaWhatsapp,
  FaLinkedin,
  FaMapMarkedAlt,
  FaEnvelope,
  FaRocket,
  FaClipboardList,
} from "react-icons/fa";

export default function StartupPage() {
  return (
    <div className="flex">
      <div className="w-full rounded-2xl shadow-md overflow-hidden bg-white dark:bg-gray-900">

        <div className="relative h-45 w-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
          <div className="absolute left-12 -bottom-24">
            <div className="w-36 h-36 rounded-full bg-gray-100 dark:bg-gray-700 border-8 border-white dark:border-gray-900 flex items-center justify-center shadow-md">
              <FaRegImage className="text-gray-500 dark:text-[#ced3db] text-5xl" />
            </div>
          </div>

          <div className="absolute right-10 top-6 w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center shadow-md hover:bg-gray-200 dark:hover:bg-gray-600 transition">
            <FaRegImage className="text-gray-600 dark:text-[#ced3db] text-xl" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">

          <div className="flex-1 px-12 mt-24">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-800">
                Nome da Startup
              </h2>
              <button className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-blue-900 dark:text-[#ced3db] px-4 py-1 rounded-md text-sm font-medium transition">
                Baixar Pitch
              </button>
            </div>

            <p className="text-gray-600 dark:text-[#ced3db] mt-1">Descrição:</p>
            <p className="text-gray-600 dark:text-[#ced3db] mt-1">
              Tecnologias Usadas:
            </p>

            <div className="flex flex-wrap gap-3 mt-4">
              <span className="bg-gray-100 dark:bg-gray-800 text-blue-900 dark:text-[#ced3db] px-4 py-1 rounded-md text-sm font-medium">
                Gestor: Fulano Fulano
              </span>
              <span className="bg-gray-100 dark:bg-gray-800 text-blue-900 dark:text-[#ced3db] px-4 py-1 rounded-md text-sm font-medium">
                Área de Atuação: Fulano de Tal
              </span>
              <span className="bg-gray-100 dark:bg-gray-800 text-blue-900 dark:text-[#ced3db] px-4 py-1 rounded-md text-sm font-medium">
                CNPJ: 00.000.000/0000-00
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-[#ced3db]">
                      Posição
                    </p>
                    <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-800">
                      10
                    </h2>
                    <p className="text-blue-900 dark:text-[#ced3db] font-medium">
                      Entre as startups mais utilizadas
                    </p>
                    <p className="text-sm text-gray-600 dark:text-[#ced3db] mt-1">
                      Subiu{" "}
                      <span className="text-green-500 font-medium">2</span>{" "}
                      posições esse mês
                    </p>
                  </div>
                  <FaRocket className="text-blue-900 dark:text-blue-800 text-2xl" />
                </div>
              </div>

              <div className="border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-[#ced3db]">
                      Quantidade
                    </p>
                    <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-800">
                      150
                    </h2>
                    <p className="text-blue-900 dark:text-[#ced3db] font-medium">
                      Solicitações Resolvidas
                    </p>
                    <p className="text-sm text-gray-600 dark:text-[#ced3db] mt-1">
                      <span className="text-green-500 font-medium">10%</span>{" "}
                      Desde o último mês
                    </p>
                  </div>
                  <FaClipboardList className="text-blue-900 dark:text-blue-800 text-2xl" />
                </div>
              </div>

              <div className="border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <p className="text-sm text-gray-600 dark:text-[#ced3db]">
                  Tecnologias
                </p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-96 border-l border-gray-200 dark:border-gray-800 p-7 bg-white dark:bg-gray-900">
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-800">
              Redes Sociais
            </h3>
            <div className="flex flex-col gap-3 mt-3">
              <button className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-blue-900 dark:text-[#ced3db] px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center transition">
                <FaInstagram /> <span className="ml-2">Instagram</span>
              </button>
              <button className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-blue-900 dark:text-[#ced3db] px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center transition">
                <FaWhatsapp /> <span className="ml-2">WhatsApp</span>
              </button>
              <button className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-blue-900 dark:text-[#ced3db] px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center transition">
                <FaLinkedin /> <span className="ml-2">Linkedin</span>
              </button>
              <button className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-blue-900 dark:text-[#ced3db] px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center transition">
                <FaEnvelope /> <span className="ml-2">E-mail</span>
              </button>
            </div>

            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-800 mt-3">
              Localização Maps
            </h3>
            <div className="mt-4 w-full h-40 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-sm hover:shadow-md transition">
              <FaMapMarkedAlt className="text-blue-700 dark:text-blue-300 text-4xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
