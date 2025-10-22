    "use client";

    import React, { useState } from "react";
    import { X, List, FileText, Paperclip, Trash2, Loader2 } from "lucide-react";
    import { Modal } from "../ui/modal";


    type Props = {
        isOpen: boolean;
        onClose: () => void;
        challengeId: string;
        challengeTitle: string;
        onSubmit?: (data: {
            challengeId: string;
            description: string;
            experience: string;
            files: File[];
        }) => Promise<void> | void;
    };

    export default function ApplyModal({
        isOpen,
        onClose,
        challengeId,
        challengeTitle,
        onSubmit,
    }: Props) {
        const [description, setDescription] = useState("");
        const [experience, setExperience] = useState("");
        const [files, setFiles] = useState<File[]>([]);
        const [loading, setLoading] = useState(false);

        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const selected = Array.from(e.target.files || []);
            if (selected.length) setFiles((prev) => [...prev, ...selected]);
        };

        const handleRemoveFile = (index: number) => {
            setFiles((prev) => prev.filter((_, i) => i !== index));
        };

        const handleSubmit = async () => {
            if (!description.trim()) return;
            setLoading(true);
            try {
                await onSubmit?.({ challengeId, description, experience, files });
                setDescription("");
                setExperience("");
                setFiles([]);
                onClose();
            } finally {
                setLoading(false);
            }
        };

        return (
            <Modal isOpen={isOpen} onClose={onClose} className="max-w-[560px] p-0">
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="w-[90vw] max-w-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-lg border dark:border-gray-800 overflow-hidden">
                        {/* Header */}
                        <div className="flex justify-between items-center px-6 pt-6 pb-3">
                            <h2 className="text-2xl font-bold text-[#15358D] dark:text-blue-400">
                                {challengeTitle}
                            </h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition" aria-label="Fechar">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 pb-6 space-y-5">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-[#15358D] dark:text-blue-300 mb-1">
                                    <List size={18} />
                                    Descrição da Solução
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Como sua startup pensa em resolver?"
                                    rows={4}
                                    className="w-full rounded-lg border border-[#E5E7EB] dark:border-gray-800 bg-[#F9FAFB] dark:bg-gray-900 p-3 text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3] resize-none"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-[#15358D] dark:text-blue-300 mb-1">
                                    <FileText size={18} />
                                    Experiências Relevantes
                                </label>
                                <textarea
                                    value={experience}
                                    onChange={(e) => setExperience(e.target.value)}
                                    placeholder="Já participámos de X, desenvolvemos Y, tivemos resultados Z."
                                    rows={3}
                                    className="w-full rounded-lg border border-[#E5E7EB] dark:border-gray-800 bg-[#F9FAFB] dark:bg-gray-900 p-3 text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3] resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E5E7EB] dark:border-gray-800 bg-[#F2F4F7] dark:bg-gray-900 text-sm text-[#344054] dark:text-[#ced3db] cursor-pointer hover:bg-[#E5E7EB] transition">
                                    <Paperclip size={16} />
                                    + Anexos Complementares
                                    <input type="file" multiple className="hidden" onChange={handleFileChange} />
                                </label>

                                {files.length > 0 && (
                                    <ul className="space-y-1 max-h-32 overflow-auto text-sm">
                                        {files.map((file, index) => (
                                            <li key={index} className="flex items-center justify-between border border-[#E5E7EB] dark:border-gray-800 rounded-md px-3 py-2">
                                                <span className="truncate pr-3">{file.name}</span>
                                                <button onClick={() => handleRemoveFile(index)} className="text-gray-400 hover:text-red-500 transition">
                                                    <Trash2 size={16} />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 pb-6 flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 bg-[#F2F4F7] text-[#344054] py-2 rounded-lg font-medium border border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900 dark:text-[#ced3db] hover:bg-[#E5E7EB] transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#15358D] hover:bg-[#0f2a6d] text-white py-2 rounded-lg font-medium transition dark:bg-blue-800 dark:hover:bg-blue-900"
                            >
                                {loading && <Loader2 size={18} className="animate-spin" />}
                                Solicitar
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
