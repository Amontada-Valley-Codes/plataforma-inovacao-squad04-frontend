// src/app/(user)/user/empresa/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CompaniesProfileInline from "@/components/companies/CompaniesProfileInline";
import { enterpriseService } from "@/api/services/enterprise.service";
import type { ShowOneEnterpriseResponse } from "@/api/payloads/enterprise.payload";

function decodeJwt(): { role?: string; enterpriseId?: string | number } | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("access_token");
  if (!token) return null;
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const decoded = JSON.parse(decodeURIComponent(escape(json)));
    return {
      role: String(decoded?.type_user || "").toLowerCase(), // administrator/manager/...
      enterpriseId: decoded?.enterpriseId ?? decoded?.companyId ?? decoded?.enterprise_id,
    };
  } catch {
    return null;
  }
}

export default function UserCompanyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<ShowOneEnterpriseResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // 1) tenta endpoint "me"
        const meCompany = await enterpriseService.getMyEnterprise();
        if (meCompany) {
          setCompany(meCompany);
          return;
        }

        // 2) se veio null (404), tenta via enterpriseId do token
        const decoded = decodeJwt();
        const id = decoded?.enterpriseId;
        if (id) {
          const data = await enterpriseService.showOneEnterprise(String(id));
          setCompany(data);
          return;
        }

        // 3) se não tem id, avisa
        setError("Sua conta não possui uma empresa vinculada.");
      } catch (e: any) {
        setError(e?.response?.data?.message || "Não foi possível carregar sua empresa.");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading) {
    return (
      <div className="w-full p-6 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-[#15358D]/30 border-t-[#15358D] rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="w-full p-6 text-sm text-red-500">{error}</div>;
  }

  if (!company) {
    return <div className="w-full p-6 text-sm text-gray-500">Você ainda não possui empresa vinculada.</div>;
  }

  return <CompaniesProfileInline data={company} editable={false} />;
}
