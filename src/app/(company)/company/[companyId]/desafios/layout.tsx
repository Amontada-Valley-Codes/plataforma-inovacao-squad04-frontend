import ChallengeFilter from "@/components/header/ChallengeFilter";

export default function CompanyChallengeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div>
        <ChallengeFilter IsChallenge/>
      </div>

      <div className="flex-1 p-2">
        {children}
      </div>
    </>
  )
}