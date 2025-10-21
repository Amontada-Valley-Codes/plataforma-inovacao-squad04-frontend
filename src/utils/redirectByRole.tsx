// src/utils/redirectByRole.ts
import { decodeJwt } from "@/lib/jwt";

export function redirectByRole(token: string) {
    try {
        const payload: any = decodeJwt(token);
        const type = payload?.type_user as
            | "COMMON"
            | "ADMINISTRATOR"
            | "EVALUATOR"
            | "MANAGER"
            | undefined;

        let route = "/";

        switch (type) {
            case "ADMINISTRATOR":
                route = "/admin/companies?role=admin";
                break;

            case "MANAGER":
                route = "/company/1/dashboard?role=gestor";
                // 🔧 substitui o "1" pelo ID dinâmico se quiser
                break;

            case "EVALUATOR":
                route = "/avaliador/dashboard?role=avaliador";
                break;

            case "COMMON":
                route = "/user/empresa?role=usuario";
                break;

            default:
                route = "/";
                break;
        }

        // Redireciona o usuário
        window.location.href = route;
    } catch (error) {
        console.error("Erro ao redirecionar por role:", error);
        window.location.href = "/";
    }
}
