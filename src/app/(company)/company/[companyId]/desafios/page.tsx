import ChallengeCard from "@/components/challenge/ChallengeCard";

type PageProps = { params: Promise<{ companyId: string }> };

export default async function CompanyChallenges({ params }: PageProps) {

  await params;

  return (
    <div>
      <ChallengeCard />
    </div>
  );
}