"use client";
import { Modal } from "../ui/modal";
import { ChallengeService } from "@/api/services/challenge.service";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { useEffect, useState } from "react";
import { StrategicObjectivesService } from "@/api/services/strategic-objectives.service";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  challengeId: string;
  initialData: {
    name: string;
    problemDescription: string;
    problemDuration: string;
    currentSolution: string;
    problemRelevance: string;
    strategicObjectiveIds: string[];
    currentIndicators: string;
    expectedImpacts: string;
    involvedAreas: string[];
    initialConstraints: string;
    proponentParticipation: string;
  };
  onSuccess?: () => void;
};

type StrategicObjective = {
  id: string;
  title: string;
};

const INVOLVED_AREAS_OPTIONS = [
  { label: "Administrativo", value: "ADMINISTRATIVE" },
  { label: "Financeiro", value: "FINANCIAL" },
  { label: "Contábil", value: "ACCOUNTING" },
  { label: "Jurídico", value: "LEGAL" },
  { label: "Recursos Humanos", value: "HUMAN_RESOURCES" },
  { label: "Marketing", value: "MARKETING" },
  { label: "Vendas", value: "SALES" },
  { label: "Comercial", value: "COMMERCIAL" },
  { label: "Suprimentos", value: "SUPPLY" },
  { label: "Logística", value: "LOGISTICS" },
  { label: "Produção", value: "PRODUCTION" },
  { label: "Tecnologia", value: "TECHNOLOGY" },
  { label: "Engenharia", value: "ENGINEERING" },
  { label: "Atendimento ao Cliente", value: "CUSTOMER_SERVICE" },
  { label: "Qualidade", value: "QUALITY" },
  { label: "Pesquisa e Desenvolvimento", value: "RESEARCH_DEVELOPMENT" },
  { label: "Saúde e Segurança", value: "HEALTH_SAFETY" },
  { label: "Outro", value: "OTHER" },
] as const;

const PROPONENT_PARTICIPATION_OPTIONS = [
  { label: "Idealizador da ideia", value: "IDEATOR" },
  { label: "Colaborador", value: "COLLABORATOR" },
  { label: "Líder do projeto", value: "PROJECT_LEAD" },
  { label: "Observador", value: "OBSERVER" },
  { label: "Não participará", value: "NO_PARTICIPATION" },
] as const;

const EditChallengeSchema = z.object({
  name: z.string().min(3, "O nome do desafio deve ter no mínimo 3 caracteres"),
  problemDescription: z.string().min(5, "A descrição do problema é obrigatória"),
  problemDuration: z.string().min(3, "Informe há quanto tempo o problema existe"),
  currentSolution: z.string().min(3, "Informe a solução atual do problema"),
  problemRelevance: z.string().min(3, "Informe a relevância do problema"),
  strategicObjectiveIds: z.array(z.string().uuid("ID de objetivo estratégico inválido")).min(1, "Selecione pelo menos um objetivo estratégico"),
  currentIndicators: z.string().min(3, "Informe os indicadores ou metas atuais"),
  expectedImpacts: z.string().min(3, "Informe os impactos esperados"),
  involvedAreas: z.array(z.enum(["ADMINISTRATIVE","FINANCIAL","ACCOUNTING","LEGAL","HUMAN_RESOURCES",
  "MARKETING","SALES","COMMERCIAL","SUPPLY","LOGISTICS","PRODUCTION","TECHNOLOGY","ENGINEERING",
  "CUSTOMER_SERVICE","QUALITY","RESEARCH_DEVELOPMENT","HEALTH_SAFETY","OTHER",])).min(1, "Selecione pelo menos uma área envolvida"),
  initialConstraints: z.string().min(3, "Informe as restrições iniciais"),
  proponentParticipation: z.enum(["IDEATOR","COLLABORATOR","PROJECT_LEAD","OBSERVER","NO_PARTICIPATION",]),
});

type FormData = z.infer<typeof EditChallengeSchema>;

export default function EditChallengeModal({ onClose, isOpen, challengeId, initialData, onSuccess }: Props) {
  const [strategicObjectives, setStrategicObjectives] = useState<StrategicObjective[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(EditChallengeSchema),
    defaultValues: {
      ...initialData,
      involvedAreas: initialData.involvedAreas as any,
      proponentParticipation: initialData.proponentParticipation as any,
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      console.log("Dados sendo enviados:", data);
      await ChallengeService.updateChallenge(challengeId, data);
      toast.success("Desafio atualizado com sucesso!");
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Erro ao atualizar desafio:", error);
      console.error("Detalhes do erro:", error?.response?.data);
      console.error("Status:", error?.response?.status);
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Erro ao atualizar desafio. Verifique os dados e tente novamente.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadStrategicObjectives() {
      try {
        const response = await StrategicObjectivesService.getAllObjectives();
        setStrategicObjectives(response);
      } catch (error) {
        console.error("Erro ao buscar objetivos estratégicos", error);
      }
    }
    loadStrategicObjectives();
  }, []);

  const selectedAreas = watch("involvedAreas");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="lg:w-250 sm:w-150 md:w-200 bg-white dark:bg-gray-900 z-50 shadow rounded-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <Label>Título do desafio</Label>
                  <Input placeholder="Digite o titulo desafio" {...register("name")} />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                <div>
                  <Label>Há quanto tempo o problema existe</Label>
                  <Input {...register("problemDuration")} placeholder="Digite Há quanto tempo o problema existe" />
                  {errors.problemDuration && <p className="text-red-500 text-sm">{errors.problemDuration.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <Label>Solução atual para o problema</Label>
                  <Input {...register("currentSolution")} placeholder="Digite quanto tempo o problema existe" />
                  {errors.currentSolution && <p className="text-red-500 text-sm">{errors.currentSolution.message}</p>}
                </div>

                <div>
                  <Label>Relevância do problema para a organização</Label>
                  <Input placeholder="Digite Relevância do problema para a organização" {...register("problemRelevance")} />
                  {errors.problemRelevance && <p className="text-red-500 text-sm">{errors.problemRelevance.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <Label>Impactos esperados com a implementação da ideia</Label>
                  <Input {...register("expectedImpacts")} placeholder="Digite os Impactos esperados com a implementação da ideia" />
                  {errors.expectedImpacts && <p className="text-red-500 text-sm">{errors.expectedImpacts.message}</p>}
                </div>

                <div>
                  <Label>Indicadores ou metas atuais da área</Label>
                  <Input placeholder="Digite os Indicadores ou metas atuais da área" {...register("currentIndicators")} />
                  {errors.currentIndicators && <p className="text-red-500 text-sm">{errors.currentIndicators.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <Label>Forma de participação do proponente se aprovado</Label>
                  <Select
                    value={watch("proponentParticipation")}
                    onValueChange={(value) => setValue("proponentParticipation", value as any, { shouldValidate: true })}
                  >
                    <SelectTrigger className="w-full mt-2 rounded-lg py-5">
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPONENT_PARTICIPATION_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.proponentParticipation && <p className="text-red-500 text-sm mt-1">{errors.proponentParticipation.message}</p>}
                </div>

                <div>
                  <Label>Restrições ou dependências iniciais</Label>
                  <Input placeholder="Digite as Restrições ou dependências iniciais" {...register("initialConstraints")} />
                  {errors.initialConstraints && <p className="text-red-500 text-sm">{errors.initialConstraints.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <Label>Objetivos estratégicos associados ao desafio</Label>
                  <select
                    multiple
                    className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-2 min-h-[180px]"
                    value={watch("strategicObjectiveIds")}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions).map((option) => option.value);
                      setValue("strategicObjectiveIds", values, { shouldValidate: true });
                    }}
                  >
                    {strategicObjectives.map((objective) => (
                      <option key={objective.id} value={objective.id}>
                        {objective.title}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Segure <b>Ctrl</b> (ou <b>Cmd</b>) para selecionar mais de um
                  </p>
                  {errors.strategicObjectiveIds && <p className="text-red-500 text-sm mt-1">{errors.strategicObjectiveIds.message}</p>}
                </div>

                <div>
                  <Label>Descrição do problema identificado</Label>
                  <Textarea className="min-h-[180px]" {...register("problemDescription")} placeholder="Digite o problema identificado" />
                  {errors.problemDescription && <p className="text-red-500 text-sm">{errors.problemDescription.message}</p>}
                </div>
              </div>

              <div>
                <Label>Áreas envolvidas ou impactadas</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {INVOLVED_AREAS_OPTIONS.map((area) => {
                    const active = selectedAreas.includes(area.value);
                    return (
                      <button
                        type="button"
                        key={area.value}
                        onClick={() => {
                          setValue(
                            "involvedAreas",
                            active ? selectedAreas.filter((v) => v !== area.value) : [...selectedAreas, area.value],
                            { shouldValidate: true }
                          );
                        }}
                        className={`px-3 py-1 rounded-full border text-sm transition ${
                          active 
                            ? "bg-blue-600 text-white border-blue-600 dark:bg-blue-600 dark:text-white dark:border-blue-600" 
                            : "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                        }`}
                      >
                        {area.label}
                      </button>
                    );
                  })}
                </div>
                {errors.involvedAreas && <p className="text-red-500 text-sm mt-1">{errors.involvedAreas.message}</p>}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-top mt-6">
                <Button onClick={onClose} disabled={loading}>
                  Cancelar
                </Button>
                <Button disabled={loading}>
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
