import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { signToken } from "@/lib/auth";

// Route d'inscription pour créer un nouvel utilisateur
export async function POST(req: Request) {
  const { username, email, password } = await req.json();

  if (!username || !email || !password) {
    return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
  }

  await dbConnect();

  // Vérifie si un utilisateur avec le même email existe déjà
  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "L'utilisateur existe déjà" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    passwordHash,
  });

  // Génère un token JWT pour l'utilisateur nouvellement créé
  const token = signToken({ userId: user._id.toString() });

  const res = NextResponse.json({ ok: true });

// Stocke le token dans les cookies pour l'authentification future
  res.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}