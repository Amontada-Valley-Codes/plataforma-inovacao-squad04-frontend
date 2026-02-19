import { cn } from "@/lib/utils";

type AlignmentBadgeProps = {
  alignment: "HIGH" | "MEDIUM" | "LOW" | "NONE";
};

export const AlignmentBadge = ({ alignment }: AlignmentBadgeProps) => {
  const config = {
    HIGH: { label: "Alto", className: "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700" },
    MEDIUM: { label: "Médio", className: "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700" },
    LOW: { label: "Baixo", className: "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700" },
    NONE: { label: "Sem alinhamento", className: "bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700" },
  };

  const { label, className } = config[alignment];

  return (
    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border", className)}>
      {label}
    </span>
  );
};
