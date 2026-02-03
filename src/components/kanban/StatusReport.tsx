"use client"

import { useMemo, useState } from "react";

type StatusReportPoCProps = {
    responsibleName?: string;
}

type Entry = {
    text: string;
    createdAt: string; 
    responsible: string;
}

const MAX_CHARS = 600;

export default function StatusReportPoC({ responsibleName }: StatusReportPoCProps) {
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

    const Section = ({
        title,
        value,
        onChange,
        metaInfo,
    }: {
        title: string;
        value: string;
        onChange: (v: string) => void;
        metaInfo: { createdAtLabel: string; responsibleLabel: string };
    }) => (
        <div className="flex flex-col mb-6">
        <div className="flex items-center justify-between mb-2">
            <h2 className="text-black dark:text-white text-lg font-semibold">{title}</h2>
            <span className="text-xs text-[#98A2B3] dark:text-white/50">
            {value.length}/{MAX_CHARS}
            </span>
        </div>

        <div className="flex-1 flex rounded-lg border px-3 py-2 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
            <textarea
            rows={5}
            maxLength={MAX_CHARS}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Escreva aqui…"
            className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3] dark:placeholder:text-white resize-none"
            />
        </div>

        <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-[#98A2B3] dark:text-white/50">
            Data: <span className="font-medium">{metaInfo.createdAtLabel}</span>
            </p>
            <p className="text-xs text-[#98A2B3] dark:text-white/50">
            Responsável: <span className="font-medium">{metaInfo.responsibleLabel}</span>
            </p>
        </div>
        </div>
    );

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

    return (
        <div className="flex flex-col">
        <h1 className="text-[24px] text-[#0B2B70] dark:text-white font-semibold mb-4">
            Status Report da PoC
        </h1>

        <Section
            title="Avanços da semana"
            value={avancosSemana.text}
            onChange={(v) => updateRegister(setAvancosSemana, v)}
            metaInfo={meta.weekly}
        />

        <Section
            title="Problemas encontrados"
            value={problemasEncontrados.text}
            onChange={(v) => updateRegister(setProblemasEncontrados, v)}
            metaInfo={meta.problems}
        />

        <Section
            title="Próximos passos"
            value={proximosPassos.text}
            onChange={(v) => updateRegister(setProximosPassos, v)}
            metaInfo={meta.next}
        />
        </div>
    );
}
