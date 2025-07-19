import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db-config";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const listingId = params.id;

  try {
    await pool.query(
      `INSERT INTO ListingViews (listing_id, viewer_id) VALUES (?, NULL)`,
      [listingId]
    );
    const [rows] = await pool.query(
      `SELECT view_count FROM Listing WHERE id = ?`,
      [listingId]
    );
    const view_count = Array.isArray(rows) ? (rows as any[])[0]?.view_count : (rows as any).rows[0]?.view_count;
    return NextResponse.json({ view_count });
  } catch (error) {
    console.error("Error logging view:", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
