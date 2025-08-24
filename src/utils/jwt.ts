function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  try {
    return decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch {
    try {
      // Fallback for non-URL-encoded payloads
      return atob(base64);
    } catch {
      return "";
    }
  }
}

export function parseJwt(token: string | null | undefined): any | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const payload = base64UrlDecode(parts[1]);
  try {
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

export function getEmailFromJwt(
  token: string | null | undefined
): string | null {
  const payload = parseJwt(token);
  if (!payload) return null;
  if (typeof payload.email === "string" && payload.email.includes("@"))
    return payload.email;
  if (typeof payload.sub === "string" && payload.sub.includes("@"))
    return payload.sub;
  return null;
}

export function getUsernameFromJwt(
  token: string | null | undefined
): string | null {
  const payload = parseJwt(token);
  if (!payload) return null;
  if (typeof payload.username === "string") return payload.username;
  if (typeof payload.preferred_username === "string")
    return payload.preferred_username;
  if (typeof payload.name === "string") return payload.name;
  if (typeof payload.sub === "string") {
    const sub: string = payload.sub;
    if (!sub.includes("@")) return sub;
    return sub.split("@")[0];
  }
  return null;
}
