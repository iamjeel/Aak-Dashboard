import { NextResponse } from "next/server";
import { db } from "@/lib/pgsql";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const deleted = await db.delete(users).where(eq(users._id, user_id));

    return NextResponse.json({ success: true, deleted });
  } catch (err: any) {
    console.error("Error deleting user:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
