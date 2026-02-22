"use client";

import { useMemo, useState, useEffect, Dispatch, SetStateAction } from "react";
import StatusReportEmailSection from "./StatusReportEmail";
import StatusReportSendHistory, { SendHistoryItem } from "./StatusReportSendHistory";
import { statusReportService } from "@/api/services/statusReport.service";

type StatusReportPoCProps = {
  challengeId: string;
  responsibleName?: string;
  avancosSemana: Entry
  proximosPassos: Entry
  problemasEncontrados: Entry
  setAvancosSemana: Dispatch<SetStateAction<Entry>>
  setProximosPassos: Dispatch<SetStateAction<Entry>>
  setProblemasEncontrados: Dispatch<SetStateAction<Entry>>
  statusReportId: string | null
  setStatusReportId: Dispatch<SetStateAction<string | null>>
};

export type Entry = {
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

export default function StatusReportPoC({ 
  challengeId, 
  responsibleName,
  avancosSemana,
  problemasEncontrados,
  proximosPassos,
  setAvancosSemana,
  setProblemasEncontrados,
  setProximosPassos, 
  setStatusReportId,
  statusReportId,
}: StatusReportPoCProps) {
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
        onSent={(item: SendHistoryItem) =>
          setSendHistory((prev) => [item, ...prev])
        }
      />

      <StatusReportSendHistory items={sendHistory} />
    </div>
  );
}