"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { startupService } from "@/api/services/startup.service";
import { ShowAllStartupsResponse } from "@/api/payloads/startup.payload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, FileText, Users, Send, Settings2 } from "lucide-react";
import InviteTab from "./components/InviteTab";
import MatchesTab from "./components/MatchesTab";

export default function StartupDetailsPage() {
  const params = useParams();
  const startupId = params.id as string;
  const [startup, setStartup] = useState<ShowAllStartupsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        const data = await startupService.showOneStartup(startupId);
        setStartup(data);
      } catch (error) {
        console.error("Erro ao buscar startup:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStartup();
  }, [startupId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Startup não encontrada</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto p-6 space-y-6">
      {/* Informações Básicas da Startup */}
      <div className="w-full bg-[#15358D] dark:bg-[#0f2563] text-white rounded-xl px-6 py-4 flex flex-wrap items-center gap-x-8 gap-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-white text-lg leading-tight">
              {startup.name}
            </h2>
            <span className="text-xs text-white/80">{startup.industry_segment}</span>
          </div>
        </div>

        {startup.cnpj && (
          <div className="flex items-center gap-2 text-sm text-white">
            <FileText className="w-4 h-4 text-white/80" />
            <span>{startup.cnpj}</span>
          </div>
        )}

        {startup.founders && startup.founders.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-white">
            <Users className="w-4 h-4 text-white/80" />
            <span>{startup.founders.join(", ")}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <main className="min-w-0">
        <Tabs defaultValue="invite" className="w-full">
          <TabsList className="mb-6 bg-card dark:bg-gray-800 border border-border">
            <TabsTrigger
              value="invite"
              className="gap-2 data-[state=active]:bg-[#15358D] data-[state=active]:text-white"
            >
              <Send className="w-4 h-4" />
              Convidar para Desafios
            </TabsTrigger>
            <TabsTrigger
              value="matches"
              className="gap-2 data-[state=active]:bg-[#15358D] data-[state=active]:text-white"
            >
              <Settings2 className="w-4 h-4" />
              Gerenciar Matches
            </TabsTrigger>
          </TabsList>

          <TabsContent value="invite">
            <InviteTab startupId={startupId} startupName={startup.name} />
          </TabsContent>

          <TabsContent value="matches">
            <MatchesTab startupId={startupId} startupName={startup.name} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
