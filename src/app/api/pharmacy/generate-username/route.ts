import { NextResponse } from "next/server";
import { db } from "@/lib/pgsql";
import { pharmacies } from "@/db/schema/pharmacies";
import { eq, like, desc } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  if (!category || !["pharmacy", "other"].includes(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  const prefix = category === "pharmacy" ? "AAKPH" : "AAKBUS";

  const result = await db
    .select()
    .from(pharmacies)
    .where(like(pharmacies.username, `${prefix}%`))
    .orderBy(desc(pharmacies.username))
    .limit(1);

  const lastUsername = result[0]?.username || `${prefix}0099`;
  const lastNumber = parseInt(lastUsername.slice(-4), 10);
  const nextNumber = (lastNumber + 1).toString().padStart(4, "0");
  const newUsername = `${prefix}${nextNumber}`;

  return NextResponse.json({ username: newUsername });
}
