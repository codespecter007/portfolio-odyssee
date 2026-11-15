import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

/** Un seul compte administrateur, défini par variables d’environnement. */
export const COOKIE = "admin_session";
const DUREE = 8 * 60 * 60; // secondes

function secret() {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32)
    throw new Error("JWT_SECRET manquant ou trop court (32 caractères minimum)");
  return new TextEncoder().encode(s);
}

// Hash factice : la comparaison prend le même temps quand l’e-mail est faux.
const FACTICE = "$2b$12$FgtD.BJWHrRtKr4DkT5iQujYtowYE7SOUZlXtBpvEBm0jnwZUvFae";

export async function verifierIdentifiants(email: string, motDePasse: string) {
  const attendu = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!attendu || !hash) throw new Error("ADMIN_EMAIL ou ADMIN_PASSWORD_HASH manquant");
  const emailOk = email.trim().toLowerCase() === attendu;
  const mdpOk = await bcrypt.compare(motDePasse, emailOk ? hash : FACTICE);
  return emailOk && mdpOk ? attendu : null;
}

export async function ouvrirSession(email: string) {
  const jeton = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(email)
    .setIssuedAt()
    .setExpirationTime(`${DUREE}s`)
    .sign(secret());
  (await cookies()).set(COOKIE, jeton, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: DUREE,
  });
}

export async function fermerSession() {
  (await cookies()).delete(COOKIE);
}

/** Renvoie l’e-mail de l’admin connecté, ou null. */
export async function adminConnecte(): Promise<string | null> {
  const jeton = (await cookies()).get(COOKIE)?.value;
  if (!jeton) return null;
  try {
    const { payload } = await jwtVerify(jeton, secret(), { algorithms: ["HS256"] });
    return payload.role === "admin" && payload.sub ? payload.sub : null;
  } catch {
    return null;
  }
}
