// src/app/api/listing/most-viewed/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db-config";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        l.id,
        l.title,
        l.price,
        l.type,
        l.posted_by,
        l.image_storage_ref,
        v.view_count
      FROM Top10View v
      JOIN Listing l ON v.listing_id = l.id
      WHERE l.status = 'for sale'
      ORDER BY v.view_count DESC, l.posted_date DESC
    `);

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
