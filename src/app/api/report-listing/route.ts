import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db-config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { listingId, reporterId, reason, description } = body;

    if (!listingId || !reporterId || !reason) {
      return NextResponse.json(
        { error: "Listing ID, reporter ID, and reason are required" },
        { status: 400 }
      );
    }

    // Check if the listing exists and is not already removed
    const [listingRows] = await pool.query(
      `SELECT id, status FROM Listing WHERE id = ?`,
      [listingId]
    );
    const listings = listingRows as { id: number; status: string }[];

    if (!listings || listings.length === 0) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    if (listings[0].status === 'removed') {
      return NextResponse.json(
        { error: "Listing has already been removed" },
        { status: 400 }
      );
    }

    if (listings[0].status === 'flagged') {
      return NextResponse.json(
        { error: "Listing has already been flagged for review" },
        { status: 400 }
      );
    }

    // Check if user has already reported this listing
    const [existingReportRows] = await pool.query(
      `SELECT id FROM Reports WHERE listing_id = ? AND reporter_id = ?`,
      [listingId, reporterId]
    );
    const existingReports = existingReportRows as { id: number }[];

    if (existingReports && existingReports.length > 0) {
      return NextResponse.json(
        { error: "You have already reported this listing" },
        { status: 400 }
      );
    }

    // Insert the report (trigger will handle automatic flagging if needed)
    await pool.query(
      `INSERT INTO Reports (listing_id, reporter_id, reason, description) VALUES (?, ?, ?, ?)`,
      [listingId, reporterId, reason, description || null]
    );

    // Check if the listing was flagged by the trigger
    const [listingStatusRows] = await pool.query(
      `SELECT status FROM Listing WHERE id = ?`,
      [listingId]
    );
    const listingStatus = listingStatusRows as { status: string }[];

    if (listingStatus[0].status === 'flagged') {
      return NextResponse.json(
        {
          success: true,
          message: "Report submitted successfully. Listing has been flagged for admin review.",
          listingFlagged: true
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Report submitted successfully",
        listingFlagged: false
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error reporting listing:", error);
    return NextResponse.json(
      { error: "Failed to submit report" },
      { status: 500 }
    );
  }
}