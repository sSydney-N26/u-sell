// src/app/api/listing/most‑viewed/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db-config";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        id,
        title,
        price,
        type,
        posted_by,
        view_count,
        image_storage_ref
      FROM Listing
      WHERE status = 'for sale'
      ORDER BY view_count DESC, posted_date DESC
      LIMIT 10
    `);

    // Normalizing
    let rows: any[];
    if (Array.isArray(result)) {
      rows = result[0] as any[];
    } else if ("rows" in result) {
      rows = (result as any).rows;
    } else {
      rows = result as any[];
    }

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching most‑viewed:", error);
    return NextResponse.json(
      { error: "DB error" },
      { status: 500 }
    );
  }
}
