import ChallengeFilter from "@/components/header/ChallengeFilter";

export default function ChallengeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-0">{/* gap 0 */}
      {/* Filtro */}
      <div className="w-full min-w-0 px-2 sm:px-4 md:px-6 -mb-2 sm:-mb-3 md:-mb-4">
        {/* puxa o bloco de filtros pra “grudar” no conteúdo */}
        <div className="min-w-0">
          <ChallengeFilter isStartup />
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 min-w-0 px-2 sm:px-4 md:px-6 pt-1 sm:pt-2 md:pt-3 pb-2 sm:pb-4 md:pb-6">
        {children}
      </div>
    </div>
  );
}
