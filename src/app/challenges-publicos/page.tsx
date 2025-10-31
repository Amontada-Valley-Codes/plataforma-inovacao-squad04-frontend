/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tag, Calendar, Eye, EyeOff, MoreHorizontal, User as UserIcon } from "lucide-react";
import { ChallengeService } from "@/api/services/challenge.service";

interface PublicChallengeCard {
    id: string;
    name: string;
    enterpriseName: string;
    startDate?: string;
    endDate: string;
    status: string;
    visibility: string;

    // opcionais (se vierem do backend)
    area?: string;
    authorName?: string;
}

const typeTranslations: Record<string, string> = {
    TECHNOLOGY: "Tecnologia",
    HEALTH: "Saúde",
    EDUCATION: "Educação",
    ENVIRONMENT: "Meio Ambiente",
    BUSINESS: "Negócios",
    SOCIAL: "Social",
    ENGINEERING: "Engenharia",
    AGRICULTURE: "Agricultura",
    DESIGN: "Design",
    OTHER: "Outro",
};

const stageTranslations: Record<string, string> = {
    GENERATION: "Desafio",
    PRE_SCREENING: "Pré-Triagem",
    IDEATION: "Ideação",
    DETAILED_SCREENING: "Triagem detalhada",
    EXPERIMENTATION: "Experimentação",
    APPROVE: "Aprovado",
    DISAPPROVE: "Reprovado",
};

export default function ChallengesPublicos() {
    const [challenges, setChallenges] = useState<PublicChallengeCard[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadChallenges() {
            try {
                const data = await ChallengeService.showAllPublicChallenges();
                const ui: PublicChallengeCard[] = (Array.isArray(data) ? data : []).map((c: any) => ({
                    id: c.id,
                    name: c.name,
                    enterpriseName: c?.Enterprise?.name ?? "Empresa não informada",
                    startDate: c.startDate,
                    endDate: c.endDate,
                    status: c.status,
                    visibility: c.visibility,
                    area: c.area ?? c.type ?? "OTHER",
                    authorName: c?.Users?.name ?? c?.authorName ?? undefined,
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

    const StagePill = ({ status }: { status: string }) => {
        const label = stageTranslations[status] || status;
        const color =
            status === "EXPERIMENTATION"
                ? "bg-indigo-100 text-indigo-700"
                : status === "IDEATION"
                    ? "bg-amber-100 text-amber-700"
                    : status === "PRE_SCREENING" || status === "DETAILED_SCREENING"
                        ? "bg-blue-100 text-blue-700"
                        : status === "APPROVE"
                            ? "bg-emerald-100 text-emerald-700"
                            : status === "DISAPPROVE"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-gray-100 text-gray-700";

        return (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
                <span className="mr-1 block w-1.5 h-1.5 rounded-full bg-current/70" />
                {label}
            </span>
        );
    };

    return (
        <section className="min-h-screen w-full">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-start text-[#0B005E]"
            >
                Desafios Públicos
            </motion.h1>

            {loading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full p-2 justify-items-center sm:justify-items-stretch">

                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                            <div className="h-1.5 w-full bg-gradient-to-r from-[#15358D]/60 via-[#15358D]/20 to-transparent" />
                            <div className="p-4 space-y-3">
                                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                                <div className="h-3 w-1/2 bg-gray-200 rounded" />
                                <div className="h-3 w-2/3 bg-gray-200 rounded" />
                                <div className="h-3 w-1/3 bg-gray-200 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : challenges.length === 0 ? (
                <p className="text-gray-500 text-center">Nenhum desafio público disponível no momento.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full p-2">
                    {challenges.map((challenge) => {
                        const isPublic = (challenge.visibility || "").toLowerCase() === "public";
                        const areaLabel = typeTranslations[challenge.area ?? "OTHER"] || "Outro";
                        const author = challenge.authorName || "Autor desconhecido";

                        return (
                            <motion.div
                                key={challenge.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="border border-gray-200 bg-white rounded-xl overflow-hidden hover:scale-[1.01] 
transition-transform shadow-sm hover:shadow-md w-full max-w-[360px] sm:max-w-none"
                            >
                                {/* Barra superior com gradiente */}
                                <div className="h-1.5 w-full bg-gradient-to-r from-[#15358D]/85 via-[#15358D]/35 to-[#15358D]/10" />

                                <div className="p-4 flex flex-col gap-3">
                                    {/* ---- ORDEM IGUAL AO CARD-ALVO ---- */}

                                    {/* 1) Nome */}
                                    <h2
                                        title={challenge.name}
                                        className="text-[15px] font-semibold text-[#15358D] leading-snug truncate"
                                    >
                                        {challenge.name}
                                    </h2>

                                    {/* 2) Empresa */}
                                    <p className="text-gray-500 text-sm truncate">{challenge.enterpriseName}</p>

                                    {/* 3) Autor */}
                                    <p className="text-gray-500 text-sm flex items-center gap-1 truncate">
                                        <UserIcon size={14} className="text-gray-400" />
                                        {author}
                                    </p>

                                    {/* 4) Categoria */}
                                    <div className="flex items-center gap-2 text-[13px] text-gray-600">
                                        <Tag size={15} />
                                        <span className="truncate">{areaLabel}</span>
                                    </div>

                                    {/* 5) Estágio (tradução de status) */}
                                    <div className="flex items-center gap-2 text-[13px] text-gray-600">
                                        <StagePill status={challenge.status} />
                                    </div>

                                    {/* 6) Datas */}
                                    <div className="flex items-center gap-2 text-[13px] text-gray-600">
                                        <Calendar size={15} />
                                        <span className="truncate">
                                            {(challenge.startDate ? new Date(challenge.startDate) : null)?.toLocaleDateString("pt-BR") || "—"}{" "}
                                            - {new Date(challenge.endDate).toLocaleDateString("pt-BR")}
                                        </span>
                                    </div>

                                    {/* 7) Visibilidade */}
                                    <div className="text-[13px] text-gray-600 flex items-center gap-1">
                                        {isPublic ? (
                                            <>
                                                <Eye size={16} /> Público
                                            </>
                                        ) : (
                                            <>
                                                <EyeOff size={16} /> Privado
                                            </>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
