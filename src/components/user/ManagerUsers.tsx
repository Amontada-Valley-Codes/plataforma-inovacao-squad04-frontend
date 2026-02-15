// src/components/users/UserManagement.tsx
"use client";

import { useEffect, useState } from "react";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { userService } from "@/api/services/user.service";

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type_user: string;
  createdAt: string;
  Enterprise?: {
    name: string;
  } | null;
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);

  async function fetchUsers() {
    try {
      setLoading(true);
      const response = await userService.showPaginatedUsers(page, 10);
      setUsers(response.data);
      setLastPage(response.lastPage);
    } catch (err) {
      console.error("Erro ao buscar usuários", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await userService.delete(id);
      fetchUsers();
    } catch (err) {
      console.error("Erro ao excluir usuário", err);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [page]);

if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground dark:text-gray-400">Carregando </p>
        </div>
      </div>
    );
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
        return "Perfil desconhecido";
    }
  }

  return (
    <div className="w-full p-6 space-y-6">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-gray-100">
        Gestão de Usuários
      </h2>

      {/* Tabela */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr className="text-left text-gray-600 dark:text-gray-300">
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Telefone</th>
              <th className="px-4 py-3">Empresa</th>
              <th className="px-4 py-3">Criado em</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-gray-100">
                  {user.name}
                </td>
                <td className="px-4 py-3 capitalize">{translateUserRole(user.type_user)}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.phone}</td>
                <td className="px-4 py-3">
                  {user.Enterprise?.name ?? "-"}
                </td>
                <td className="px-4 py-3">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Página {page} de {lastPage}
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-md border disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
            disabled={page === lastPage}
            className="p-2 rounded-md border disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
