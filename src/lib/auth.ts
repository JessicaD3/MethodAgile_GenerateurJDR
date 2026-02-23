import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;

// Génère un token JWT avec l'ID utilisateur dans le payload
export function signToken(payload: { userId: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

// Vérifie la validité du token et retourne le payload (ID utilisateur)
export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
}

// Récupère l'ID utilisateur à partir du token stocké dans les cookies
export async function getUserIdFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    return verifyToken(token).userId;
  } catch {
    return null;
  }
}