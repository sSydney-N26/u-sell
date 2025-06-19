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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");
    const id = searchParams.get("id");

    if (!uid || !id) {
      return NextResponse.json(
        { error: "UID and listing ID are required" },
        { status: 400 }
      );
    }

    // Check if the listing belongs to the user
    const [rows] = await pool.query(
      `SELECT posted_by FROM Listing WHERE id = ?`,
      [id]
    );
    const result = rows as { posted_by: string }[];
    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }
    if (result[0].posted_by !== uid) {
      return NextResponse.json(
        { error: "Unauthorized: You can only delete your own listings" },
        { status: 403 }
      );
    }

    // Delete the listing
    await pool.query(`DELETE FROM Listing WHERE id = ?`, [id]);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting listing:", error);
    return NextResponse.json(
      { error: "Failed to delete listing" },
      { status: 500 }
    );
  }
}
