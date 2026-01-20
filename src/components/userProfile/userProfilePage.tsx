'use client'

import { Card, CardContent } from "@/components/ui/card";
import Button from "@/components/ui/button/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Badge from "@/components/ui/badge/Badge";
import { useEffect, useState } from "react";
import { userService } from "@/api/services/user.service";
import { ShowLoggedUserResponse } from "@/api/payloads/user.payload";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserProfilePage() {

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ShowLoggedUserResponse | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  const router = useRouter();


  const fetchUserProfile = async () => {
    try {
      setPageLoading(true);
      const response = await userService.showLoggedUser();
      setProfileData(response);
      setName(response.name);
      setPhone(response.phone ?? "");
    } catch (error) {
      console.log(error);
    } finally {
      setPageLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaveLoading(true);

      await userService.updateUser({
        name,
        phone,
      });

      setProfileData((prev) =>
        prev ? { ...prev, name, phone } : prev
      );

      setIsEditing(false);
    } catch (error) {
      console.log(error);
    } finally {
      setSaveLoading(false);
    }
  };


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

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#15358D] border-t-transparent" />
      </div>
    );
  }


  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="text-[#15358D] hover:bg-[#15358D]/10"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <h1 className="text-2xl font-semibold text-[#15358D]">
          Configurações
        </h1>
      </div>


      {/* Perfil do Usuário */}
      <Card className="rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#15358D]/85 via-[#15358D]/35 to-[#15358D]/10" />
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-medium text-[#15358D]">Perfil</h2>

          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={profileData?.image || ""}
                alt={profileData?.name}
              />
              <AvatarFallback className="bg-[#15358D]/10 text-[#15358D] font-semibold">
                {profileData?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase() || "US"}
              </AvatarFallback>
            </Avatar>


            <div>
              <p className="font-medium text-gray-900 dark:text-white">{profileData?.name}</p>
              <p className="text-sm text-gray-500 dark:text-[#ced3db]">{profileData?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Nome</label>
              {isEditing ? (
                <input
                  disabled={saveLoading}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                />
              ) : (
                <p className="font-medium text-gray-900 dark:text-white">
                  {profileData?.name}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm text-gray-500">Telefone</label>
              {isEditing ? (
                <input
                  disabled={saveLoading}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  placeholder="(99) 99999-9999"
                />
              ) : (
                <p className="font-medium text-gray-400">
                  {profileData?.phone ?? "Não informado"}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSaveProfile}
                  className="bg-[#15358D] text-white" 
                >
                  {saveLoading && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  )}
                  Salvar
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setName(profileData?.name ?? "");
                    setPhone(profileData?.phone ?? "");
                  }}
                >
                  Cancelar
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                className="border-[#15358D] text-[#15358D] hover:bg-[#15358D]/10"
                onClick={() => setIsEditing(true)}
              >
                Editar perfil
              </Button>
            )}
          </div>
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
        </CardContent>
      </Card>
    </div>
  );
}
