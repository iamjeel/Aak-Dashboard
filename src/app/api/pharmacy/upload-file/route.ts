import { NextResponse } from "next/server";
import { db } from "@/lib/pgsql";
import { pharmacies } from "@/db/schema/pharmacies";
import { eq } from "drizzle-orm";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const config = {
  api: {
    bodyParser: false, // Important for file uploads
  },
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const pharmacyId = formData.get("pharmacyId");

    if (!file || !pharmacyId) {
      return NextResponse.json(
        { error: "File or pharmacyId missing" },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "application/vnd.ms-excel", // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Read file content into a buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate unique file name
    const fileName = `${uuidv4()}-${file.name}`;

    // Define file path
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, fileName);

    // Ensure the upload directory exists
    await mkdir(uploadDir, { recursive: true });

    // Save file to disk
    await writeFile(filePath, buffer);

    // Construct URL to return
    const fileUrl = `/uploads/${fileName}`;

    // Update pharmacy record in DB
    await db
      .update(pharmacies)
      .set({ deliveryUploadFileUrl: fileUrl })
      .where(eq(pharmacies._id, parseInt(pharmacyId.toString(), 10)));

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (err: any) {
    console.error("File upload error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
