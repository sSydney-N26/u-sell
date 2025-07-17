import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db-config";

export async function GET(request: NextRequest) {
  try {
    // TODO: Add admin authentication check here
    // For now, we'll allow access to see flagged listings

    const [results] = await pool.query(
      `SELECT
        l.id, l.type, l.price, l.title, l.description, l.product_condition,
        l.quantity, l.location, l.posted_date, l.posted_by, l.status,
        l.image_storage_ref, l.seller_id,
        u.username as seller_username, u.email as seller_email,
        (SELECT COUNT(DISTINCT reporter_id) FROM Reports WHERE listing_id = l.id) as report_count
       FROM Listing l
       JOIN Users u ON l.seller_id = u.uid
       WHERE l.status = 'flagged'
       ORDER BY l.posted_date DESC`
    );

    const flaggedListings = results as any[];

    return NextResponse.json({ flaggedListings }, { status: 200 });
  } catch (error) {
    console.error("Error fetching flagged listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch flagged listings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { listingId, action } = body; // action: 'approve' or 'remove'

    if (!listingId || !action) {
      return NextResponse.json(
        { error: "Listing ID and action are required" },
        { status: 400 }
      );
    }

    if (!['approve', 'remove'].includes(action)) {
      return NextResponse.json(
        { error: "Action must be 'approve' or 'remove'" },
        { status: 400 }
      );
    }

    const newStatus = action === 'approve' ? 'for sale' : 'removed';

    await pool.query(
      `UPDATE Listing SET status = ? WHERE id = ? AND status = 'flagged'`,
      [newStatus, listingId]
    );

    return NextResponse.json(
      {
        success: true,
        message: `Listing ${action === 'approve' ? 'approved' : 'removed'} successfully`
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating flagged listing:", error);
    return NextResponse.json(
      { error: "Failed to update listing" },
      { status: 500 }
    );
  }
}