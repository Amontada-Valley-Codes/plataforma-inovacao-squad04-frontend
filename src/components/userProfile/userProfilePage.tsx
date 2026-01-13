'use client'

import { Card, CardContent } from "@/components/ui/card";
import Button from "@/components/ui/button/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Badge from "@/components/ui/badge/Badge";
import { useEffect, useState } from "react";
import { userService } from "@/api/services/user.service";
import { ShowLoggedUserResponse } from "@/api/payloads/user.payload";

export default function UserProfilePage() {

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ShowLoggedUserResponse | null>(null)

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.showLoggedUser();
      setProfileData(response)
    } catch (error) {
      console.log("Erro ao buscar dados do perfil:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUserProfile()
  }, [])

  function formatDate(
    date: string | Date,
    options?: Intl.DateTimeFormatOptions
  ) {
    if (!date) return "-";

    const d = typeof date === "string" ? new Date(date) : date;

    if (isNaN(d.getTime())) return "-";

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      ...options,
    }).format(d);
  }

  function translateUserRole(role: string) {
    switch (role) {
      case "ORGANIZER":
        return "Organizador";

      case "COLLABORATOR":
        return "Colaborador";

      case "OBSERVER":
        return "Observador";

      case "INNOVATION_OFFICE":
        return "Escritório de Inovação";

      case "STEERING_COMMITTEE":
        return "Comitê Gestor";

      case "ADMINISTRATOR":
        return "Administrador";

      case "MANAGER":
        return "Gestor";

      case "STARTUP":
        return "Startup";

      default:
        return "Usuário";
    }
  }


  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-[#15358D]">Configurações</h1>

      {/* Perfil do Usuário */}
      <Card className="rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#15358D]/85 via-[#15358D]/35 to-[#15358D]/10" />
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-medium text-[#15358D]">Perfil</h2>

          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="" />
              <AvatarFallback className="bg-[#15358D]/10 text-[#15358D] font-semibold">AD</AvatarFallback>
            </Avatar>

            <div>
              <p className="font-medium text-gray-900 dark:text-white">{profileData?.name}</p>
              <p className="text-sm text-gray-500 dark:text-[#ced3db]">{profileData?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Nome</label>
              <p className="font-medium text-gray-900 dark:text-white">{profileData?.name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Telefone</label>
              <p className="font-medium text-gray-400">{profileData?.phone ?? "Não informado"}</p>
            </div>
          </div>

          <Button variant="outline" className="border-[#15358D] text-[#15358D] hover:bg-[#15358D]/10">
            Editar perfil
          </Button>
        </CardContent>
      </Card>

      {/* Conta */}
      <Card className="rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#15358D]/85 via-[#15358D]/35 to-[#15358D]/10" />
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-medium text-[#15358D]">Conta</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-500">Tipo de usuário</label>
              <div>
                <Badge>
                  {profileData?.type_user && translateUserRole(profileData.type_user)}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Conta criada em</label>
              <p className="font-medium text-gray-900 dark:text-white">{profileData?.createdAt ? formatDate(profileData.createdAt) : "Não informado"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Último acesso</label>
              <p className="font-medium text-gray-400">{profileData?.lastAccessAt ? formatDate(profileData.lastAccessAt) : "Não informado"}</p>
            </div>

          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-[#15358D] text-[#15358D] hover:bg-[#15358D]/10"
            >
              Alterar senha
            </Button>
            <Button>Desativar conta</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
