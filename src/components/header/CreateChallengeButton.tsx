"use client";
import { BookPlus, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "../ui/button/Button";
import { useModal } from "@/hooks/useModal";
import RegisterChallengeForm from "../challenge/RegisterChallengeForm";

export default function CreateChallengeButton() {
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <div className="flex gap-2">
      <Button 
        onClick={openModal}
        size="sm"
      >
        <BookPlus />
        Criar Desafio
      </Button>

      <Button 
        className="w-45 rounded h-12" 
        variant="primary"
        onClick={() => router.push("/admin/form-builder")}
      >
        <PlusCircle />
        Criar Formulário
      </Button>

      <RegisterChallengeForm isOpen={isOpen} onClose={closeModal} />
    </div>
  );
}