/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import { enterpriseService } from "@/api/services/enterprise.service";
import type { ShowOneEnterpriseResponse } from "@/api/payloads/enterprise.payload";

export function useMyEnterprise() {
    const [enterprise, setEnterprise] = useState<ShowOneEnterpriseResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const data = await enterpriseService.getMyEnterprise();
                if (mounted) setEnterprise(data);
            } catch (e: any) {
                if (mounted) setError(e?.response?.data?.message ?? "Falha ao carregar a empresa");
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    return { enterprise, loading, error };
}
