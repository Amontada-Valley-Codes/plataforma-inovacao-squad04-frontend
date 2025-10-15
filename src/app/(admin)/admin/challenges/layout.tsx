import ChallengeFilter from "@/components/header/ChallengeFilter";

export default function ChallengeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {/* Filtro */}
      <div className="w-full px-2 sm:px-4 md:px-6">
        <ChallengeFilter IsChallenge />
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 p-2 sm:p-4 md:p-6 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
