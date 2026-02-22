import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";

export async function GET() {
  await dbConnect();
  return NextResponse.json({ message: "Connexion à la base de données réussie" });
}