"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/api/axios";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface Question {
  id: string;
  title: string;
  type: "TEXT" | "NUMBER" | "SELECT" | "RADIO" | "CHECKBOX";
  required: boolean;
  order: number;
  options: string[] | null;
}

interface CustomFormProps {
  challengeId: string; 
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomForm({ challengeId, isOpen, onClose }: CustomFormProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [realChallengeFormId, setRealChallengeFormId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);


  useEffect(() => {
    const fetchTemplateAndId = async () => {
      if (!challengeId || !isOpen) return;

      try {
        setLoading(true);
        const response = await api.get(`/form-template-versions/${challengeId}`);
        

        const firstForm = response.data.forms?.[0];
        const versionData = firstForm?.version;

        if (versionData) {
 
          const extractedId = versionData.challengeForms?.[0]?.id;
          setRealChallengeFormId(extractedId);

    
          setQuestions(versionData.questions || []);
          
          console.log("ID de Resposta encontrado:", extractedId);
        } else {
          toast.error("Nenhum formulário vinculado a este desafio.");
        }
      } catch (err) {
        console.error("Erro ao buscar template:", err);
        toast.error("Falha ao carregar perguntas dinâmicas.");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplateAndId();
  }, [challengeId, isOpen]);

  const handleChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!realChallengeFormId) {
      toast.error("Erro interno: ID do formulário de resposta não encontrado.");
      return;
    }

    setSubmitting(true);

    const payload = {
      challengeFormId: realChallengeFormId, 
      answers: questions.map((q) => ({
        questionId: q.id,
        value: String(answers[q.id] || "").trim(),
      })),
    };

    try {
      
      await api.post("/form-responses", payload);
      toast.success("Desafio e respostas registrados com sucesso!");
      onClose();
    } catch (err: any) {
      console.error("Erro no envio final:", err.response?.data);
      const errorMsg = err.response?.data?.message || "Erro ao salvar respostas.";
      toast.error(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
    } finally {
      setSubmitting(false);
    }
  };



  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="lg:w-250 sm:w-150 md:w-200 bg-white z-50 shadow rounded-2xl max-h-[90vh] flex flex-col overflow-hidden p-6">
       
        <form onSubmit={handleSubmit} className="space-y-3">
  {questions.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {questions
        .sort((a, b) => a.order - b.order)
        .map((q) => (
          <div key={q.id}>
            <Label>
              {q.title}
            </Label>

            {q.type === "TEXT" && (
              <Input
                required={q.required}
                value={answers[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
                placeholder="Digite sua resposta"
              />
            )}

            {q.type === "NUMBER" && (
              <Input
                type="number"
                required={q.required}
                value={answers[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
                placeholder="0"
              />
            )}

            {q.type === "SELECT" && Array.isArray(q.options) && (
              <Select
                value={answers[q.id] || ""}
                onValueChange={(value) => handleChange(q.id, value)}
              >
                <SelectTrigger className="w-full border border-gray-300 rounded-lg px-3 py-5 bg-white">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>

                <SelectContent>
                  {q.options.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        ))}
    </div>
  ) : (
    <p className="text-center text-gray-500 py-4">
      Não há perguntas adicionais para este desafio.
    </p>
  )}

          <div className="flex justify-end gap-3 mt-3 ">
            <Button 
              
              onClick={onClose} 
             
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button 
           
              disabled={submitting}
            >
              {submitting ? "Enviando..." : "Concluir Registro"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}