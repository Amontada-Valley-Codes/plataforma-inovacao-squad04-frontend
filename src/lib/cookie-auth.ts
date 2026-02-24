// src/lib/cookie-auth.ts
export async function setAccessTokenCookie(access_token: string) {
  await fetch("/api/dev/set-cookie", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ access_token }),
  });
}

export async function clearAccessTokenCookie() {
  await fetch("/api/dev/set-cookie", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ access_token: "" }),
  });
}
