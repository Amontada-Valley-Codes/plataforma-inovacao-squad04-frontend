"use client";
import { useState } from "react";
import CustomForm from "../challenge/CustomForm";
import { useModal } from "@/hooks/useModal";
import { useRouter } from "next/navigation";
import { BookPlus, DiamondPlus, PlusCircle } from "lucide-react";
import RegisterChallengeForm from "../challenge/RegisterChallengeForm";
import Button from "../ui/button/Button";
import RegisterStrategicObjectiveForm from "../strategic-objectives/RegisterStrategicObjectiveForm";
import api from "@/api/axios";

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

 
  const handleChallengeCreated = async (createdChallengeId: string) => {
    setChallengeId(createdChallengeId);

    try {
      const response = await api.get(`/form-template-versions/${createdChallengeId}`);
      const firstForm = response.data.forms?.[0];
      const questions = firstForm?.version?.questions ?? [];

      if (questions.length > 0) {
      
        setShowCustomForm(true);
      } else {
       
        handleCloseAll();
      }
    } catch {
    
      handleCloseAll();
    }
  };

  // ── Render ─────────────────────────────────

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
        Gerenciar Objectivo Estratégico
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
        size="sm"
        onClick={() => router.push("/admin/form-builder")}
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
          onSubmitSuccess={handleChallengeCreated}
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