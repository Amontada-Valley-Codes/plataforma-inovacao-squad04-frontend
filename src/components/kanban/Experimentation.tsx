/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import { useCallback, useEffect, useState } from "react";
import { CardContentsHeader } from "./CardsContents"
import { Toaster } from "react-hot-toast";
import CanvasPoC from "./CanvasPoc";
import ResultsReport from "./ResultsReport";
import { CreateExperimentationResponse, ShowExperimentationResponse, ShowResultsReportResponse } from "@/api/payloads/experimentation.payload";
import { experimentationService } from "@/api/services/experimentation.service";
import StatusReportPoC, { Entry } from "./StatusRerpotPoc";
import { toast } from "sonner";
import { statusReportService } from "@/api/services/statusReport.service";


type CardExperimentationContentProps = {
  challangeTitle: string;
  challengeId: string
  category: string;
  description: string;
  startDate: string;
  creator: string;
  visibility: string;
}

export type poCIndicators = {
    id: string;
    name: string;
    target: string;
    metric: string;
    pocId: string;
    kpiId: string | null;
    createdAt: string;
}

export type pocHypotheses = {
    id: string;
    description: string;
    status: string;
    pocId: string;
}

type ExperimentationState = (ShowExperimentationResponse | CreateExperimentationResponse) & { poc?: any }

export const Experimentation = ({ challangeTitle, challengeId, category, startDate, creator, visibility }: CardExperimentationContentProps) => {
  const [experimentation, setExperimentation] = useState<ExperimentationState | undefined>()
  const [objective, setObjective] = useState("")
  const [scope, setScope] = useState("")
  const [indicators, setIndicators] = useState<poCIndicators[]>([])
  const [hypotheses, setHypotheses] = useState<pocHypotheses[]>([])
  const [avancosSemana, setAvancosSemana] = useState<Entry>({
    text: "",
    createdAt: new Date().toISOString(),
    responsible: creator ?? "",
  });
  const [problemasEncontrados, setProblemasEncontrados] = useState<Entry>({
    text: "",
    createdAt: new Date().toISOString(),
    responsible: creator ?? "",
  });
  const [proximosPassos, setProximosPassos] = useState<Entry>({
    text: "",
    createdAt: new Date().toISOString(),
    responsible: creator ?? "",
  });
  const [statusReportId, setStatusReportId] = useState<string | null>(null);
  const [report, setReport] = useState<ShowResultsReportResponse | null>(null)
  const [executiveSummary, setExecutiveSummary] =useState("")
  const [learnings, setLearnings] = useState<string[]>([])
  const [recommendationTxt, setRecommendationTxt] = useState("")
  const [finalDecision, setFinalDecision] = useState<"SCALE" | "ADJUST" | "CLOSE">("SCALE")

  const loadReport = async () => {
    if (!experimentation?.poc) return 

    const res = await experimentationService.showReport(experimentation?.poc.id)
    setReport(res)
    setExecutiveSummary(res.executiveSummary)
    setLearnings(res.learnings)
    setRecommendationTxt(res.recommendationTxt)
    setFinalDecision(res.recommendation as any)
  }
  
  useEffect(() => {
    if (!experimentation?.poc?.id) return
    loadReport()
  }, [experimentation?.poc?.id])

  const handleSaveReport = async () => {
    if (page !== "3") return
    if (!experimentation?.poc) return;

    try {
      const payload = {
        executiveSummary,
        learnings,
        recommendation: finalDecision,
        recommendationTxt,
        kpis: []
      };

      if (report) {
        const updated = await experimentationService.updateReport(report.id, payload);
        toast.success("Relatório atualizado com sucesso!");
        setReport(updated);
      } else {
        const created = await experimentationService.createReport(
          experimentation.poc.id,
          payload
        );
        toast.success("Relatório criado com sucesso!");
        setReport(created);
      }

      await loadReport();

    } catch (err: any) {
      console.error("SAVE REPORT ERROR:", err?.response?.data);
      toast.error(err.response?.data?.message || "Erro ao salvar o Relatório.")
    }
  };

  const handleSaveStatus = async () => {
    if (page !== "2") return

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
        
        toast.success("Report atualizado com sucesso!")
        setStatusReportId(updated.id);
      } else {
        const created = await statusReportService.createStatus(
          challengeId,
          payload
        );
        
        toast.success("Report criado com sucesso!")
        setStatusReportId(created.id);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erro ao salvar o Report.")
      console.log("CREATE STATUS REPORT ERROR DATA:", err?.response?.data);
    }
  };

  const handleSavePoc = async () => {
    if (page !== "1") return

    try {
      await experimentationService.updatePoc(experimentation?.poc.id, {
        objective: objective,
        scope: scope
      });
  
      updateObjective(objective);
      updateScope(scope);

      toast.success("PoC atualizada com sucesso!")
    } catch (err: any) {
      console.error("Erro ao salvar PoC:", err.response?.data || err);
      toast.error(
        err.response?.data?.message ||
        "Não foi possível salvar a PoC."
      )
    }
  }
  
  useEffect(() => {
    if (!experimentation?.poc?.id) return

    setIndicators(experimentation?.poc?.poCIndicators ?? [])
    setHypotheses(experimentation?.poc?.pocHypotheses ?? [])
    setObjective(experimentation?.poc?.objective ?? "")
    setScope(experimentation?.poc?.scope ?? "")
  }, [experimentation?.poc?.id])

  const initExperimentation = useCallback(async () => {
    try {
      const res = await experimentationService.showExperimentation(challengeId)

      if (res.id) {
        setExperimentation(res)
        return
      }

      const newExp = await experimentationService.createExperimentation(challengeId)

      setExperimentation(newExp)
    } catch (err: any) {
      if (err?.response?.status === 409) {
        const res = await experimentationService.showExperimentation(challengeId)
        setExperimentation(res)
        return
      }

      console.error("Erro ao inicializar a experimentação:", err)
    }
  }, [challengeId])

  const updateObjective = async (newObjective: string) => {
    if (!experimentation?.poc) return

    const updatedPoc = await experimentationService.updatePoc(
      experimentation.poc.id,
      { objective: newObjective, scope: experimentation.poc.scope }
    )

    setExperimentation(prev => prev && { ...prev, poc: updatedPoc })
  }

  const updateScope = async (newScope: string) => {
    if (!experimentation?.poc) return

    const updatedPoc = await experimentationService.updatePoc(
      experimentation.poc.id,
      { objective: experimentation.poc.objective, scope: newScope }
    )

    setExperimentation(prev => prev && { ...prev, poc: updatedPoc })
  }

  useEffect(() => {
    setExperimentation(undefined)
  }, [challengeId])

  useEffect(() => {
    initExperimentation()
  }, [initExperimentation])

  useEffect(() => {
    if (!experimentation?.id) return
    if (experimentation.poc) return

    experimentationService.createPoc(experimentation.id, {
      objective: "",
      scope: ""
    }).then(poc => {
      setExperimentation(prev => prev && { ...prev, poc })
    }).catch(err => {
      console.error("Erro ao criar PoC:", err)
    })
  }, [experimentation?.id, experimentation?.poc])
    
  const [page, setPage] = useState<'1' | '2' | '3'>('1')
  return (
    <div className="w-full flex flex-col overflow-y-auto">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="flex xl:items-center flex-col xl:flex-row xl:justify-between mb-6">
        <CardContentsHeader
          challengeTitle={challangeTitle}
          category={category}
          startDate={startDate}
          creator={creator}
          visibility={visibility}
        />
        <div className="relative flex flex-col xl:items-center">
          <div className="flex gap-8 xl:gap-4 items-center xl:justify-center w-full max-w-md">
            <div className="flex flex-col items-center">
              <button
                className={`w-8 h-8 rounded-full font-semibold flex items-center justify-center ${page === '1' ? "bg-[#0B2B72] text-white" : "border-gray-400 border-2 text-gray-500"
                  }`}
                onClick={() => {
                  handleSavePoc()
                  setPage('1')
                }}
              >
                1
              </button>
              <span className="text-sm mt-1 whitespace-nowrap">Canvas PoC</span>
            </div>

            <div className="flex flex-col items-center">

              <button
                className={`w-8 h-8 rounded-full font-semibold flex items-center justify-center ${page === '2'
                    ? "bg-[#0B2B72] text-white"
                    : "border-gray-400 border-2 text-gray-500"
                  }`}
                onClick={() => {
                  handleSaveStatus()
                  setPage('2')
                }}
              >
                2
              </button>
              <span className="text-sm mt-1 whitespace-nowrap">
                Report da Poc
              </span>
            </div>


            <div className="flex flex-col items-center">
              <button
                className={`w-8 h-8 rounded-full  font-semibold flex items-center justify-center ${page === '3' ? "bg-[#0B2B72] text-white" : "border-gray-400 dark:placeholder:text-white border-2 text-gray-500"
                  }`}
                onClick={() => {
                  handleSaveReport()
                  setPage('3')
                }}
              >
                3
              </button>
              <span className="text-sm mt-1 text-center flex flex-col leading-tight">
                <span className="mt-0.5">Relatório</span>
              </span>
            </div>
          </div>
          <span className="text-xs w-fit text-[#98A2B3] whitespace-nowrap dark:text-white/40 mt-4">
            Clique na respectiva página para salvar.
          </span>
        </div>
      </div>

      <div>
        {page === '1' && experimentation?.poc &&
          <CanvasPoC
            poc={experimentation.poc}
            updateObjective={updateObjective}
            updateScope={updateScope}
            hypotheses={hypotheses}
            indicators={indicators}
            objective={objective}
            scope={scope}
            setHypotheses={setHypotheses}
            setIndicators={setIndicators}
            setObjective={setObjective}
            setScope={setScope}
          />
        }

        {page === '2' && (
          <StatusReportPoC
            challengeId={challengeId}
            responsibleName={creator}
            avancosSemana={avancosSemana}
            problemasEncontrados={problemasEncontrados}
            proximosPassos={proximosPassos}
            setAvancosSemana={setAvancosSemana}
            setProblemasEncontrados={setProblemasEncontrados}
            setProximosPassos={setProximosPassos}
            setStatusReportId={setStatusReportId}
            statusReportId={statusReportId}
          />
        )}

        {page === '3' && experimentation?.poc &&
          <ResultsReport 
            pocId={experimentation.poc.id}
            executiveSummary={executiveSummary}
            finalDecision={finalDecision}
            learnings={learnings}
            recommendationTxt={recommendationTxt}
            report={report}
            setExecutiveSummary={setExecutiveSummary}
            setFinalDecision={setFinalDecision}
            setLearnings={setLearnings}
            setRecommendationTxt={setRecommendationTxt}
            setReport={setReport}
          />
        }
      </div>
    </div>
  )
}