import { NextResponse } from "next/server";
import { db } from "@/lib/pgsql"; // your drizzle client
import { pharmacies } from "@/db/schema/pharmacies";

export async function GET() {
  try {
    const result = await db.select().from(pharmacies);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Error fetching pharmacies:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch pharmacies" },
      { status: 500 }
    );
  }
}
