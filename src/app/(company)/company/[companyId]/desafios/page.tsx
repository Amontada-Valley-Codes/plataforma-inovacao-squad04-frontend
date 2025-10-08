import ChallengeCard from "@/components/challenge/ChallengeCard";

type PageProps = { params: Promise<{ companyId: string }> };

export default async function CompanyChallenges({ params }: PageProps) {
  const { companyId } = await params; // ✅ agora é assíncrono
  const companyIdNum = Number(companyId);

  return (
    <div>
      <ChallengeCard companyId={companyIdNum} isAdminView />
    </div>
  );
}
