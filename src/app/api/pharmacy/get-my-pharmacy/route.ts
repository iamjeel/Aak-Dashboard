import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { db } from "@/lib/pgsql";
import { pharmacies } from "@/db/schema/pharmacies";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = (await getServerSession(authOptions)) as any;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [pharmacy] = await db
      .select()
      .from(pharmacies)
      .where(eq(pharmacies.email, session.user.email))
      .limit(1);

    if (!pharmacy) {
      return NextResponse.json(
        { error: "Pharmacy not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(pharmacy);
  } catch (err: any) {
    console.error("Error in get-my-pharmacy:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch pharmacy" },
      { status: 500 }
    );
  }
}
