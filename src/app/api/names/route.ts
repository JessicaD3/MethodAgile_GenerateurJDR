import { NextResponse } from "next/server";

// Route pour générer un nom de personnage aléatoire en fonction des paramètres de requête
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // Récupère les paramètres de requête avec des valeurs par défaut
  const ancestry = searchParams.get("ancestry") ?? "h";
  const gender = searchParams.get("gender") ?? "";
  const family = searchParams.get("family") ?? "t";

  const qs = new URLSearchParams();

  // Mappe les paramètres de requête aux paramètres attendus par l'API de génération de noms
  if (ancestry) qs.set("ancestry", ancestry);
  if (gender) qs.set("gender", gender);
  if (family) qs.set("family", family);

  const res = await fetch(
    `https://fantasyname.lukewh.com/?${qs.toString()}`
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Name API Error" }, { status: 502 });
  }

  const text = await res.text();

  return NextResponse.json({ name: text.trim() });
}