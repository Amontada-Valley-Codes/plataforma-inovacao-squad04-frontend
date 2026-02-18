"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building2, Calendar, Briefcase } from "lucide-react";

interface InviteStartupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  startupName: string;
  challengeName: string;
  enterpriseName?: string;
  deadline?: string;
  onConfirm: () => void;
}

export default function InviteStartupModal({
  open,
  onOpenChange,
  startupName,
  challengeName,
  enterpriseName,
  deadline,
  onConfirm,
}: InviteStartupModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Confirmar Convite</DialogTitle>
          <DialogDescription>
            Você está prestes a convidar a startup para participar deste desafio.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
            <Building2 className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Startup</p>
              <p className="font-semibold">{startupName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
            <Briefcase className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Desafio</p>
              <p className="font-semibold">{challengeName}</p>
              {enterpriseName && (
                <p className="text-sm text-muted-foreground">{enterpriseName}</p>
              )}
            </div>
          </div>

          {deadline && (
            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <Calendar className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Prazo</p>
                <p className="font-semibold">
                  {new Date(deadline).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onConfirm} className="bg-[#15358D] hover:bg-[#112c75]">
            Confirmar Convite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
