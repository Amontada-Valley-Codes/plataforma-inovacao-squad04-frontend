'use client'

import { CardContentsHeader } from "./CardsContents";
import CanvasMVP from "./CanvasMVP";
import { useEffect, useState } from "react";
import { ShowAllUsersResponse } from "@/api/payloads/user.payload";
import { userService } from "@/api/services/user.service";
import { sponsorsService } from "@/api/services/sponsor.service";
import MakeforBuy from "./MakeForBuy";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { CreateMvpPayload } from "@/api/payloads/materialization.payload";
import { materializationService } from "@/api/services/materialization.service";
import { BuyMaterializationService } from "@/api/services/buy-materialization.service";

export type TypeResource = "PEOPLE" | "TECHNOLOGY" | "FINANCIAL" | "OTHER" | undefined
export type Resource = {content: string; type: TypeResource}
export type Kpi = {
  id?: string
  name: string
  metric: string
  target: string
}
type CardMaterializationContentProps = {
  challengeTitle: string;
  challengeId: string;
  visibility: string;
  creator: string;
  startDate: string;
}

export function translateUserType(value?: string) {
  switch (value) {
    case "ORGANIZER":             return "Organizador";
    case "COLLABORATOR":          return "Colaborador";
    case "OBSERVER":              return "Observador";
    case "TRANSFORMATION_OFFICE": return "Escritório de Transformação";
    case "INNOVATION_TEAM":       return "Time de Inovação";
    case "STEERING_COMMITTEE":    return "Comitê Executivo";
    case "ADMINISTRATOR":         return "Administrador";
    case "MANAGER":               return "Gestor";
    case "STARTUP":               return "Startup";
    default:                      return "Outro";
  }
}

export default function Materialization({
  challengeTitle,
  visibility,
  creator,
  startDate,
  challengeId,
}: CardMaterializationContentProps) {
  const [users, setUsers] = useState<ShowAllUsersResponse>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [sponsorRelationId, setSponsorRelationId] = useState<string | null>(null);
  const [page, setPage] = useState<'1' | '2'>('1');
  const [publicoAlvo, setPublicoAlvo] = useState("")
  const [propostaValor, setPropostaValor] = useState("")
  const [items, setItems] = useState<string[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [kpis, setKpis] = useState<Kpi[]>([])
  const [mvpId, setMvpId] = useState<string | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [buyId, setBuyId] = useState<string>('')
  const [hmwProblem, setHmwProblem] = useState<string>('');
  const [rules, setRules] = useState<string>('');
  const [criteria, setCriteria] = useState<string[]>([]);

  const handleSaveMvp = async () => {
    if (page === '2') return

    try {
      const payload: CreateMvpPayload = {
        targetAudience: publicoAlvo,
        valueProposal: propostaValor,
        features: items,
        resources: resources
          .filter(r => r.type)
          .map(r => ({
            type: r.type as string,
            description: r.content
          })),
        kpis: kpis.map(k => ({
          name: k.name,
          metric: k.metric,
          target: k.target
        }))
      }

      let response

      if (mvpId) {
        response = await materializationService.updateMvp(mvpId, payload)
        toast.success("MVP atualizado com sucesso!")
      } else {
        response = await materializationService.createMvp(challengeId, payload)
        toast.success("MVP criado com sucesso!")
      }

      setMvpId(response.id)

    } catch (err) {
      console.error(err)
      toast.error("Não foi possível salvar o MVP.")
    }
  }

  async function handleSaveMB() {
    if (page === '1') return
    if ((!pdfFile && !buyId) || !hmwProblem || !rules) return;
  
    try {
      const payload = {
        hmwProblem: hmwProblem,
        challengeRules: rules,
        selectionCriteria: criteria,
        edital: pdfFile as File 
      };
  
      if (buyId) {
        await BuyMaterializationService.updateBuy(payload, buyId);
        toast.success("Buy atualizado com sucesso!")
      } else {
        await BuyMaterializationService.createBuy(payload, challengeId);
        toast.success("Buy criado com sucesso!")
      }
      
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível salvar o Buy.")
    }
  }

  const fetchSponsor = async () => {
    try {
      const [usersResponse, sponsorsResponse] = await Promise.all([
        userService.showAllUsers(),
        sponsorsService.ShowSponsors(),
      ]);

      setUsers(usersResponse);

      const currentSponsor = sponsorsResponse.find(
        (s) => s.challengeId === challengeId
      );

      if (currentSponsor) {
        setSelectedUserId(currentSponsor.sponsor.id);
        setSponsorRelationId(currentSponsor.id);
      } else {
        setSelectedUserId("");
        setSponsorRelationId(null);
      }

    } catch (err) {
      console.error(err);
      toast.error("Não foi possível carregar o Sponsor.");
    }
  };

  useEffect(() => {
    fetchSponsor();
  }, [challengeId]);

  const handleSponsorChange = async (newUserId: string) => {
    try {
      if (!newUserId || newUserId === "none") {
        if (sponsorRelationId) {
          await sponsorsService.DeleteSponsor(sponsorRelationId);
          setSponsorRelationId(null);
          setSelectedUserId("");
        }

        toast.success("Sponsor salvo com sucesso!");
        return;
      }

      if (sponsorRelationId) {
        const response = await sponsorsService.UpdateSponsor(
          sponsorRelationId,
          {
            challengeId,
            userId: newUserId,
          }
        );

        setSelectedUserId(response.sponsorId);

      } else {
        const response = await sponsorsService.AddSponsor({
          challengeId,
          userId: newUserId,
        });

        setSponsorRelationId(response.id);
        setSelectedUserId(response.sponsor.id);
      }

      toast.success("Sponsor atualizado com sucesso!");

    } catch (error) {
      console.error(error);
      toast.error("Não foi possível definir o Sponsor.");
    }
  };

  return (
    <div className="w-full flex flex-col overflow-y-auto">
      <div className="flex xl:items-center flex-col xl:flex-row xl:justify-between mb-6">
        <CardContentsHeader
          challengeTitle={challengeTitle}
          visibility={visibility}
          creator={creator}
          startDate={startDate}
        />

        <div className="relative flex flex-col xl:items-center">
          <div className="flex gap-8 xl:gap-4 items-center xl:justify-center w-full max-w-md">
            <div className="flex flex-col items-center">
              <button
                className={`w-8 h-8 rounded-full font-semibold flex items-center justify-center transition-colors ${
                  page === '1'
                    ? "bg-[#0B2B72] text-white"
                    : "border-2 border-gray-400 text-gray-500"
                }`}
                onClick={() => {
                  setPage('1')
                  handleSaveMvp()
                }}
              >
                1
              </button>
              <span className="text-sm mt-1 text-center flex flex-col leading-tight">
                <span className="mt-0.5">Canvas</span>
                <span>MVP</span>
              </span>
            </div>

            <div className="flex flex-col items-center">
              <button
                className={`w-8 h-8 rounded-full font-semibold flex items-center justify-center transition-colors ${
                  page === '2'
                    ? "bg-[#0B2B72] text-white"
                    : "border-2 border-gray-400 text-gray-500"
                }`}
                onClick={() => {
                  handleSaveMB()
                  setPage('2')
                }}
              >
                2
              </button>
              <span className="text-sm mt-1 text-center flex flex-col leading-tight">
                <span className="mt-0.5">Materialização</span>
                <span>para Buy</span>
              </span>
            </div>
          </div>
          <span className="text-xs w-fit text-[#98A2B3] whitespace-nowrap dark:text-white/40 mt-4">
            Clique na respectiva página para salvar.
          </span>
        </div>
      </div>

      <div>
        {page === '1' && (
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-[24px] text-[#0B2B70] dark:text-white font-semibold">
              Canvas do MVP
            </h1>

            <Select
              value={selectedUserId || "none"}
              onValueChange={handleSponsorChange}
            >
              <SelectTrigger className="w-[220px] bg-[#E7EEFF] hover:bg-[#dee2ec] text-[#0B2B70] font-semibold border-none rounded-[8px] transition-colors dark:bg-[#1a2f6e] dark:text-white dark:hover:bg-[#1e3580]">
                <SelectValue placeholder="Definir Sponsor" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="none">
                  Definir Sponsor
                </SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} — {translateUserType(user.type_user)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {page === '1' ? (
          <CanvasMVP 
            challengeId={challengeId}
            items={items}
            kpis={kpis}
            mvpId={mvpId}
            propostaValor={propostaValor}
            publicoAlvo={publicoAlvo}
            resources={resources}
            setItems={setItems}
            setKpis={setKpis}
            setMvpId={setMvpId}
            setPropostaValor={setPropostaValor}
            setPublicoAlvo={setPublicoAlvo}
            setResources={setResources}
          />
        ) : (
          <MakeforBuy 
            challengeId={challengeId}
            buyId={buyId}
            criteria={criteria}
            hmwProblem={hmwProblem}
            pdfFile={pdfFile}
            rules={rules}
            setBuyId={setBuyId}
            setCriteria={setCriteria}
            setHmwProblem={setHmwProblem}
            setPdfFile={setPdfFile}
            setRules={setRules} 
          />
        )}
      </div>
    </div>
  );
}