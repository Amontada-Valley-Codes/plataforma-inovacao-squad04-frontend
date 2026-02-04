"use client";

import { useMemo, useState } from "react";

type EmailEntry = {
    emails: string[];
    mode: "MANUAL" | "AUTOMATICO";
    enabled: boolean;
};

type StatusReportEmailSectionProps = {
    avancos: string;
    problemas: string;
    proximosPassos: string;
    challengeId?: string;
    responsibleName?: string;
    onSent?: (item: SendHistoryItem) => void;
};

type SendHistoryItem = {
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

export default function StatusReportEmailSection({
    avancos,
    problemas,
    proximosPassos,
    challengeId,
    responsibleName,
    onSent,
}: StatusReportEmailSectionProps) {
    const [emailConfig, setEmailConfig] = useState<EmailEntry>({
        emails: [],
        mode: "MANUAL",
        enabled: false,
    });

    const [emailInput, setEmailInput] = useState("");
    const [isSending, setIsSending] = useState(false);

    const canSend = useMemo(() => {
        if (!emailConfig.enabled) return false;
        if (emailConfig.emails.length === 0) return false;
        const hasContent = avancos.trim() || problemas.trim() || proximosPassos.trim();
        return Boolean(hasContent);
    }, [emailConfig.enabled, emailConfig.emails.length, avancos, problemas, proximosPassos]);

    const isValidEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    const addEmail = () => {
        const value = emailInput.trim();

        if (!value) return;
        if (!isValidEmail(value)) return;

        setEmailConfig((prev) => {
            if (prev.emails.includes(value)) return prev;
            return { ...prev, emails: [...prev.emails, value] };
        });

        setEmailInput("");
    };

    const removeEmail = (email: string) => {
        setEmailConfig((prev) => ({
            ...prev,
            emails: prev.emails.filter((e) => e !== email),
        }));
    };

    const genId = () =>
        typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const handleSend = async () => {
        setIsSending(true);

        const nowIso = new Date().toISOString();
        const sendId = genId();

        try {
            const payload = {
                challengeId,
                reportId: sendId,
                from: responsibleName ?? "",
                mode: emailConfig.mode,
                recipients: emailConfig.emails,
                content: {
                    avancos,
                    problemas,
                    proximosPassos,
                },
                createdAt: nowIso,
            };

            console.log("SEND STATUS REPORT (mock):", payload);

            await new Promise((r) => setTimeout(r, 800));

            onSent?.({
                id: sendId,
                reportId: sendId,
                sentAt: nowIso,
                sentBy: responsibleName ?? "—",
                mode: emailConfig.mode,
                recipientsSnapshot: [...emailConfig.emails],
                status: "SENT",
                contentSnapshot: {
                    avancos,
                    problemas,
                    proximosPassos,
                },
            });

        } catch (err: any) {
            onSent?.({
                id: sendId,
                reportId: sendId,
                sentAt: nowIso,
                sentBy: responsibleName ?? "—",
                mode: emailConfig.mode,
                recipientsSnapshot: [...emailConfig.emails],
                status: "FAILED",
                errorMessage: err?.message ?? "Falha ao enviar",
                contentSnapshot: {
                    avancos,
                    problemas,
                    proximosPassos,
                },
            });

        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 rounded-xl border border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
            <div className="flex items-center justify-between">
                <h2 className="text-[#0B2B70] dark:text-white font-semibold">
                    Enviar Status Report por e-mail
                </h2>

                <label className="flex items-center gap-2 text-sm text-[#344054] dark:text-[#ced3db]">
                    <input
                        type="checkbox"
                        checked={emailConfig.enabled}
                        onChange={(e) =>
                            setEmailConfig((prev) => ({ ...prev, enabled: e.target.checked }))
                        }
                    />
                    Ativar envio
                </label>
            </div>

            {emailConfig.enabled && (
                <>
                    {/* Modo */}
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-[#667085] dark:text-white/60 font-medium">
                            Modo de envio
                        </p>

                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 text-sm text-[#344054] dark:text-[#ced3db]">
                                <input
                                    type="radio"
                                    name="modo-envio"
                                    checked={emailConfig.mode === "MANUAL"}
                                    onChange={() => setEmailConfig((prev) => ({ ...prev, mode: "MANUAL" }))}
                                />
                                Manual
                            </label>

                            <label className="flex items-center gap-2 text-sm text-[#344054] dark:text-[#ced3db]">
                                <input
                                    type="radio"
                                    name="modo-envio"
                                    checked={emailConfig.mode === "AUTOMATICO"}
                                    onChange={() =>
                                        setEmailConfig((prev) => ({ ...prev, mode: "AUTOMATICO" }))
                                    }
                                />
                                Automático (semanal)
                            </label>
                        </div>

                        {emailConfig.mode === "AUTOMATICO" && (
                            <p className="text-xs text-[#98A2B3] dark:text-white/50">
                                * O agendamento real depende do backend.
                            </p>
                        )}
                    </div>

                    {/* Destinatários */}
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-[#667085] dark:text-white/60 font-medium">
                            Destinatários
                        </p>

                        <div className="flex gap-2">
                            <input
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                placeholder="ex: stakeholder@empresa.com"
                                className="flex-1 rounded-lg border border-[#E5E7EB] dark:border-gray-800 bg-[#F9FAFB] dark:bg-gray-900 px-3 py-2 text-sm outline-none text-[#344054] dark:text-[#ced3db]"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addEmail();
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={addEmail}
                                className="rounded-lg bg-[#0B2B70] hover:bg-[#09245e] transition-colors text-white px-3 py-2 text-sm font-semibold"
                            >
                                Adicionar
                            </button>
                        </div>

                        {emailConfig.emails.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-1">
                                {emailConfig.emails.map((email) => (
                                    <span
                                        key={email}
                                        className="flex items-center gap-2 rounded-full bg-[#E7EEFF] text-[#0B2B70] px-3 py-1 text-xs font-semibold"
                                    >
                                        {email}
                                        <button
                                            type="button"
                                            onClick={() => removeEmail(email)}
                                            className="text-[#0B2B70]/70 hover:text-[#0B2B70]"
                                            aria-label={`Remover ${email}`}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Prévia */}
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-[#667085] dark:text-white/60 font-medium">
                            Prévia do conteúdo
                        </p>

                        <div className="rounded-lg border border-[#E5E7EB] dark:border-gray-800 bg-[#F9FAFB] dark:bg-gray-900 p-3 text-sm text-[#344054] dark:text-[#ced3db] whitespace-pre-wrap">
                            <p className="font-semibold mb-1">Avanços</p>
                            <p className="mb-3">{avancos?.trim() || "—"}</p>

                            <p className="font-semibold mb-1">Problemas</p>
                            <p className="mb-3">{problemas?.trim() || "—"}</p>

                            <p className="font-semibold mb-1">Próximos passos</p>
                            <p>{proximosPassos?.trim() || "—"}</p>
                        </div>
                    </div>

                    {/* Enviar */}
                    <div className="flex items-center justify-end">
                        <button
                            type="button"
                            onClick={handleSend}
                            disabled={!canSend || isSending}
                            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${!canSend || isSending
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-800 dark:text-white/40"
                                    : "bg-[#0B2B70] hover:bg-[#09245e] text-white"
                                }`}
                        >
                            {isSending ? "Enviando..." : "Enviar relatório"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
