import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Character } from "@/models/Character";
import { getUserIdFromCookies } from "@/lib/auth";

// Route pour gérer les détails d'un personnage spécifique du grimoire
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const userId = getUserIdFromCookies();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  await dbConnect();

  // Récupère le personnage par ID, en s'assurant qu'il appartient à l'utilisateur connecté
  const character = await Character.findOne({
    _id: params.id,
    userId,
  });

  if (!character) {
    return NextResponse.json({ error: "Personnage non trouvé" }, { status: 404 });
  }

  return NextResponse.json({ character });
}

// Route pour supprimer un personnage spécifique du grimoire
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const userId = getUserIdFromCookies();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  await dbConnect();
// Supprime le personnage par ID, en s'assurant qu'il appartient à l'utilisateur connecté
  const deleted = await Character.findOneAndDelete({
    _id: params.id,
    userId,
  });

  if (!deleted) {
    return NextResponse.json({ error: "Personnage non trouvé" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}