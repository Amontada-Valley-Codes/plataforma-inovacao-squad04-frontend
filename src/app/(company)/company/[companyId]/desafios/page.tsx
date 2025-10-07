import ChallengeCard from "@/components/challenge/ChallengeCard";

export default async function CompanyChallenges({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params; 

  return (
    <div>
      <ChallengeCard companyId={companyId} isAdminView />
    </div>
  );
}
