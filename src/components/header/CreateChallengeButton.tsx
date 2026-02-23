"use client";

import { useState, useEffect } from "react";
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

  const [role, setRole] = useState<Role | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [showCustomForm, setShowCustomForm] = useState(false);

  useEffect(() => {
    setRole(getUserRole());
  }, []);

  const isAdmin = role === "ADMINISTRATOR";
  const isManager = role === "MANAGER";
  const isInnovation = role === "INNOVATION_TEAM";
  const isTransformation = role === "TRANSFORMATION_OFFICE";
  const isObserver = role === "OBSERVER";

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

  
  if (role === null) return null;

  return (
    <div className="flex gap-2">
      {(isManager || isTransformation) && (
        <Button size="sm" onClick={() => { setModalType("OBJECTIVE"); openModal(); }}>
          <DiamondPlus />
          Gerenciar Objetivo Estratégico
        </Button>
      )}

      {!isAdmin && !isObserver && (
        <Button size="sm" onClick={() => { setModalType("CHALLENGE"); openModal(); }}>
          <BookPlus />
          Criar Desafio
        </Button>
      )}

      {(isManager || isInnovation) && (
        <Button size="sm" onClick={() => router.push("/admin/form-builder")}>
          <PlusCircle />
          Criar Formulário
        </Button>
      )}

      {isOpen && modalType === "OBJECTIVE" && (
        <RegisterStrategicObjectiveForm isOpen={isOpen} onClose={handleCloseAll} />
      )}

      {isOpen && modalType === "CHALLENGE" && !showCustomForm && (
        <RegisterChallengeForm isOpen={isOpen} onClose={handleCloseAll} onSubmitSuccess={handleChallengeCreated} />
      )}

      {isOpen && showCustomForm && challengeId && (
        <CustomForm challengeId={challengeId} isOpen={isOpen} onClose={handleCloseAll} />
      )}
    </div>
  );
}