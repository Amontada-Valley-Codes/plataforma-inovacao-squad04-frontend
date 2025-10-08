import { usersData } from "@/mocks/UserData";
import type { User } from "@/mocks/UserData";

export async function getCurrentUser(): Promise<User> {
    if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const idParam = params.get("userId");

        if (idParam) {
        const user = usersData.find(u => u.id === Number(idParam));
        if (user) return user;
        }
    }

    // fallback
    return usersData[1];
}

    export async function getUserRole(): Promise<User["role"]> {
    const user = await getCurrentUser();
    return user.role;
    }
