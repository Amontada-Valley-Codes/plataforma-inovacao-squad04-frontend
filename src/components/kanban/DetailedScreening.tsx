"use client"
import { CardContentsHeader } from "./CardsContents"
import { useEffect, useState } from "react"
import { Bug, Lightbulb, Trophy, Building2, ChartNoAxesCombined, ChartPie, TriangleAlert } from "lucide-react"
import { Rating, ProgressBarActions } from "./CardsContents"
import { ShowDetailedScreeningResponse } from "@/api/payloads/detailedScreening.payload"
import { detailedScreeningService } from "@/api/services/detailedScreening.service"
import { UpdateDetailedScreeningPayload } from "@/api/payloads/detailedScreening.payload"

type CardDetailedScreeningContentProps = {
  challangeTitle: string;
  challengeId: string;  
  category: string;
  startDate: string;
  endDate: string;
  creator: string;
  visibility: string;
}

export const DetailedScreening = ({ challangeTitle, challengeId, category, startDate, endDate, creator, visibility }: CardDetailedScreeningContentProps) => {
  //hook para navegar nas duas paginas da triagem detalhada
  const [page, setPage] = useState('1')
  const [detailedScreening, setDetailedScreening] = useState<ShowDetailedScreeningResponse>()
  const [vote, setVote] = useState({
    viabilidade_tecnica: 0,
    impacto_financeiro: 0,
    aderencia_estrategica: 0,
    risco: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetailedScreening() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await detailedScreeningService.showDetailedScreening(challengeId);
        setDetailedScreening(response);
        setVote({
        viabilidade_tecnica: response.viabilidade_tecnica || 0,
        impacto_financeiro: response.impacto_financeiro || 0,
        aderencia_estrategica: response.aderencia_estrategica || 0,
        risco: response.risco || 0
      });
      } catch (err) {
        console.error(err);
        setError("Falha ao carregar os dados da triagem.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchDetailedScreening();
  }, [challengeId]);

  const handleChange = (field: keyof ShowDetailedScreeningResponse, value: string) => {
    setDetailedScreening(prev => prev ? { ...prev, [field]: value } : prev);
  };

  const handleSave = async () => {
    if (!detailedScreening) return;

    const payload: UpdateDetailedScreeningPayload = {
      problema: detailedScreening.problema,
      solucao: detailedScreening.solucao,
      beneficios: detailedScreening.beneficios,
      api: detailedScreening.api,
      tipoApi: detailedScreening.tipoApi,
      stackes: detailedScreening.stackes,
      numeroDeSprints: String(detailedScreening.numeroDeSprints),
      investimento: detailedScreening.investimento,
      custo: detailedScreening.custo,
      beneficiosMensal: detailedScreening.beneficiosMensal,
      pilarEstrategico: detailedScreening.pilarEstrategico,
      principalRisco: detailedScreening.principalRisco,
      mitigacao: detailedScreening.mitigacao,
      responsavel: detailedScreening.responsavel,
      prazo: detailedScreening.prazo,
    };

    try {
      await detailedScreeningService.updateDetailedScreening(detailedScreening.id, payload);
      console.log("Triagem atualizada com sucesso!");
    } catch (err) {
      console.error(err);
      console.error("Falha ao salvar as alterações:", err);
    }
  };

  const handleVote = async () => {
    if (!detailedScreening) {
      console.log("❌ Erro ao registrar voto: dados não carregados.");
      return
    }

    try {
      const response = await detailedScreeningService.voteDetailedScreening(
        detailedScreening.id,
        vote
      );
      console.log(response.message);
      setDetailedScreening(prev => prev ? { ...prev, porcentagemMedia: response.porcentagemMedia } : prev);
      alert("✅ " + response.message);
    } catch (err) {
      console.error(err);
      console.error("❌ Erro ao registrar voto", err);
    }
  };

  if (isLoading) {
    return <div className="w-full flex items-center justify-center h-full">Carregando...</div>;
  }

  if (error) {
    return <div className="w-full flex items-center justify-center h-full text-red-500">{error}</div>;
  }
  
  if (!detailedScreening) {
     return <div className="w-full flex items-center justify-center h-full">Dados não encontrados.</div>;
  }

  return (
    <div className="w-full flex flex-col overflow-y-auto scrollbar-hidden">
      {/* header */}
      <div className="flex flex-col xl:flex-row xl:justify-between mb-6">
        <CardContentsHeader
          challengeTitle={challangeTitle}
          category={category}
          startDate={startDate}
          endDate={endDate}
          creator={creator}
          visibility={visibility}
        />

        <div className="relative flex items-center">
          <div className="flex gap-4 items-center xl:justify-center w-full max-w-md">
            <div className="flex flex-col items-center">
              <button 
                className={`w-8 h-8 rounded-full font-semibold flex items-center justify-center ${
                  page === '1' ? "bg-[#0B2B72] text-white" : "border-gray-400 border-2 text-gray-500"
                }`}
                onClick={() => setPage('1')}
              >
                1
              </button>
              <span className="text-sm mt-1 whitespace-nowrap">Contexto da Ideia</span>
            </div>

            <div className="flex flex-col items-center">
              <button 
                className={`w-8 h-8 rounded-full  font-semibold flex items-center justify-center ${
                  page === '2' ? "bg-[#0B2B72] text-white" : "border-gray-400 border-2 text-gray-500"
                }`}
                onClick={() => setPage('2')}
              >
                2
              </button>
              <span className="text-sm mt-1">Triagem</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* pagina 1 - resumo */}
      {page === '1' && detailedScreening && (
        <div className="w-full flex flex-col h-full">
          <h1 className="text-[#0B2B72] text-2xl font-semibold mb-4">Canvas Rápido</h1>

          <div className="flex-1 flex flex-col gap-3">
            <div className="flex flex-col md:flex-row gap-3 flex-1">
              <div className="w-full md:w-1/2 flex flex-col rounded-[12px] border-2 border-[#E5E7EB] px-4 py-2">
                <h1 className="flex items-center justify-between text-[#0B2B72] text-lg font-semibold mb-2">
                  Problema
                  <Bug size={20}/>
                </h1>

                <textarea
                  className="w-full flex-1 bg-transparent outline-none resize-none overflow-y-auto"
                  placeholder="Qual o resultado esperado?"
                  value={detailedScreening.problema}
                  onChange={(e) => handleChange("problema", e.target.value)}
                  rows={6}
                />
              </div>

              <div className="w-full md:w-1/2 flex flex-col rounded-[12px] border-2 border-[#E5E7EB] px-4 py-2">
                <h1 className="flex items-center justify-between text-[#0B2B72] text-lg font-semibold mb-2">
                  Solução
                  <Lightbulb size={20}/>
                </h1>

                <textarea
                  className="w-full flex-1 bg-transparent outline-none resize-none h-full overflow-y-auto"
                  placeholder="Qual o resultado esperado?"
                  value={detailedScreening.solucao}
                  onChange={(e) => handleChange("solucao", e.target.value)}
                  rows={6}
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col rounded-[12px] border-2 border-[#E5E7EB] px-4 py-2">
              <h1 className="flex items-center justify-between text-[#0B2B72] text-lg font-semibold mb-2">
                Resultado Esperado
                <Trophy size={20}/>
              </h1>

              <textarea
                className="w-full flex-1 bg-transparent outline-none resize-none h-full overflow-y-auto"
                placeholder="Qual o resultado esperado?"
                value={detailedScreening.beneficios}
                onChange={(e) => handleChange("beneficios", e.target.value)}  
                rows={6}
              />
            </div>
          </div>

          <button
            className="mt-4 px-4 py-2 bg-[#0B2B72] text-white rounded-md self-end"
            onClick={handleSave}
          >
            Salvar Alterações
          </button>
        </div>
      )}

      {/* pagina 2 - triagem */}
      {page === '2' && (
        <div className="flex flex-col w-full">
          <form action="">
            {/* viabilidade tecnica */}
            <div className="flex flex-col mb-6">
              <h1 className="flex gap-1 items-center text-black text-lg">
                Viabilidade Técnica
              </h1>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  
                  {/* Input: API's/Documentação */}
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="flex items-center rounded-lg border px-3 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
                      <Building2 className="text-[#98A2B3] mr-2" size={18} />
                      <input 
                        type="text" 
                        placeholder="APIs / documentação"
                        value={detailedScreening.api}
                        onChange={(e) => handleChange("api", e.target.value)}
                        className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                      />
                    </div>
                  </div>

                  {/* Input: Stacks Compatíveis */}
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="flex items-center rounded-lg border px-3 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
                      <Building2 className="text-[#98A2B3] mr-2" size={18} />
                      <input 
                        type="text" 
                        placeholder="Stacks Compatíveis"
                        value={detailedScreening.stackes}
                        onChange={(e) => handleChange("stackes", e.target.value)}
                        className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                      />
                    </div>
                  </div>

                  {/* Input: Nº de Sprints Esperadas */}
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="flex items-center rounded-lg border px-3 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
                      <Building2 className="text-[#98A2B3] mr-2" size={18} />
                      <input 
                        type="text" 
                        placeholder="Nº de sprints esperadas"
                        value={detailedScreening.numeroDeSprints}
                        onChange={(e) => handleChange("numeroDeSprints", e.target.value)}
                        className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                      />
                    </div>
                  </div>
                </div>

                {/* Seção de Rádios */}
                <div className="flex flex-col gap-[2px] mt-2">
                  {["N", "API Externa", "API Interna", "Outro"].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tipo-api"
                        value={opt.toUpperCase().replace(" ", "_")}
                        checked={detailedScreening.tipoApi === opt.toUpperCase().replace(" ", "_")}
                        onChange={() => handleChange("tipoApi", opt.toUpperCase().replace(" ", "_"))}
                        className="hidden peer"
                      />
                      <span className="w-3 h-3 rounded-full border border-[#0B2B70] peer-checked:bg-[#0B2B70]"></span>
                      <span className="text-sm">{opt === "Outro" ? "Outro..." : opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Rating
                value={vote.viabilidade_tecnica}
                onChange={(v) => setVote(prev => ({ ...prev, viabilidade_tecnica: v }))}
              />
            </div>

            {/* impacto financeiro */}
            <div className="flex flex-col mb-6">
              <h1 className="flex gap-1 items-center   text-black text-lg mb-2">
                Impacto Financeiro
              </h1>
              <div className="flex flex-col gap-2">

                <div className="flex gap-4 text-sm items-center">
                  <div className="flex-1 flex items-center rounded-lg border px-3 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
                    <ChartNoAxesCombined className="text-[#98A2B3] mr-2" size={18} />
                    <input 
                      type="text" 
                      value={detailedScreening.investimento}
                      onChange={(e) => handleChange("investimento", e.target.value)}
                      placeholder="Investimento inicial estimado (CAPEX)"
                      className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                    />
                  </div>
                </div>

                <div className="flex gap-4 text-sm items-center">
                  <div className="flex-1 flex items-center rounded-lg border px-3 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
                    <ChartNoAxesCombined className="text-[#98A2B3] mr-2" size={18} />
                    <input 
                      type="text" 
                      value={detailedScreening.custo}
                      onChange={(e) => handleChange("custo", e.target.value)}
                      placeholder="Custo mensal estimado (OPEX)"
                      className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                    />
                  </div>
                </div>

                <div className="flex gap-4 text-sm items-center">
                  <div className="flex-1 flex items-center rounded-lg border px-3 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
                    <ChartNoAxesCombined className="text-[#98A2B3] mr-2" size={18} />
                    <input 
                      type="text" 
                      placeholder="Benefício esperado (mensal)"
                      value={detailedScreening.beneficiosMensal}
                      onChange={(e) => handleChange("beneficiosMensal", e.target.value)}
                      className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                    />
                  </div>
                </div>
              </div>

              <Rating
                value={vote.impacto_financeiro}
                onChange={(v) => setVote(prev => ({ ...prev, impacto_financeiro : v }))}
              />
            </div>

            {/* aderencia estrategica */}
            <div className="flex flex-col mb-6">
              <h1 className="flex gap-1 items-center text-black text-lg mb-2">
                Aderência Estratégica
              </h1>
              <div className="flex flex-col gap-2">
                <div className="flex gap-4 text-sm items-center">
                  <div className="flex-1 flex items-center rounded-lg border px-3 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
                    <ChartPie className="text-[#98A2B3] mr-2" size={18} />
                    <input 
                      type="text" 
                      placeholder="Pilar Estratégico"
                      value={detailedScreening.pilarEstrategico}
                      onChange={(e) => handleChange("pilarEstrategico", e.target.value)}
                      className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                    />
                  </div>
                </div>
              </div>
              <Rating
                value={vote.aderencia_estrategica}
                onChange={(v) => setVote(prev => ({ ...prev, aderencia_estrategica: v }))}
              />
            </div>

            {/* riscos */}
            <div className="flex flex-col mb-6">
              <h1 className="flex gap-1 items-center text-black text-lg mb-2">
                Riscos
              </h1>
              <div className="flex flex-col gap-2">
                
                <div className="flex gap-4 text-sm items-center">
                  <div className="flex-1 flex items-center rounded-lg border px-3 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
                    <TriangleAlert className="text-[#98A2B3] mr-2" size={18} />
                    <input 
                      type="text" 
                      placeholder="Principal risco identificado"
                      value={detailedScreening.principalRisco}
                      onChange={(e) => handleChange("principalRisco", e.target.value)}
                      className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                    />
                  </div>
                </div>

                <div className="flex gap-4 text-sm items-center">
                  <div className="flex-1 flex items-center rounded-lg border px-3 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
                    <TriangleAlert className="text-[#98A2B3] mr-2" size={18} />
                    <input 
                      type="text" 
                      placeholder="Mitigação Proposta"
                      value={detailedScreening.mitigacao}
                      onChange={(e) => handleChange("mitigacao", e.target.value)}
                      className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                    />
                  </div>
                </div>

                <div className="flex gap-4 text-sm items-center">
                  <div className="flex-1 flex items-center rounded-lg border px-3 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
                    <TriangleAlert className="text-[#98A2B3] mr-2" size={18} />
                    <input 
                      type="text" 
                      placeholder="Responsável"
                      value={detailedScreening.responsavel}
                      onChange={(e) => handleChange("responsavel", e.target.value)}
                      className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                    />
                  </div>
                </div>

                {/* Input: Nº de Sprints Esperadas */}
                <div className="flex gap-4 text-sm items-center">
                  <div className="flex-1 flex items-center rounded-lg border px-3 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
                    <TriangleAlert className="text-[#98A2B3] mr-2" size={18} />
                    <input 
                      type="text" 
                      placeholder="Prazo"
                      value={detailedScreening.prazo?.split("T")[0] || ""}
                      onChange={(e) => handleChange("prazo", e.target.value)}
                      className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                    />
                  </div>
                </div>
              </div>
              <Rating
                value={vote.risco}
                onChange={(v) => setVote(prev => ({ ...prev, risco: v }))}
              />
            </div>
          </form>
          <ProgressBarActions percentage={Number(detailedScreening.porcentagemMedia.replace("%", ''))}/>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleVote}
              className="px-5 py-2 bg-[#0B2B72] text-white font-semibold rounded-md hover:bg-[#0A2461] transition disabled:opacity-50"
              disabled={!detailedScreening}
            >
              Registrar Voto
            </button>
          </div>
        </div>
      )}
    </div>
  )
}