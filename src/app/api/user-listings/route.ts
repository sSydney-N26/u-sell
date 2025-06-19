import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db-config";
import UserListing from "@/utils/types/userListing";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      return NextResponse.json(
        { error: "UID parameter is required" },
        { status: 400 }
      );
    }

    try {
      const [rows] = await pool.query(
        `SELECT 
          id, type, price, title, description, product_condition, 
          quantity, location, posted_date, posted_by, status, image_storage_ref
         FROM Listing 
         WHERE seller_id = ? 
         ORDER BY posted_date DESC`,
        [uid]
      );

      const listings = rows as UserListing[];

      return NextResponse.json(listings, { status: 200 });
    } catch (dbError: unknown) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to fetch user listings" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
