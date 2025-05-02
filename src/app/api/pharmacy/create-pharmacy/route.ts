import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/pgsql";
import { pharmacies } from "@/db/schema/pharmacies";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const body = await req.json();
  const {
    email,
    username,
    password,
    pharmacy_name,
    contact_name,
    phone,
    address,
    timezone,
    plan_type,
    plan_name,
    allocated_deliveries,
  } = body;

  try {
    const passwordHash = await bcrypt.hash(password || "root", 10);

    const latest = await db
      .select({ code: pharmacies.pharmacyCode })
      .from(pharmacies)
      .orderBy(desc(pharmacies.pharmacyCode))
      .limit(1);

    let pharmacyCode = "001";
    if (latest.length > 0 && latest[0].code) {
      const nextCode = parseInt(latest[0].code) + 1;
      pharmacyCode = nextCode.toString().padStart(3, "0");
    }

    await db.insert(pharmacies).values({
      email,
      username,
      passwordHash,
      pharmacyName: pharmacy_name,
      contactName: contact_name,
      phone,
      address,
      timezone,
      planType: plan_type,
      planName: plan_name,
      allocatedDeliveries: allocated_deliveries,
      deliveriesUsedThisMonth: 0,
      rolloverDeliveries: 0,
      pharmacyCode,
      role: "pharmacy",
      status: "active",
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
