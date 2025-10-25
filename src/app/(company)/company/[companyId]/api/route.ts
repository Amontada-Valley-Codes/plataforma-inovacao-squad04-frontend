/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getCompanyById, updateCompanyInMock, type Companie } from "@/mocks/CompaniesData";
import { usersData } from "@/mocks/UserData";

// validações simples
function isNonEmptyString(v: unknown) { return typeof v === "string" && v.trim().length > 0; }
function isOptionalString(v: unknown) { return v === null || v === undefined || typeof v === "string"; }
function isStringArray(v: unknown) { return Array.isArray(v) && v.every((x) => typeof x === "string"); }

function validatePatch(input: any): { ok: true; patch: Partial<Companie> } | { ok: false; error: string } {
  if (typeof input !== "object" || input === null) return { ok: false, error: "Body inválido" };

  const out: Partial<Companie> = {};
  const allowKeys = new Set([
    "nome", "gestor", "cnpj", "email", "setor", "areaAtuacao", "descricao",
    "logo", "cover", "instagram", "whatsapp", "linkedin", "locationUrl", "gallery",
  ]);

  const unknown = Object.keys(input).filter((k) => !allowKeys.has(k));
  if (unknown.length) return { ok: false, error: `Campos não permitidos: ${unknown.join(", ")}` };

  const maybeRequiredStringKeys = ["nome", "gestor", "cnpj", "email", "setor", "areaAtuacao", "descricao"] as const;
  for (const k of maybeRequiredStringKeys) {
    if (k in input) {
      if (!isNonEmptyString(input[k])) return { ok: false, error: `Campo '${k}' deve ser string não vazia` };
      (out as any)[k] = String(input[k]);
    }
  }

  const optionalStringKeys = ["logo", "cover", "instagram", "whatsapp", "linkedin", "locationUrl"] as const;
  for (const k of optionalStringKeys) {
    if (k in input) {
      if (!isOptionalString(input[k])) return { ok: false, error: `Campo '${k}' deve ser string ou null` };
      (out as any)[k] = input[k] === undefined ? null : input[k];
    }
  }

  if ("gallery" in input) {
    if (!isStringArray(input.gallery)) return { ok: false, error: "Campo 'gallery' deve ser array de strings" };
    out.gallery = input.gallery;
  }

  return { ok: true, patch: out };
}

function getUserFromQuery(req: Request) {
  const url = new URL(req.url);
  const userId = Number(url.searchParams.get("userId") || "0");
  return usersData.find((u) => u.id === userId) ?? null;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const companyId = Number(url.pathname.split("/").pop()); // pega o último segmento da rota
  if (!Number.isFinite(companyId)) return NextResponse.json({ error: "companyId inválido" }, { status: 400 });

  const company = getCompanyById(companyId);
  if (!company) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(company, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const companyId = Number(url.pathname.split("/").pop());
    if (!Number.isFinite(companyId)) return NextResponse.json({ error: "companyId inválido" }, { status: 400 });

    const me = getUserFromQuery(req);
    if (!me) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const canEdit = me.role === "admin" || (me.role === "gestor" && me.companyId === companyId);
    if (!canEdit) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    let body: any;
    try { body = await req.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }

    const validated = validatePatch(body);
    if (!validated.ok) return NextResponse.json({ error: validated.error }, { status: 400 });

    const updated = updateCompanyInMock(companyId, validated.patch);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(updated, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("PUT /api/company/[id] error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}