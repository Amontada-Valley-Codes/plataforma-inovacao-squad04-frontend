/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import { CardContentsHeader } from "./CardsContents";
import { useEffect, useState, memo, useCallback } from "react";
import { Bug, Lightbulb, Trophy, X, Loader2, Trash } from "lucide-react";
import { ShowDetailedScreeningByIdResponse } from "@/api/payloads/detailedScreening.payload";
import { detailedScreeningService } from "@/api/services/detailedScreening.service";
import { Toaster } from "react-hot-toast";
import { ConceptionDocumentsService } from "@/api/services/conception-documents.service";
import { immersionDocumentService } from "@/api/services/immersion-document.service";
import { CreateMapEmpathyPayload } from "@/api/payloads/immersionDocument.payload";

type Props = {
  challangeTitle: string;
  challengeId: string;
  category: string;
  startDate: string;
  creator: string;
  visibility: string;
}

type ProblemTreeType = "PROBLEM" | "CAUSE" | "EFFECT";

const TreeItem = memo(function TreeItem({
  node,
  level,
  type,
  onChange,
  onAddChild,
  onRemove
}: {
  node: TreeNode;
  level: number;
  type: "cause" | "effect";
  onChange: (id: string, value: string) => void;
  onAddChild: (id: string, level: number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className={`mt-2 ${level === 1 ? "ml-6" : "ml-2"} border-l border-white/20 pl-3 max-w-full`}>
      <div className="flex items-center gap-2">
        <input
          value={node.text}
          onChange={(e) => onChange(node.id, e.target.value)}
          placeholder={level === 0
            ? type === "cause" ? "Descreva a causa..." : "Descreva o efeito..."
            : type === "cause" ? "Descreva a subcausa..." : "Descreva o subefeito..."
          }
          className="flex-1 min-w-0  border bg-[#F9FAFB] border-[#E5E7EB]  dark:border-gray-900 dark:bg-gray-900 rounded-md px-3 py-1 text-black/80 dark:text-white text-sm placeholder:text-[#98A2B3]"
        />

        <button
          type="button"
          onClick={() => onRemove(node.id)}
          className="text-[#98A2B3] hover:text-red-400"
        >
          <Trash size={14} />
        </button>
      </div>

      {level === 0 && (
        <button
          type="button"
          onClick={() => onAddChild(node.id, level)}
          className="mt-1 text-xs text-[#98A2B3] dark:text-white/50"
        >
          + {type === "cause" ? "Subcausa" : "Subefeito"}
        </button>
      )}

      {node.children.map(child => (
        <TreeItem
          key={child.id}
          node={child}
          level={level + 1}
          type={type}
          onChange={onChange}
          onAddChild={onAddChild}
          onRemove={onRemove}
        />
      ))}

    </div>
  );
});

type TreeNode = {
  id: string;
  text: string;
  children: TreeNode[];
};

const createNode = (): TreeNode => ({
  id: crypto.randomUUID(),
  text: "",
  children: []
});

const updateNodeText = (
  nodes: TreeNode[],
  id: string,
  value: string
): TreeNode[] => {
  let changed = false;

  const result = nodes.map(node => {
    if (node.id === id) {
      changed = true;
      return { ...node, text: value };
    }

    const updatedChildren = updateNodeText(node.children, id, value);

    if (updatedChildren !== node.children) {
      changed = true;
      return { ...node, children: updatedChildren };
    }

    return node;
  });

  return changed ? result : nodes;
};

const addChildNode = (
  nodes: TreeNode[],
  id: string,
  level: number
): TreeNode[] => {
  let changed = false;

  const result = nodes.map(node => {
    if (node.id === id && level === 0) {
      if (node.children.length > 0) return node;

      changed = true;
      return {
        ...node,
        children: [createNode()]
      };
    }

    const updatedChildren = addChildNode(node.children, id, level + 1);

    if (updatedChildren !== node.children) {
      changed = true;
      return { ...node, children: updatedChildren };
    }

    return node;
  });

  return changed ? result : nodes;
};

const removeNode = (nodes: TreeNode[], id: string): TreeNode[] => {
  let changed = false;

  const result = nodes
    .map(node => {
      const updatedChildren = removeNode(node.children, id);

      if (updatedChildren !== node.children) {
        changed = true;
        return { ...node, children: updatedChildren };
      }

      return node;
    })
    .filter(node => {
      const keep = node.id !== id;
      if (!keep) changed = true;
      return keep;
    });

  return changed ? result : nodes;
};

export const DetailedScreening = ({ challangeTitle, challengeId, category, startDate, creator, visibility }: Props) => {
  const [detailedScreening, setDetailedScreening] = useState<ShowDetailedScreeningByIdResponse | null>(null);
  const [page, setPage] = useState('1')
  const [isLoading, setIsLoading] = useState(false)

  const [pov, setPov] = useState("");
  const [hmw, setHmw] = useState("");
  const [rootProblem, setRootProblem] = useState("");
  const [causes, setCauses] = useState<TreeNode[]>([]);
  const [effects, setEffects] = useState<TreeNode[]>([]);
  const [alternativa, setAlternativa] = useState<string>("")
  const [makeOrBuy, setMakeOrBuy] = useState<"MAKE" | "BUY" | null>(null)
  const [justificativaMakeBuy, setJustificativaMakeBuy] = useState("")
  const [riscosIniciais, setRiscosIniciais] = useState("")
  const [capacidadeTecnica, setCapacidadeTecnica] = useState("")
  const [capacidadeFinanceira, setCapacidadeFinanceira] = useState("")
  const [stakeholders, setStakeholders] = useState<string[]>([])
  const areasEnvolvidas = [
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
    { label: "Pesquisa & Desenvolvimento", value: "RESEARCH_DEVELOPMENT" },
    { label: "Saúde & Segurança", value: "HEALTH_SAFETY" },
    { label: "Outros", value: "OTHER" },
  ]
  const [visaoProduto, setVisaoProduto] = useState({
    descricao: "",
    publicoAlvo: "",
    propostaValor: "",
  })
  const [mapasEmpatia, setMapasEmpatia] = useState([{ pensa: "", sente: "", ve: "", fala: "", dores: "", ganhos: "" }])
  const [evidencias, setEvidencias] = useState<File[]>([])

  const POV_MAX = 2000;
  const HMW_MAX = 1500;
  const SOLUTION_MAX = 2000;
  const MAKE_MAX = 1000;
  const CAPACIDADE_MAX = 100;

  const serializeTree = (
    nodes: TreeNode[],
    type: ProblemTreeType
  ): any[] => {
    return nodes
      .filter(node => node.text.trim() !== "")
      .map(node => ({
        description: node.text,
        type,
        children: serializeTree(node.children, type)
      }));
  };

  const initDetailedScreening = useCallback(async () => {
    try {
      const newDetailedScreening = await detailedScreeningService.startDetailedScreening(challengeId)
      console.log(newDetailedScreening)
      setDetailedScreening(newDetailedScreening)
    } catch (err: any) {
      if (err?.response?.status === 409) {
        const res = await detailedScreeningService.showDetailedScreeningById(challengeId)
        setDetailedScreening(res)
        return
      }

      console.error("Erro ao inicializar a triagem detalhada:", err)
    }
  }, [challengeId])

  useEffect(() => {
    initDetailedScreening()
  }, [initDetailedScreening])

  const handleCreateConception = async () => {
    try {
      const payload = {
        ProductOverview: {
          summary: visaoProduto.descricao,
          targetAudience: visaoProduto.publicoAlvo,
          valueProposition: visaoProduto.propostaValor,
        },
        SolutionAlternatives: alternativa,
        MakeorBuy: {
          type: makeOrBuy,
          justification: justificativaMakeBuy
        },
        InitialRisks: riscosIniciais,
        TechnicalCapability: capacidadeTecnica,
        FinancialCapacity: capacidadeFinanceira,
      }
  
      await ConceptionDocumentsService.CreateConceptionDocument(detailedScreening?.id!, payload)
    } catch (error) {
      console.error("Erro ao criar documento de concepção:", error)
    }
  }

  const handleCreateImmersionDocument = async () => {
    try {
      const formData = new FormData()
  
      formData.append("POV", pov)
      formData.append("HMW", hmw)
      stakeholders.forEach((area) => {
        formData.append("stakeholder", area)
      })
      evidencias.forEach((file, index) => {
        formData.append(`evidence`, file)
      })
  
      console.log(formData)
      
      if (!detailedScreening?.id) return

      await immersionDocumentService.createImmersionDocument(detailedScreening.id, formData)
    } catch (error) {
      console.error("Erro ao criar documento de imersão:", error)
    }

  }

  const handleCreateProblemTree = async () => {
    try {
      if (!detailedScreening?.id) return;

      const immersion = detailedScreening.immersionDocument?.[0];

      if (!immersion) return; 

      if (!rootProblem.trim()) {
        console.warn("Problema raiz é obrigatório");
        return;
      }

      const payload = {
        description: rootProblem,
        type: "PROBLEM" as const,
        children: [
          ...serializeTree(causes, "CAUSE"),
          ...serializeTree(effects, "EFFECT")
        ]
      };

      await immersionDocumentService.createProblemTree(
        immersion.id,
        payload
      );

      console.log("Árvore criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar árvore:", error);
    }
  };

  const handleCreateEmpathyMap = async () => {
    try {

      if (!detailedScreening?.id) return;

      const immersion = detailedScreening.immersionDocument?.[0];

      if (!immersion) return;

      if (mapasEmpatia.length === 0) return;

      if (mapasEmpatia.length > 3) return

      for (const mapa of mapasEmpatia) {
        const payload: CreateMapEmpathyPayload = {
          listen: mapa.pensa,
          see: mapa.ve,
          speakAndDo: mapa.fala,
          pains: mapa.dores,
          gains: mapa.ganhos
        };

        await immersionDocumentService.createEmpathyMap(
          immersion.id,
          payload
        );
      }

      console.log("Mapas criados com sucesso!");
    } catch (error) {
      console.error("Erro ao criar mapas:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  if (!detailedScreening) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Dados não encontrados.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <Toaster position="top-right" reverseOrder={false} />
      {/* header */}
      <div className="flex flex-col xl:flex-row xl:justify-between mb-6">
        <CardContentsHeader
          challengeTitle={challangeTitle}
          category={category}
          startDate={startDate}
          creator={creator}
          visibility={visibility}
        />

        <div className="relative flex items-center">
          <div className="flex gap-4 items-center xl:justify-center w-full max-w-md">
            <div className="flex flex-col items-center">
              <button
                className={`w-8 h-8 rounded-full font-semibold flex items-center justify-center ${page === '1' ? "bg-[#0B2B72] text-white" : "border-gray-400 border-2 text-gray-500"
                  }`}
                onClick={() => setPage('1')}
              >
                1
              </button>
              <span className="text-sm mt-1 whitespace-nowrap">Contexto da ideia</span>
            </div>

            <div className="flex flex-col items-center">
              <button
                className={`w-8 h-8 rounded-full  font-semibold flex items-center justify-center ${page === '2' ? "bg-[#0B2B72] text-white" : "border-gray-400 dark:placeholder:text-white border-2 text-gray-500"
                  }`}
                onClick={() => setPage('2')}
              >
                2
              </button>
              <span className="text-sm mt-1">Triagem</span>
            </div>
            <div className="flex flex-col items-center">
              <button
                className={`w-8 h-8 rounded-full font-semibold flex items-center justify-center ${page === '3'
                    ? "bg-[#0B2B72] text-white"
                    : "border-gray-400 border-2 text-gray-500"
                  }`}
                onClick={() => setPage('3')}
              >
                3
              </button>
              <span className="text-sm mt-1 whitespace-nowrap">Conception</span>
            </div>
          </div>
        </div>
      </div>

      {/* pagina 1 - resumo */}
      {page === '1' && (
        <div className="w-full flex flex-col gap-4">
          <h1 className="text-[#0B2B70] dark:text-white text-2xl font-semibold">
            Canvas Rápido
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {/* PROBLEMA */}
            <div className="rounded-xl p-4 border border-[#E5E7EB] dark:border-[#737373]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[#0B2B70] dark:text-white font-semibold">
                  Problema (Árvore Estruturada)
                </h2>
                <Bug size={18} className="text-[#0B2B70] dark:text-white" />
              </div>

              {/* PROBLEMA RAIZ */}
              <input
                value={rootProblem}
                onChange={(e) => setRootProblem(e.target.value)}
                className="w-full bg-[#F9FAFB] border border-white/10 dark:bg-gray-900 rounded-md px-3 py-2 text-black/80 dark:text-white mb-4 placeholder:text-[#98A2B3]"
                placeholder="Problema raiz"
              />

              {/* CAUSAS */}
              <button
                type="button"
                onClick={() => setCauses(prev => [...prev, createNode()])}
                className="mb-2 text-sm text-[#0B2B70] border-[#cdcfd2] dark:text-white/80 border border-dashed dark:border-white/30 rounded-full px-3 py-1"
              >
                + Adicionar causa
              </button>

              {causes.map(node => (
                <TreeItem
                  key={node.id}
                  node={node}
                  level={0}
                  type="cause" onChange={(id, value) =>
                    setCauses(prev => updateNodeText(prev, id, value))
                  }
                  onAddChild={(id, level) =>
                    setCauses(prev => addChildNode(prev, id, level))
                  }
                  onRemove={(id) =>
                    setCauses(prev => removeNode(prev, id))
                  }
                />
              ))}

              {/* EFEITOS */}
              <button
                type="button"
                onClick={() => setEffects(prev => [...prev, createNode()])}
                className="mb-2 text-sm text-[#0B2B70]  border-[#cdcfd2] dark:text-white/80 border border-dashed dark:border-white/30 rounded-full px-3 py-1 mt-4"
              >
                + Adicionar efeito
              </button>

              {effects.map(node => (
                <TreeItem
                  key={node.id}
                  node={node}
                  level={0}
                  type="effect"
                  onChange={(id, value) =>
                    setEffects(prev => updateNodeText(prev, id, value))
                  }
                  onAddChild={(id, level) =>
                    setEffects(prev => addChildNode(prev, id, level))
                  }
                  onRemove={(id) =>
                    setEffects(prev => removeNode(prev, id))
                  }
                />
              ))}

              <p className="text-xs text-[#98A2B3] dark:text-white/40 mt-3">
                Estrutura hierárquica obrigatória (não permite lista simples).
              </p>
            </div>

            {/* POV */}
            <div className="rounded-xl border border-[#E5E7EB] dark:border-[#737373] p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[#0B2B70] dark:text-white font-semibold">
                  Ponto de Vista (POV)
                </h2>
                <Lightbulb size={18} className="text-[#0B2B70] dark:text-white" />
              </div>

              <textarea
                value={pov}
                onChange={(e) => setPov(e.target.value)}
                maxLength={POV_MAX}
                className="w-full h-32 bg-[#F9FAFB] border border-white/10 dark:bg-gray-900 rounded-md px-3 py-2 text-black/80 dark:text-white placeholder:text-[#98A2B3] resize-none"
                placeholder="Usuário X precisa de Y porque Z..."
              />

              <p className="text-xs text-[#98A2B3] dark:text-white/50 mt-1 text-right">
                {pov.length}/{POV_MAX}
              </p>
            </div>

            {/* HMW */}
            <div className="md:col-span-2 rounded-xl border border-[#E5E7EB] dark:border-[#737373] p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[#0B2B70] dark:text-white font-semibold">
                  Como Podemos... <span>(HMW)</span>
                </h2>
                <Trophy size={18} className="text-[#0B2B70] dark:text-white" />
              </div>

              <textarea
                value={hmw}
                onChange={(e) => setHmw(e.target.value)}
                maxLength={HMW_MAX}
                disabled={pov.trim().length === 0}
                rows={3}
                className={`w-full bg-[#F9FAFB] border border-white/10 dark:bg-gray-900 rounded-md px-3 py-2
                      text-black/80 dark:text-white placeholder:text-[#98A2B3] resize-none break-words
                      ${pov.trim().length === 0 ? "opacity-60 cursor-not-allowed" : ""}`}
                placeholder="Como podemos..."
              />

              <p className="text-sm text-[#98A2B3] dark:text-white/50 mt-2">
                {pov.trim().length === 0
                  ? "Preencha primeiro o POV para habilitar este campo."
                  : `${hmw.length}/${HMW_MAX}`}
              </p>
            </div>
          </div>
        </div>
      )}


      {/* pagina 2 - triagem */}
      {page === '2' && (
        <div className="flex flex-col gap-6 w-full">

          {/* Stakeholders */}
          <div className="rounded-2xl border bg-[#F9FAFB] border-[#E5E7EB] dark:border-white/10 p-6 dark:bg-[#0B1220]">
            <h2 className="text-[#0B2B72] dark:text-white text-lg mb-2">Stakeholders Envolvidos</h2>
            <p className="text-sm text-gray-400 mb-4">
              Selecione até 15 áreas (mínimo 1 obrigatório)
            </p>

            <div className="flex flex-wrap gap-2">
              {areasEnvolvidas.map(area => {
                const checked = stakeholders.includes(area.value)
                return (
                  <button
                    key={area.value}
                    onClick={() => {
                      if (checked) {
                        setStakeholders(prev => prev.filter(a => a !== area.value))
                      } else if (stakeholders.length < 15) {
                        setStakeholders(prev => [...prev, area.value])
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-sm border transition
                          ${checked
                        ? "bg-[#0B2B72] text-white border-[#0B2B72]"
                        : "border-gray-600 text-[#0B2B72] dark:text-gray-300 hover:border-[#0B2B72]"
                      }`}
                  >
                    {area.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Mapa da Empatia */}
          <div className="rounded-2xl border bg-[#F9FAFB] border-[#E5E7EB] dark:border-white/10 p-6 dark:bg-[#0B1220]">
            <h2 className="text-[#0B2B72] dark:text-white text-lg mb-4">Mapa da Empatia</h2>

            {mapasEmpatia.map((mapa, index) => (
              <div
                key={index}
                className="mb-6 rounded-xl border bg-[#F9FAFB] border-[#E5E7EB] dark:border-white/10 dark:bg-[#0B1220]"
              >
                {/* Header do card */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
                  <span className="text-xs mt-1 text-[#0B2B72] dark:text-gray-400">
                    Mapa {index + 1}
                  </span>

                  {mapasEmpatia.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setMapasEmpatia(prev => prev.filter((_, i) => i !== index))
                      }
                      className="
                            h-8 w-8
                            flex items-center justify-center
                            rounded-full
                            border border-white/10
                            dark:bg-[#0B1220]/80
                            bg-[#F9FAFB]
                            text-gray-400
                            hover:text-red-400 hover:border-red-400/40
                            transition
                          "
                      title="Remover mapa"
                    >
                      <Trash size={14} />
                    </button>
                  )}
                </div>

                {/* Conteúdo */}
                <div className="grid grid-cols-2 gap-3 p-4">
                  {Object.keys(mapa).map((campo) => (
                    <textarea
                      key={campo}
                      placeholder={campo.toUpperCase()}
                      value={mapa[campo as keyof typeof mapa]}
                      onChange={(e) => {
                        const copy = [...mapasEmpatia]
                        copy[index][campo as keyof typeof mapa] = e.target.value
                        setMapasEmpatia(copy)
                      }}
                      maxLength={500}
                      className="
                            bg-[#e9e9e9]
                            border border-white/5
                            rounded-lg
                            dark:bg-[#0B1220]
                            p-3
                            text-sm
                          text-black/80 
                          dark:text-white
                            resize-none
                            h-24
                            focus:border-[#4EA1FF]/50
                            transition
                          "
                    />
                  ))}
                </div>
              </div>
            ))}

            <button
              disabled={mapasEmpatia.length >= 3}
              onClick={() =>
                setMapasEmpatia(prev => [
                  ...prev,
                  { pensa: "", sente: "", ve: "", fala: "", dores: "", ganhos: "" }
                ])
              }
              className="text-sm text-[#4EA1FF] hover:underline disabled:opacity-50"
            >
              + Adicionar mapa (máx. 3)
            </button>
          </div>

         {/* Upload de Evidências */}
          <div className="rounded-2xl border bg-[#F9FAFB] border-[#E5E7EB] dark:border-white/10 p-6 dark:bg-[#0B1220]">

            {/* Cabeçalho */}
            <div className="mb-4">
              <h2 className="text-[#0B2B72] dark:text-white text-lg font-semibold">
                Evidências
              </h2>
              <p className="text-sm text-gray-400">
                Upload obrigatório para avançar
              </p>
            </div>

            <label className="
              flex flex-col items-center justify-center
              border-2 border-dashed
              border-[#E5E7EB] dark:border-white/20
              rounded-xl
              h-36
              cursor-pointer
              transition
              hover:border-[#0B2B72]
              hover:bg-[#0B2B72]/5
              dark:hover:bg-white/5
            ">
              <span className="text-sm text-gray-500 dark:text-gray-300">
                Clique ou arraste arquivos aqui
              </span>
              <span className="text-xs text-gray-400 mt-1">
                Múltiplos arquivos permitidos
              </span>

              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const files = e.currentTarget.files
                  if (!files) return

                  const filesArray: File[] = Array.from(files)
                  setEvidencias(prev => [...prev, ...filesArray])
                }}
              />
            </label>

            {evidencias.length > 0 && (
              <ul className="mt-5 space-y-2">
                {evidencias.map((file, index) => (
                  <li
                    key={`${file.name}-${index}`}
                    className="
                      flex items-center justify-between
                      bg-white dark:bg-[#0F172A]
                      px-4 py-3
                      rounded-xl
                      border border-[#E5E7EB] dark:border-white/10
                      shadow-sm
                    "
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="
                        h-8 w-8
                        flex items-center justify-center
                        rounded-lg
                        bg-[#0B2B72]/10
                        text-[#0B2B72]
                        dark:bg-white/10
                        dark:text-white
                        text-xs font-semibold
                      ">
                        FILE
                      </div>

                      <span className="text-sm text-[#0B2B72] dark:text-white truncate">
                        {file.name}
                      </span>
                    </div>

                    {/* Botão remover */}
                    <button
                      type="button"
                      onClick={() =>
                        setEvidencias(prev => prev.filter((_, i) => i !== index))
                      }
                      className="
                        h-7 w-7
                        flex items-center justify-center
                        rounded-lg
                        text-gray-400
                        hover:text-red-400
                        hover:bg-red-400/10
                        transition
                      "
                      title="Remover arquivo"
                    >
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {page === '3' && (
        <div className="flex flex-col gap-6 w-full">

          {/* Visão do Produto */}
          <div className="rounded-xl border border-[#E5E7EB] dark:border-[#737373] p-4">
            <h2 className="text-[#0B2B70] dark:text-white font-semibold mb-3">
              Visão do Produto
            </h2>

            <input
              value={visaoProduto.propostaValor}
              onChange={(e) => setVisaoProduto(v => ({ ...v, propostaValor: e.target.value }))}
              placeholder="Proposta de valor"
              className="w-full mb-2 bg-[#F9FAFB] dark:bg-gray-900 border border-[#E5E7EB] dark:border-white/10 rounded-md px-3 py-2 text-black/80 dark:text-white"
            />

            <input
              value={visaoProduto.publicoAlvo}
              onChange={(e) =>
                setVisaoProduto(v => ({ ...v, publicoAlvo: e.target.value }))
              }
              placeholder="Público-alvo"
              className="w-full mb-2 bg-[#F9FAFB] border border-[#E5E7EB] dark:border-white/10 dark:bg-gray-900 
                rounded-md px-3 py-2 text-black/80 dark:text-white"
            />

            <textarea
              value={visaoProduto.descricao}
              onChange={(e) =>
                setVisaoProduto(v => ({ ...v, descricao: e.target.value }))
              }
              placeholder="Descrição da visão do produto"
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] dark:border-white/10 dark:bg-gray-900 rounded-md px-3 py-2 h-28 resize-none text-black/80 dark:text-white"
            />
          </div>

          {/* Alternativas de Solução */}
          <div className="rounded-xl border border-[#E5E7EB] dark:border-[#737373] p-4">
            <h2 className="text-[#0B2B70] dark:text-white font-semibold mb-3">
              Alternativas de Solução
            </h2>

            <textarea
              value={alternativa}
              maxLength={SOLUTION_MAX}
              onChange={(e) => setAlternativa(e.target.value)}
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] dark:border-white/10 dark:bg-gray-900 text-black/80 dark:text-white rounded-md px-3 py-2 resize-none"
              placeholder="Descreva a alternativa de solução"
            />

            <p className="text-xs text-[#98A2B3] dark:text-white/50 mt-1 text-right">
              {alternativa.length}/{SOLUTION_MAX}
            </p>
          </div>

          {/* Make or Buy */}
          <div className="rounded-xl border border-[#E5E7EB] dark:border-[#737373] p-4">
            <h2 className="text-[#0B2B70] dark:text-white font-semibold mb-3">
              Make or Buy
            </h2>

            <div className="flex gap-4 mb-3">
              {["MAKE", "BUY"].map(op => (
                <button
                  key={op}
                  onClick={() => setMakeOrBuy(op as any)}
                  className={`px-4 py-1 rounded-full ${makeOrBuy === op
                      ? "bg-[#0B2B72] text-white"
                      : "border border-gray-400 text-[#0B2B70]"
                    }`}
                >
                  {op}
                </button>
              ))}
            </div>

            <div>
              <textarea
                value={justificativaMakeBuy}
                maxLength={MAKE_MAX}
                onChange={(e) => setJustificativaMakeBuy(e.target.value)}
                placeholder="Justificativa da decisão"
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] dark:border-white/10 dark:bg-gray-900 text-black/80 dark:text-white rounded-md px-3 py-2 h-24 resize-none"
              />

              <p className="text-xs text-[#98A2B3] dark:text-white/50 mt-1 text-right">
                {justificativaMakeBuy.length}/{MAKE_MAX}
              </p>
            </div>
          </div>


          {/* Riscos Iniciais */}
          <div className="rounded-xl border border-[#E5E7EB] dark:border-[#737373] p-4">
            <h2 className="text-[#0B2B70] dark:text-white font-semibold mb-3">
              Riscos Iniciais
            </h2>

            <textarea
              value={riscosIniciais}
              maxLength={MAKE_MAX}
              onChange={(e) => setRiscosIniciais(e.target.value)}
              placeholder="Defina os riscos iniciais"
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] dark:border-white/10 dark:bg-gray-900 text-black/80 dark:text-white rounded-md px-3 py-2 h-24 resize-none"
            />

            <p className="text-xs text-[#98A2B3] dark:text-white/50 mt-1 text-right">
              {riscosIniciais.length}/{MAKE_MAX}
            </p>
          </div>

          {/* Capacidade */}
          <div className="rounded-xl border border-[#E5E7EB] dark:border-[#737373] p-4">
            <h2 className="text-[#0B2B70] dark:text-white font-semibold mb-4">
              Registre a Capacidade Técnica e Financeira
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Capacidade Técnica */}
              <div>
                <textarea
                  value={capacidadeTecnica}
                  maxLength={CAPACIDADE_MAX}
                  onChange={(e) => setCapacidadeTecnica(e.target.value)}
                  placeholder="Capacidade Técnica"
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] dark:border-white/10 dark:bg-gray-900 rounded-md px-3 py-2 min-h-[150px] resize-none text-black/80 dark:text-white"
                />

                <p className="text-xs text-[#98A2B3] dark:text-white/50 mt-1 text-right">
                  {capacidadeTecnica.length}/{CAPACIDADE_MAX}
                </p>
              </div>

              {/* Capacidade Financeira */}
              <div>
                <textarea
                  value={capacidadeFinanceira}
                  maxLength={CAPACIDADE_MAX}
                  onChange={(e) => setCapacidadeFinanceira(e.target.value)}
                  placeholder="Capacidade Financeira"
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] dark:border-white/10 dark:bg-gray-900 rounded-md px-3 py-2 min-h-[150px] resize-none text-black/80 dark:text-white"
                />

                <p className="text-xs text-[#98A2B3] dark:text-white/50 mt-1 text-right">
                  {capacidadeFinanceira.length}/{CAPACIDADE_MAX}
                </p>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}