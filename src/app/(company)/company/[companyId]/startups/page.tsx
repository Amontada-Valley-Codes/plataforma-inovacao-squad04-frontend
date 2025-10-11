import StartupCard from "@/components/startup/StartupCard";

export default async function AdminStartupsPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] w-full">
      <section className="px-4 sm:px-6 lg:px-8 py-6 border-b border-[#E5E7EB] dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-semibold text-[#15358D] dark:text-blue-400 tracking-tight">
            Startups cadastradas
          </h1>
          <p className="mt-1 text-sm text-[#667085] dark:text-gray-400">
            Alterna entre <span className="font-medium text-[#15358D] dark:text-blue-400">lista</span> e{" "}
            <span className="font-medium text-[#15358D] dark:text-blue-400">cards</span> pelo botão de ícone.
          </p>
        </div>
      </section>

      <main className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl border border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
            <div className="p-3 sm:p-4 lg:p-6">
              <StartupCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
