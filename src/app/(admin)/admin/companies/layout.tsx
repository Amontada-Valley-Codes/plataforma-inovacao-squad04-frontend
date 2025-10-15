import ChallengeFilter from "@/components/header/ChallengeFilter";

export default function CompanieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-0">{/* tiramos o gap entre seções */}
      {/* Filtro */}
      <div className="w-full min-w-0 px-2 sm:px-4 md:px-6 -mb-2 sm:-mb-3 md:-mb-4">
        {/* puxamos o filtro pra “grudar” no conteúdo */}
        <ChallengeFilter isCompanie />
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 min-w-0 px-2 sm:px-4 md:px-6 pt-1 sm:pt-2 md:pt-3 pb-2 sm:pb-4 md:pb-6 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
