import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/pgsql";
import { pharmacies } from "@/db/schema/pharmacies";

export async function POST(req: Request) {
  const body = await req.json();
  const {
    pharmacy_id,
    email,
    username,
    pharmacyName,
    contactName,
    phone,
    address,
    timezone,
    planType,
    planName,
    allocatedDeliveries,
  } = body;

  if (!pharmacy_id) {
    return NextResponse.json(
      { error: "pharmacy_id is required" },
      { status: 400 }
    );
  }

  try {
    const updateResult = await db
      .update(pharmacies)
      .set({
        email,
        username,
        pharmacyName,
        contactName,
        phone,
        address,
        timezone,
        planType,
        planName,
        allocatedDeliveries,
      })
      .where(eq(pharmacies._id, pharmacy_id))
      .returning();

    if (updateResult.length === 0) {
      return NextResponse.json(
        { error: "Pharmacy not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      pharmacy: updateResult[0],
    });
  } catch (err: any) {
    console.error("Error updating pharmacy:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
