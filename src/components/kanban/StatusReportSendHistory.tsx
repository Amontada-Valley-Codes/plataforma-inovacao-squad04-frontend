"use client";

import { useState } from "react";

export type SendHistoryItem = {
    id: string;
    reportId: string;
    sentAt: string;
    sentBy: string;
    mode: "MANUAL" | "AUTOMATICO";
    recipientsSnapshot: string[];
    status: "SENT" | "FAILED";
    errorMessage?: string;
    contentSnapshot: {
        avancos: string;
        problemas: string;
        proximosPassos: string;
    };
};

type Props = {
    items: SendHistoryItem[];
};

export default function StatusReportSendHistory({ items }: Props) {
    const [openPreview, setOpenPreview] = useState(false);
    const [selectedSend, setSelectedSend] = useState<SendHistoryItem | null>(null);

    const statusLabel: Record<SendHistoryItem["status"], string> = {
        SENT: "Enviado",
        FAILED: "Falhou",
    };

    return (
        <div className="mt-2 rounded-lg border border-[#E5E7EB] dark:border-gray-800 bg-[#F9FAFB] dark:bg-gray-900 p-3">
            <p className="text-sm text-[#667085] dark:text-white/60 font-medium mb-2">
                Histórico de relatórios enviados
            </p>

            {items.length === 0 ? (
                <p className="text-sm text-[#667085] dark:text-white/60">
                    Nenhum envio registrado.
                </p>
            ) : (
                <div className="flex flex-col gap-2">
                    {items.map((h) => (
                        <div
                            key={h.id}
                            className="flex items-start justify-between gap-3 rounded-md bg-white dark:bg-gray-950 border border-[#E5E7EB] dark:border-gray-800 p-3"
                        >
                            <div className="flex flex-col">
                                <span className="text-xs text-[#98A2B3] dark:text-white/50">
                                    {new Date(h.sentAt).toLocaleString("pt-BR")} • {h.sentBy} • {h.mode}
                                </span>

                                <span className="text-sm text-[#344054] dark:text-[#ced3db]">
                                    {h.recipientsSnapshot.length} destinatário(s)
                                </span>

                                {h.status === "FAILED" && (
                                    <span className="text-xs text-red-600 dark:text-red-400 mt-1">
                                        {h.errorMessage ?? "Falha ao enviar"}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedSend(h);
                                        setOpenPreview(true);
                                    }}
                                    className="rounded-lg border border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-xs font-semibold text-[#0B2B70] dark:text-white hover:bg-[#F9FAFB] dark:hover:bg-gray-800 transition-colors"
                                >
                                    Ver relatório
                                </button>

                                <span
                                    className={`text-xs font-semibold px-2 py-1 rounded-full ${h.status === "SENT"
                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                        }`}
                                >

                                    {statusLabel[h.status]}

                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal - Ver relatório enviado */}
            {openPreview && selectedSend && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                    onClick={() => {
                        setOpenPreview(false);
                        setSelectedSend(null);
                    }}
                >
                    <div
                        className="w-full max-w-2xl rounded-xl bg-white dark:bg-gray-950 border border-[#E5E7EB] dark:border-gray-800 p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex flex-col">
                                <h3 className="text-[#0B2B70] dark:text-white font-semibold">
                                    Relatório enviado
                                </h3>
                                <p className="text-xs text-[#98A2B3] dark:text-white/50">
                                    {new Date(selectedSend.sentAt).toLocaleString("pt-BR")} •{" "}
                                    {selectedSend.sentBy} • {selectedSend.mode}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setOpenPreview(false);
                                    setSelectedSend(null);
                                }}
                                className="text-sm font-semibold text-[#667085] dark:text-white/60 hover:text-[#0B2B70] dark:hover:text-white"
                            >
                                Fechar ✕
                            </button>
                        </div>

                        <div className="rounded-lg border border-[#E5E7EB] dark:border-gray-800 bg-[#F9FAFB] dark:bg-gray-900 p-3 text-sm text-[#344054] dark:text-[#ced3db] whitespace-pre-wrap">
                            <p className="font-semibold mb-1">Avanços</p>
                            <p className="mb-3">{selectedSend.contentSnapshot.avancos?.trim() || "—"}</p>

                            <p className="font-semibold mb-1">Problemas</p>
                            <p className="mb-3">
                                {selectedSend.contentSnapshot.problemas?.trim() || "—"}
                            </p>

                            <p className="font-semibold mb-1">Próximos passos</p>
                            <p>{selectedSend.contentSnapshot.proximosPassos?.trim() || "—"}</p>
                        </div>

                        <div className="mt-3 text-xs text-[#98A2B3] dark:text-white/50">
                            Destinatários:{" "}
                            {selectedSend.recipientsSnapshot.length
                                ? selectedSend.recipientsSnapshot.join(", ")
                                : "—"}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
