"use client";
import { useState } from "react";
import CustomForm from "../challenge/CustomForm";
import { useModal } from "@/hooks/useModal";
import { useRouter } from "next/navigation";

import { BookPlus, DiamondPlus, PlusCircle } from "lucide-react";
import RegisterChallengeForm from "../challenge/RegisterChallengeForm";
import Button from "../ui/button/Button";
import RegisterStrategicObjectiveForm from "../strategic-objectives/RegisterStrategicObjectiveForm";

type ModalType = "OBJECTIVE" | "CHALLENGE" | null;

export default function CreateChallengeButton() {
  const router = useRouter(); 
  const { isOpen, openModal, closeModal } = useModal();

  const [modalType, setModalType] = useState<ModalType>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [showCustomForm, setShowCustomForm] = useState(false);

  const handleCloseAll = () => {
    closeModal();
    setModalType(null);
    setChallengeId(null);
    setShowCustomForm(false);
  };

  return (
    <div className="flex gap-2">
      <Button
        size="sm" 
        onClick={() => {
          setModalType("OBJECTIVE");
          openModal();
        }} 
      >
        <DiamondPlus />
        Cadastrar Objectivo Estratégico
      </Button>

      <Button 
        size="sm" 
        onClick={() => {
          setModalType("CHALLENGE");
          openModal();
        }} 
      >
        <BookPlus />
        Criar Desafio
      </Button>

      <Button
        onClick={() => router.push("/admin/form-builder")}
        size="sm" 
      >
        <PlusCircle />
        Criar Formulário
      </Button>

      {isOpen && modalType === "OBJECTIVE" && (
        <RegisterStrategicObjectiveForm
          isOpen={isOpen}
          onClose={handleCloseAll}
        />
      )}

      {isOpen && modalType === "CHALLENGE" && !showCustomForm && (
        <RegisterChallengeForm
          isOpen={isOpen}
          onClose={handleCloseAll}
          onSubmitSuccess={(id) => {
            setChallengeId(id);
            setShowCustomForm(true);
          }}
        />
      )}
    
      {isOpen && showCustomForm && challengeId && (
        <CustomForm
          challengeId={challengeId}
          isOpen={isOpen}
          onClose={handleCloseAll} 
        />
      )}
    </div>
  );
}