import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/pgsql";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const body = await req.json();
  const { _id, name, email, password, phone, role } = body;

  if (!_id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const updateData: any = {
      name,
      email,
      phone,
      role,
    };

    if (password) {
      const passwordHash = await bcrypt.hash(password, 10);
      updateData.passwordHash = passwordHash;
    }

    await db.update(users).set(updateData).where(eq(users._id, _id));

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error updating user:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
