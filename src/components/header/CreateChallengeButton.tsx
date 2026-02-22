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
import { getUserRole } from "@/lib/auth"; 
import type { Role } from "@/lib/roles";

type ModalType = "OBJECTIVE" | "CHALLENGE" | null;

export default function CreateChallengeButton() {
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModal();

  const role: Role | null = getUserRole();
  const isAdmin = role === "ADMINISTRATOR";
  const isManager = role === "MANAGER";
  const isInnovation = role === "INNOVATION_TEAM";
  const isCommittee = role === "STEERING_COMMITTEE";
  const isTransformation = role === "TRANSFORMATION_OFFICE";
  const isCollaborator = role === "COLLABORATOR";
  const isObserver = role === "OBSERVER";
  
  

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
      const response = await api.get(
        `/form-template-versions/${createdChallengeId}`
      );

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

  return (
    <div className="flex gap-2">
     
      {/* Gerenciar Objetivo Estratégico → MANAGER e TRANSFORMATION */}
  {(isManager || isTransformation) && (
    <Button
      size="sm"
      onClick={() => {
        setModalType("OBJECTIVE");
        openModal();
      }}
    >
      <DiamondPlus />
      Gerenciar Objetivo Estratégico
    </Button>
  )}

  {/* Criar Desafio → todos exceto ADMIN e OBSERVER */}
  {!isAdmin && !isObserver && (
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
  )}

  {/* Criar / Editar Formulário → SOMENTE MANAGER e INNOVATION_TEAM */}
  {(isManager || isInnovation) && (
    <Button
      size="sm"
      onClick={() => router.push("/admin/form-builder")}
    >
      <PlusCircle />
      Criar Formulário
    </Button>
  )}

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