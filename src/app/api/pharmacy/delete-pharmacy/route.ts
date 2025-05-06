import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/pgsql";
import { pharmacies } from "@/db/schema/pharmacies";

export async function DELETE(req: Request) {
  const body = await req.json();
  const { pharmacy_id } = body;

  if (!pharmacy_id) {
    return NextResponse.json(
      { error: "pharmacy_id is required" },
      { status: 400 }
    );
  }

  try {
    const deleteResult = await db
      .delete(pharmacies)
      .where(eq(pharmacies._id, pharmacy_id))
      .returning();

    if (deleteResult.length === 0) {
      return NextResponse.json(
        { error: "Pharmacy not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      pharmacy: deleteResult[0],
    });
  } catch (err: any) {
    console.error("Error deleting pharmacy:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
