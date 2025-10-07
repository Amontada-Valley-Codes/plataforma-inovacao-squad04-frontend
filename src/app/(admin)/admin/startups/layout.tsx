import ChallengeFilter from "@/components/header/ChallengeFilter";

export default function ChallengeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div>
        <ChallengeFilter isStartup/>
      </div>

      <div className="flex-1 p-2">
        {children}
      </div>
    </>
  )
}