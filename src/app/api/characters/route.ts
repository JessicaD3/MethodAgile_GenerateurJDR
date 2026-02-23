import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Character } from "@/models/Character";
import { getUserIdFromCookies } from "@/lib/auth";

// Route pour gérer les personnages du grimoire
export async function GET() {
  const userId = getUserIdFromCookies();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  await dbConnect();
    // Récupère les personnages de l'utilisateur connecté, triés par date de création décroissante
  const characters = await Character.find({ userId }).sort({
    createdAt: -1,
  });

  return NextResponse.json({ characters });
}

// Route pour créer un nouveau personnage dans le grimoire
export async function POST(req: Request) {
  const userId = getUserIdFromCookies();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  
  const { name, race, class: klass, background, stats } = await req.json();

  if (!name || !race || !klass || !stats) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  await dbConnect();

// Crée un nouveau personnage associé à l'utilisateur connecté
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