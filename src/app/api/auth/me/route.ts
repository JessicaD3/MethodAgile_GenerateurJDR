import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { getUserIdFromCookies } from "@/lib/auth";

// Route pour récupérer les informations de l'utilisateur connecté
export async function GET() {
  const userId = getUserIdFromCookies();
  if (!userId) return NextResponse.json({ user: null });

  await dbConnect();

  const user = await User.findById(userId).select("username email");

  return NextResponse.json({ user });
}