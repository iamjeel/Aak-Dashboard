import { NextResponse } from "next/server";
import { db } from "@/lib/pgsql";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.role, "warehouseAdmin"));

    if (!result.length) {
      return NextResponse.json({ error: "No users found" }, { status: 404 });
    }

    // Omit passwordHash from each user
    const safeUsers = result.map(({ passwordHash, ...rest }) => rest);

    return NextResponse.json(safeUsers);
  } catch (err: any) {
    console.error("Error fetching users:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
