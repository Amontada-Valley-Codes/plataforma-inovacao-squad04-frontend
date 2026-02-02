import Button from "../ui/button/Button";

interface CardDesafioProps {
  name: string;
}

export default function CardDesafio({ name }: CardDesafioProps) {
  return (
    <div
      className="
        flex items-center justify-between
        mt-4 h-25
        w-full max-w-sm rounded-xl p-5 transition
        bg-[#15358d] hover:bg-[#112c75]
        text-white
        border border-gray-200
        dark:border-gray-800 dark:bg-blue-800
      "
    >
      <h3 className="font-semibold dark:text-[#ced3db]">
        {name}
      </h3>
      <div>

      <Button className="bg-green-600">Usar</Button>
      </div>
    </div>
  );
}