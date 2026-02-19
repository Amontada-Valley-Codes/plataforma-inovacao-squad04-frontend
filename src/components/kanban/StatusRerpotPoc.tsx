"use client";

import { useMemo, useState, useEffect } from "react";
import StatusReportEmailSection from "./StatusReportEmail";
import StatusReportSendHistory, { SendHistoryItem } from "./StatusReportSendHistory";
import { statusReportService } from "@/api/services/statusReport.service";

type StatusReportPoCProps = {
    challengeId: string;
    responsibleName?: string;
};

type Entry = {
    text: string;
    createdAt: string;
    responsible: string;
};

const MAX_CHARS = 600;

type SectionProps = {
    title: string;
    value: string;
    onChange: (v: string) => void;
    metaInfo: { createdAtLabel: string; responsibleLabel: string };
    placeholder: string;
};

function Section({ title, value, onChange, placeholder }: SectionProps) {
    return (
        <div className="flex flex-col mb-6">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-[#0B2B70] dark:text-white font-semibold">{title}</h2>
            </div>

            <div className="flex-1 flex rounded-lg border px-3 py-2 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
                <textarea
                    rows={5}
                    maxLength={MAX_CHARS}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder ?? "Escreva aqui..."}
                    className="w-full bg-transparent text-sm outline-none text-black/80 dark:text-white placeholder:text-[#98A2B3] resize-none"
                />
            </div>

            <span className="text-xs text-[#98A2B3] dark:text-white/50 self-end mt-2">
                {value.length}/{MAX_CHARS}
            </span>
        </div>
    );
}

export default function StatusReportPoC({ challengeId, responsibleName }: StatusReportPoCProps) {
    const [avancosSemana, setAvancosSemana] = useState<Entry>({
        text: "",
        createdAt: new Date().toISOString(),
        responsible: responsibleName ?? "",
    });

    const [problemasEncontrados, setProblemasEncontrados] = useState<Entry>({
        text: "",
        createdAt: new Date().toISOString(),
        responsible: responsibleName ?? "",
    });

    const [proximosPassos, setProximosPassos] = useState<Entry>({
        text: "",
        createdAt: new Date().toISOString(),
        responsible: responsibleName ?? "",
    });

    const [statusReportId, setStatusReportId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [sendHistory, setSendHistory] = useState<SendHistoryItem[]>([]);

    const [saveError, setSaveError] = useState<string | null>(null);

    const formatDateTime = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleString("pt-BR");
    };

    const meta = useMemo(() => {
        const buildMeta = (e: Entry) => ({
            createdAtLabel: formatDateTime(e.createdAt),
            responsibleLabel: e.responsible?.trim() ? e.responsible : "—",
        });

        return {
            weekly: buildMeta(avancosSemana),
            problems: buildMeta(problemasEncontrados),
            next: buildMeta(proximosPassos),
        };
    }, [avancosSemana, problemasEncontrados, proximosPassos]);

    const updateRegister = (
        setter: (updater: (prev: Entry) => Entry) => void,
        text: string
    ) => {
        setter((prev) => ({
            ...prev,
            text,
            createdAt: prev.text === "" && text.trim() ? new Date().toISOString() : prev.createdAt,
            responsible: prev.responsible,
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveError(null);

        try {
            const payload = {
                advances_of_the_Week: avancosSemana.text.trim(),
                problemsFound: problemasEncontrados.text.trim(),
                nextSteps: proximosPassos.text.trim(),
            };


            if (statusReportId) {

                const updated = await statusReportService.updateStatus(
                    statusReportId,
                    payload
                );

                setStatusReportId(updated.id);

            } else {

                const created = await statusReportService.createStatus(
                    challengeId,
                    payload
                );

                setStatusReportId(created.id);

            }
        } catch (err: any) {
            console.log("CREATE STATUS REPORT ERROR DATA:", err?.response?.data);

            const msg =
                err?.response?.data?.message
                    ? Array.isArray(err.response.data.message)
                        ? err.response.data.message.join(", ")
                        : err.response.data.message
                    : err?.response?.data?.error
                        ? err.response.data.error
                        : err?.message ?? "Falha ao salvar o status report.";

            setSaveError(msg);
        }
        finally {
            setIsSaving(false);
        }
    };


    const canSave =
        !!avancosSemana.text.trim() ||
        !!problemasEncontrados.text.trim() ||
        !!proximosPassos.text.trim();


    useEffect(() => {
        async function loadStatusReport() {
            try {
                const allReports = await statusReportService.showStatus();

                const report = allReports
                    .filter(r => r.challengeId === challengeId)
                    .sort((a, b) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    )[0];

                if (!report) return;

                setStatusReportId(report.id);

                setAvancosSemana({
                    text: report.advances_of_the_Week ?? "",
                    createdAt: report.createdAt,
                    responsible: responsibleName ?? "",
                });

                setProblemasEncontrados({
                    text: report.problemsFound ?? "",
                    createdAt: report.createdAt,
                    responsible: responsibleName ?? "",
                });

                setProximosPassos({
                    text: report.nextSteps ?? "",
                    createdAt: report.createdAt,
                    responsible: responsibleName ?? "",
                });

            } catch (err) {
                console.error("Erro ao carregar status report:", err);
            }
        }

    loadStatusReport();
}, [challengeId, responsibleName]);

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-[24px] text-[#0B2B70] dark:text-white font-semibold">
                    Relatório de Progresso
                </h1>

                <button
                    type="button"
                    onClick={handleSave}
                    disabled={!canSave || isSaving}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${!canSave || isSaving
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-800 dark:text-white/40"
                        : "bg-[#0B2B70] hover:bg-[#09245e] text-white"
                        }`}
                >
                    {isSaving ? "Salvando..." : statusReportId ? "Salvar" : "Salvar"}
                </button>
            </div>

            {saveError && (
                <p className="mb-4 text-sm text-red-600 dark:text-red-400">
                    {saveError}
                </p>
            )}

            <Section
                title="Avanços da semana"
                value={avancosSemana.text}
                onChange={(v: string) => updateRegister(setAvancosSemana, v)}
                metaInfo={meta.weekly}
                placeholder="O que mudou desde a última semana?"
            />

            <Section
                title="Problemas encontrados"
                value={problemasEncontrados.text}
                onChange={(v: string) => updateRegister(setProblemasEncontrados, v)}
                metaInfo={meta.problems}
                placeholder="Que problema apareceu e qual foi o impacto?"
            />

            <Section
                title="Próximos passos"
                value={proximosPassos.text}
                onChange={(v: string) => updateRegister(setProximosPassos, v)}
                metaInfo={meta.next}
                placeholder="Qual é o próximo passo e quem vai assumir?"
            />

            <StatusReportEmailSection
                statusReportId={statusReportId ?? undefined}
                avancos={avancosSemana.text}
                problemas={problemasEncontrados.text}
                proximosPassos={proximosPassos.text}
                responsibleName={responsibleName}
                onSent={(item: SendHistoryItem) => setSendHistory((prev) => [item, ...prev])}
            />

            <StatusReportSendHistory items={sendHistory} />
        </div>
    );
}
