import { NextResponse } from "next/server";

// Route pour récupérer la liste des classes de D&D depuis l'API externe
export async function GET() {
  const res = await fetch("https://www.dnd5eapi.co/api/2014/classes");

  if (!res.ok) {
    return NextResponse.json({ error: "DND API Error" }, { status: 502 });
  }

  const data = await res.json();
  return NextResponse.json(data);
}