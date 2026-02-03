export default function FinalReport() {

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[24px] text-[#0B2B70] dark:text-white font-semibold mb-4">
          Relatório Final de Escala
        </h1>
      </div>

      <div className="flex flex-col mb-4">
        <h1 className="flex gap-1 items-center text-black dark:text-white text-lg mb-1">
           Resumo Executivo
        </h1>

        <div className="flex-1 flex items-center rounded-lg border px-3 py-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
          <textarea  
            required
            rows={12}
            maxLength={1000} 
            placeholder="Descreva o resumo executivo"
            className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3] dark:placeholder:text-white"
          />
        </div>
      </div>
    </div>
  )
}