import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db-config";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const listingId = params.id;
  const result = await pool.query(
    `SELECT
       id, type, price, title, description, product_condition,
       quantity, location, posted_date, posted_by, status,
       image_storage_ref, view_count
     FROM Listing
     WHERE id = ? AND status NOT IN ('removed','flagged')
     LIMIT 1`,
    [listingId]
  );

  let rows: any[];
  if (Array.isArray(result)) {
    rows = result[0] as any[];
  } else if ("rows" in result) {
    rows = (result as any).rows;
  } else {
    rows = result as any[];
  }

  if (!rows.length) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }
  return NextResponse.json(rows[0]);
}
