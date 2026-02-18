"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  challengeName: string;
  enterpriseName: string;
  deadline?: string;
  onConfirm: () => Promise<void>;
};

export default function ApplyChallengeModal({
  open,
  onOpenChange,
  challengeName,
  enterpriseName,
  deadline,
  onConfirm,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao enviar candidatura:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Confirmar Candidatura</DialogTitle>
          <DialogDescription>
            Você deseja se candidatar ao desafio{" "}
            <strong className="text-foreground">{challengeName}</strong> da empresa{" "}
            <strong className="text-foreground">{enterpriseName}</strong>?
          </DialogDescription>
        </DialogHeader>
        {deadline && (
          <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
            <p>
              Prazo:{" "}
              <span className="font-medium text-foreground">
                {new Date(deadline).toLocaleDateString("pt-BR")}
              </span>
            </p>
          </div>
        )}
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-[#15358D] hover:bg-[#112c75] text-white"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Confirmar Candidatura"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
