import { NextResponse } from "next/server";
import { db } from "@/lib/pgsql";
import { pharmacies } from "@/db/schema/pharmacies";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pharmacyId = searchParams.get("pharmacyId");

    if (!pharmacyId) {
      return NextResponse.json(
        { error: "Missing pharmacyId" },
        { status: 400 }
      );
    }

    const result = await db
      .select({
        deliveryUploadFileUrl: pharmacies.deliveryUploadFileUrl,
      })
      .from(pharmacies)
      .where(eq(pharmacies._id, parseInt(pharmacyId, 10)));

    if (result.length === 0 || !result[0].deliveryUploadFileUrl) {
      return NextResponse.json(
        { error: "File not found for the given pharmacyId" },
        { status: 404 }
      );
    }

    return NextResponse.json({ url: result[0].deliveryUploadFileUrl });
  } catch (err: any) {
    console.error("Error fetching file:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
