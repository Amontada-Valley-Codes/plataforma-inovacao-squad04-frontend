"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChallengeService } from "@/api/services/challenge.service";

interface PublicChallengeCard {
    id: string;
    name: string;
    enterpriseName: string;
    startDate?: string;
    endDate: string;
    status: string;
    visibility: string;
}

export default function ChallengesPublicos() {
    const [challenges, setChallenges] = useState<PublicChallengeCard[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadChallenges() {
            try {
                const data = await ChallengeService.showAllPublicChallenges();
                const ui: PublicChallengeCard[] = (Array.isArray(data) ? data : []).map((c) => ({
                    id: c.id,
                    name: c.name,
                    enterpriseName: c.Enterprise?.name ?? "",
                    startDate: c.startDate,
                    endDate: c.endDate,
                    status: c.status,
                    visibility: c.visibility,
                }));
                setChallenges(ui);
            } catch (e) {
                console.error("Erro ao buscar desafios públicos:", e);
                setChallenges([]);
            } finally {
                setLoading(false);
            }
        }

        loadChallenges();
    }, []);

    return (
        <section className="min-h-screen w-full text-white">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center text-[#0B005E]"
            >
                Desafios Públicos
            </motion.h1>

            {loading ? (
                <p className="text-gray-500 text-center">Carregando desafios...</p>
            ) : challenges.length === 0 ? (
                <p className="text-gray-500 text-center">
                    Nenhum desafio público disponível no momento.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {challenges.map((challenge) => (
                        <motion.div
                            key={challenge.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="bg-[#0B005E]/90 text-white rounded-2xl shadow-lg p-6 
                            border border-white/10 backdrop-blur-sm hover:bg-[#1A26B8]/90 
                            transition-all duration-300"
                            >
                            <h2 className="text-lg font-semibold mb-2">{challenge.name}</h2>

                            {challenge.enterpriseName && (
                                <p className="text-[#62D105] text-sm font-medium mb-2">
                                    {challenge.enterpriseName}
                                </p>
                            )}

                            <div className="text-sm text-gray-200 space-y-1">
                                <p>
                                    <span className="font-medium text-white">Início:</span>{" "}
                                    {challenge.startDate
                                        ? new Date(challenge.startDate).toLocaleDateString("pt-BR")
                                        : "—"}
                                </p>
                                <p>
                                    <span className="font-medium text-white">Fim:</span>{" "}
                                    {new Date(challenge.endDate).toLocaleDateString("pt-BR")}
                                </p>
                            </div>

                            <p className="text-xs text-gray-400 mt-3 capitalize">
                                {challenge.status} • {challenge.visibility}
                            </p>
                        </motion.div>
                    ))}
                </div>
            )}
        </section>
    );
}
