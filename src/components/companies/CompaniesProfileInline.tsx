"use client";

import {
    FaRegImage,
    FaInstagram,
    FaWhatsapp,
    FaLinkedin,
    FaMapMarkedAlt,
} from "react-icons/fa";
import { Companie } from "@/mocks/CompaniesData";
import { Challenge, challengesData } from "@/mocks/ChallengeData";

type Props = { data: Companie | null };

export default function CompaniesProfileInline({ data }: Props) {
    if (!data) return null;

    const desafios: Challenge[] = challengesData.filter(
        (challenge) => challenge.companyId === data?.id
    );

    return (
        // mesmo “respiro” do modal: p-5 lg:p-10 e centralizado
        <div className="flex items-center justify-center p-5 lg:p-10">
            {/* mesmo card interno do modal: w-[80vw] + rounded + shadow */}
            <div className="w-[80vw] rounded-2xl shadow-md overflow-hidden bg-white dark:bg-gray-900">
                {/* Header (mesmas classes que você gostou) */}
                <div className="relative h-45 w-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                    <div className="absolute left-12 -bottom-24">
                        <div className="w-36 h-36 rounded-full bg-gray-100 dark:bg-gray-700 border-8 border-white dark:border-gray-900 flex items-center justify-center shadow-md">
                            <FaRegImage className="text-gray-500 dark:text-[#ced3db] text-5xl" />
                        </div>
                    </div>

                    <div className="absolute left-20 top-6 w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center shadow-md hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                        <FaRegImage className="text-gray-600 dark:text-[#ced3db] text-xl" />
                    </div>
                    {/* sem botão X no inline */}
                </div>

                <div className="flex flex-col lg:flex-row">
                    {/* Esquerda */}
                    <div className="flex-1 px-12 mt-28">
                        <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-800">
                            {data?.nome}
                        </h2>
                        <p className="text-gray-600 dark:text-[#ced3db] mt-1">{data?.descricao}</p>

                        <div className="flex flex-wrap gap-3 mt-4">
                            <span className="bg-gray-100 dark:bg-gray-800 text-blue-900 dark:text-[#ced3db] px-4 py-1 rounded-md text-sm font-medium">
                                Gestor: {data?.gestor}
                            </span>
                            <span className="bg-gray-100 dark:bg-gray-800 text-blue-900 dark:text-[#ced3db] px-4 py-1 rounded-md text-sm font-medium">
                                Área de Atuação: {data?.areaAtuacao}
                            </span>
                            <span className="bg-gray-100 dark:bg-gray-800 text-blue-900 dark:text-[#ced3db] px-4 py-1 rounded-md text-sm font-medium">
                                CNPJ: {data?.cnpj}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-blue-900 dark:text-blue-800 mt-10">
                            Desafios
                        </h3>
                        <div className="grid md:grid-cols-3 gap-6 mt-4">
                            {desafios.map((desafio) => (
                                <div
                                    key={desafio.ChallengeTitle}
                                    className="border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 relative shadow-sm hover:shadow-md transition"
                                >
                                    <h4 className="font-semibold text-blue-900 dark:text-blue-800">
                                        {desafio.ChallengeTitle}
                                    </h4>
                                    <p className="text-gray-600 dark:text-[#ced3db] text-sm">
                                        {desafio.Author}
                                    </p>
                                    <ul className="mt-3 text-sm text-gray-700 dark:text-[#ced3db] space-y-1">
                                        <li>🏷 {desafio.Category}</li>
                                        <li>🟢 {desafio.Status}</li>
                                        <li>📅 {desafio.Date}</li>
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Direita */}
                    <div className="w-full lg:w-96 border-l border-gray-200 dark:border-gray-800 p-8 bg-white dark:bg-gray-900">
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
                        </div>

                        <h3 className="text-lg font-bold text-blue-900 dark:text-blue-800 mt-10">
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
