export default function Page({ params }: { params: { companyId: string } }) {
  return (
    <div className="p-4 sm:p-6 md:p-8 w-full max-w-screen-lg mx-auto overflow-x-hidden">
      <h1 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">
        Company Dashboard
      </h1>
      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 break-all">
        companyId: <b>{params.companyId}</b>
      </p>
    </div>
  );
}
