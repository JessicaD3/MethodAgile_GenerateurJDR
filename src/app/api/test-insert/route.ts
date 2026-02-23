import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
 
// Test route pour vérifier la connexion à la base de données et insérer un utilisateur de test
export async function GET() {
  await dbConnect();

  const user = await User.create({
    username: "testuser",
    email: "user@test.com",
    passwordHash: "hash"
  });

  return NextResponse.json({
    message: "DB connecté et utilisateur de test inséré",
    user,
  });
}