"use client";

import { Modal } from "../ui/modal";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { StrategicObjectivesService } from "@/api/services/strategic-objectives.service";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateStrategicObjectiveSchema = z.object({
  title: z.string().min(3, "O título do objectivo deve ter no mínimo 3 caracteres"),
  description: z.string().min(10, "A descrição é obrigatória"),
});

type createStrategicObjectiveData = z.infer<typeof CreateStrategicObjectiveSchema>;

export default function RegisterStrategicObjectiveForm({ onClose, isOpen }: Props) {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<createStrategicObjectiveData>({
    resolver: zodResolver(CreateStrategicObjectiveSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (data: createStrategicObjectiveData) => {
    try {
      const response = await StrategicObjectivesService.createObjective(data);
      console.log(response)
      reset();
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div
          className="
            lg:w-120 md:w-100 sm:w-50 w-full
            p-6 z-50
            bg-white dark:bg-gray-900
            shadow-xl rounded-2xl
            max-h-[90vh] overflow-y-auto
          "
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <Label className="text-[#0B2B70] dark:text-white">
                  Título do objetivo estratégico
                </Label>

                <Input
                  {...register("title")}
                  placeholder="Digite o titulo Objetivo Estratégico"
                  className="
                    bg-[#F9FAFB] dark:bg-gray-800
                    border border-[#E5E7EB] dark:border-gray-700
                    text-black dark:text-white
                    placeholder:text-[#98A2B3] dark:placeholder:text-gray-400
                  "
                />

                {errors.title && (
                  <p className="text-red-500 text-sm">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-[#0B2B70] dark:text-white">
                  Descrição do problema identificado
                </Label>

                <Input
                  {...register("description")}
                  placeholder="Digite o problema identificado"
                  className="
                    bg-[#F9FAFB] dark:bg-gray-800
                    border border-[#E5E7EB] dark:border-gray-700
                    text-black dark:text-white
                    placeholder:text-[#98A2B3] dark:placeholder:text-gray-400
                  "
                />

                {errors.description && (
                  <p className="text-red-500 text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div
                className="
                  flex justify-end gap-3 pt-5 mt-6
                  border-t border-gray-200 dark:border-gray-700
                "
              >
                <Button
                  onClick={onClose}
                  className="
                    bg-gray-100 text-gray-700
                    hover:bg-gray-200
                    dark:bg-gray-800 dark:text-gray-200
                    dark:hover:bg-gray-700
                  "
                >
                  Cancelar
                </Button>

                <Button
                  className="
                    bg-[#0B2B70] text-white
                    hover:opacity-90
                  "
                >
                  Registrar Objetivo Estratégico
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
