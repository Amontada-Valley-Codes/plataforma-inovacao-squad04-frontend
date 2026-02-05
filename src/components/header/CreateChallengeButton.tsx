"use client";
import { useState } from "react";
import CustomForm from "../challenge/CustomForm";
import { useModal } from "@/hooks/useModal";
import { useRouter } from "next/navigation";

import { BookPlus, PlusCircle } from "lucide-react";
import RegisterChallengeForm from "../challenge/RegisterChallengeForm";
import Button from "../ui/button/Button";

export default function CreateChallengeButton() {
  const router = useRouter(); 
  const { isOpen, openModal, closeModal } = useModal();

  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [showCustomForm, setShowCustomForm] = useState(false);


  const handleCloseAll = () => {
    closeModal();         
    setChallengeId(null);  
    setShowCustomForm(false); 
  };

  return (
    <div className="flex gap-2">
      <Button onClick={openModal} size="sm">
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

  
      {isOpen && !showCustomForm && (
        <RegisterChallengeForm
          isOpen={isOpen}
          onClose={handleCloseAll} 
          onSubmitSuccess={(id) => {
            console.log("Desafio criado, ID:", id);
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