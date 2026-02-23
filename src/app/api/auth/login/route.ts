import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { signToken } from "@/lib/auth";

// Route de connexion pour authentifier un utilisateur existant
export async function POST(req: Request) {
  const { email, password } = await req.json();

  await dbConnect();
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "L'utilisateur n'existe pas" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
  }
  
// Génère un token JWT pour l'utilisateur authentifié
  const token = signToken({ userId: user._id.toString() });

  const res = NextResponse.json({ ok: true });

  res.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}