import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db-config";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { params } = await context;
    const listingId = params.id;

    if (!listingId) {
      return NextResponse.json(
        { error: "Listing ID is required" },
        { status: 400 }
      );
    }

    const [rows] = await pool.query(
      `SELECT
        id, type, price, title, description, product_condition,
        quantity, location, posted_date, posted_by, status, image_storage_ref
       FROM Listing
       WHERE id = ? AND status != 'removed' AND status != 'flagged'
       LIMIT 1`,
      [listingId]
    );

    const listings = rows as any[];

    if (!listings || listings.length === 0) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(listings[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching listing:", error);
    return NextResponse.json(
      { error: "Failed to fetch listing" },
      { status: 500 }
    );
  }
}