import ChallengeCard from "@/components/challenge/ChallengeCard";

export default function CompanyChallenges({
  params,
}: {
  params: { companyId: string };
}) {
  const { companyId } = params; // já é síncrono

  return (
    <div>
      <ChallengeCard companyId={Number(companyId)} isAdminView />
    </div>
  );
}
