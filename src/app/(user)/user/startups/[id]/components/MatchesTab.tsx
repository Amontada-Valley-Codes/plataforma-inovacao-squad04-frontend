"use client";

import { useEffect, useState } from "react";
import { enterpriseMatchService } from "@/api/services/enterpriseMatch.service";
import { EnterpriseMatchResponse } from "@/api/payloads/match.payload";
import { showCustomToast } from "@/components/kanban/KanbanToaster";
import AcceptedMatchesList from "./AcceptedMatchesList";
import PendingMatchesList from "./PendingMatchesList";

interface MatchesTabProps {
  startupId: string;
  startupName: string;
}

export default function MatchesTab({ startupId, startupName }: MatchesTabProps) {
  const [accepted, setAccepted] = useState<EnterpriseMatchResponse[]>([]);
  const [applications, setApplications] = useState<EnterpriseMatchResponse[]>([]);
  const [invites, setInvites] = useState<EnterpriseMatchResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, [startupId]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const [acceptedResponse, applicationsData, invitesData] = await Promise.all([
        enterpriseMatchService.getAcceptedMatches(),
        enterpriseMatchService.getPendingApplications(),
        enterpriseMatchService.getPendingInvites(),
      ]);

      // Processar matches aceitos - filtrar pela startup específica
      const startupMatches = acceptedResponse.startups.find(s => s.startup.id === startupId);
      
      if (startupMatches) {
        const acceptedList = startupMatches.challenges.map(c => ({
          id: c.matchId,
          statusMatch: "ACCEPTED",
          acceptStartup: "ACCEPTED",
          acceptEnterprise: "ACCEPTED",
          challengeId: c.id,
          enterpriseId: "",
          startupId: startupMatches.startup.id,
          Challenge: { id: c.id, name: c.name },
        }));
        setAccepted(acceptedList);
      } else {
        setAccepted([]);
      }

      setApplications(applicationsData.filter(m => m.startupId === startupId));
      setInvites(invitesData.filter(m => m.startupId === startupId));
    } catch (error) {
      console.error("Erro ao buscar matches:", error);
      showCustomToast("Erro ao carregar matches", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (matchId: string) => {
    try {
      await enterpriseMatchService.acceptApplication(matchId);
      showCustomToast("Candidatura aceita com sucesso!", "success");
      fetchMatches();
    } catch (error: any) {
      showCustomToast(error?.response?.data?.message || "Erro ao aceitar candidatura", "error");
    }
  };

  const handleDeny = async (matchId: string) => {
    try {
      await enterpriseMatchService.denyMatch(matchId);
      showCustomToast("Candidatura recusada", "success");
      fetchMatches();
    } catch (error: any) {
      showCustomToast(error?.response?.data?.message || "Erro ao recusar candidatura", "error");
    }
  };

  const handleCancel = async (matchId: string) => {
    try {
      await enterpriseMatchService.denyMatch(matchId);
      showCustomToast("Convite cancelado", "success");
      fetchMatches();
    } catch (error: any) {
      showCustomToast(error?.response?.data?.message || "Erro ao cancelar convite", "error");
    }
  };

  const handleView = (matchId: string) => {
    showCustomToast("Visualização de detalhes em desenvolvimento", "success");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Matches e Pendências de {startupName}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Visualize os matches aceitos e gerencie as pendências desta startup.
        </p>
      </div>

      <AcceptedMatchesList matches={accepted} />

      <PendingMatchesList
        applications={applications}
        invites={invites}
        onAccept={handleAccept}
        onDeny={handleDeny}
        onCancel={handleCancel}
      />
    </div>
  );
}
