import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";

// test route pour vérifier la connexion à la base de données
export async function GET() {
  await dbConnect();
  return NextResponse.json({ message: "Connexion à la base de données réussie" });
}