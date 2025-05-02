// app/api/users/route.ts
import { db } from "@/db";
import { users } from "@/db/schema/users";
import { NextResponse } from "next/server";

export async function GET() {
  const allUsers = await db.select().from(users);
  return NextResponse.json(allUsers);
}
