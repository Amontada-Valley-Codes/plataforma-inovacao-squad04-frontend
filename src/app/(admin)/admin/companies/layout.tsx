import ChallengeFilter from "@/components/header/ChallengeFilter";

export default function CompanieLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div>
        <ChallengeFilter isCompanie/>
      </div>

      <div className="flex-1 p-2">
        {children}
      </div>
    </>
  )
}