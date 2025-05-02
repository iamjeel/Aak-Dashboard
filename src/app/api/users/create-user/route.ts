import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/pgsql";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, password, phone, role } = body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      name,
      email,
      passwordHash,
      phone,
      role,
      pharmacyId: null,
      lastLoginAt: null,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error creating user:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
