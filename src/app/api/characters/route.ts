import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Character } from "@/models/Character";
import { getUserIdFromCookies } from "@/lib/auth";

// Route pour gérer la liste des personnages du grimoire de l'utilisateur connecté
export async function GET() {
  const userId = await getUserIdFromCookies(); // ✅ APPEL + await

  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  await dbConnect();

  const characters = await Character.find({ userId }).sort({
    createdAt: -1,
  });

  return NextResponse.json({ characters });
}

// Route pour créer un nouveau personnage dans le grimoire de l'utilisateur connecté
export async function POST(req: Request) {
  const userId = await getUserIdFromCookies(); // ✅ APPEL + await

  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { name, race, class: klass, background, stats } =
    await req.json();

  if (!name || !race || !klass || !stats) {
    return NextResponse.json(
      { error: "Champs manquants" },
      { status: 400 }
    );
  }

  await dbConnect();

    // Crée un nouveau personnage en associant l'ID utilisateur récupéré à partir du token dans les cookies
  const character = await Character.create({
    userId, 
    name,
    race,
    class: klass,
    background: background ?? "",
    stats,
  });

  return NextResponse.json({ character }, { status: 201 });
}