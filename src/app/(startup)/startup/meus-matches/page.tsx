"use client";

import { useEffect, useState } from "react";
import { matchService } from "@/api/services/match.service";
import { StartupMatchResponse } from "@/api/payloads/match.payload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatchListItem } from "@/components/startup/MatchListItem";
import { showCustomToast } from "@/components/kanban/KanbanToaster";

export default function MeusMatchesPage() {
  const [sentApplications, setSentApplications] = useState<StartupMatchResponse[]>([]);
  const [receivedInvites, setReceivedInvites] = useState<StartupMatchResponse[]>([]);
  const [accepted, setAccepted] = useState<StartupMatchResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      
      const [sentData, invitesData, acceptedData] = await Promise.all([
        matchService.getPendingMatches(),
        matchService.getReceivedInvites(),
        matchService.getAcceptedMatches(),
      ]);
      
      setSentApplications(sentData);
      setReceivedInvites(invitesData);
      setAccepted(acceptedData);
    } catch (error) {
      console.error("❌ Erro ao buscar matches:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleAccept = async (matchId: string) => {
    try {
      await matchService.acceptInvite(matchId);
      showCustomToast("Convite aceito com sucesso!", "success");
      fetchMatches();
    } catch (error: any) {
      showCustomToast(error?.response?.data?.message || "Erro ao aceitar convite", "error");
    }
  };

  const handleDeny = async (matchId: string) => {
    try {
      await matchService.denyMatch(matchId);
      showCustomToast("Candidatura cancelada com sucesso!", "success");
      fetchMatches();
    } catch (error: any) {
      showCustomToast(error?.response?.data?.message || "Erro ao cancelar candidatura", "error");
    }
  };

  const handleView = (matchId: string) => {
    // TODO: Implementar visualização de detalhes do match
  };


  if (loading) {
    return (
      <div className="flex min-h-screen w-full">
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6">
          <Tabs defaultValue="sent" className="w-full">
            <TabsList className="mb-5 bg-card dark:bg-gray-800 border border-border">
              <TabsTrigger
                value="sent"
                className="data-[state=active]:bg-[#15358D] data-[state=active]:text-white"
              >
                Candidaturas Enviadas
                <span className="ml-1.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs px-2 py-0.5 font-medium">
                  {sentApplications.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="invites"
                className="data-[state=active]:bg-[#15358D] data-[state=active]:text-white"
              >
                Convites Recebidos
                <span className="ml-1.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-0.5 font-medium">
                  {receivedInvites.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="accepted"
                className="data-[state=active]:bg-[#15358D] data-[state=active]:text-white"
              >
                Matches Aceitos
                <span className="ml-1.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs px-2 py-0.5 font-medium">
                  {accepted.length}
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sent">
              <div className="space-y-3">
                {sentApplications.map((match) => (
                  <MatchListItem key={match.id} match={match} variant="sent" onDeny={handleDeny} />
                ))}
                {sentApplications.length === 0 && (
                  <p className="text-center py-10 text-muted-foreground">
                    Nenhuma candidatura pendente.
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="invites">
              <div className="space-y-3">
                {receivedInvites.map((match) => (
                  <MatchListItem
                    key={match.id}
                    match={match}
                    variant="invite"
                    onAccept={handleAccept}
                    onDeny={handleDeny}
                  />
                ))}
                {receivedInvites.length === 0 && (
                  <p className="text-center py-10 text-muted-foreground">
                    Nenhum convite pendente.
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="accepted">
              <div className="space-y-3">
                {accepted.map((match) => (
                  <MatchListItem
                    key={match.id}
                    match={match}
                    variant="accepted"
                    onView={handleView}
                  />
                ))}
                {accepted.length === 0 && (
                  <p className="text-center py-10 text-muted-foreground">
                    Nenhum match aceito ainda.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
