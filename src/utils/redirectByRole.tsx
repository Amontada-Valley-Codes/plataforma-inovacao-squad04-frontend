// src/utils/redirectByRole.ts
import { decodeJwt } from "@/lib/jwt";

export function redirectByRole(token: string) {
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
            route = "/gestor/dashboard?role=gestor";
            break;
        case "EVALUATOR":
            route = "/avaliador?role=avaliador";
            break;
        case "COMMON":
        default:
            route = "/user";
            break;
    }

    window.location.href = route;
}
