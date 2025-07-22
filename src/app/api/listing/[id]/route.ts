import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db-config";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { params } = await context;
    const listingId = (await params).id;

    if (!listingId) {
      return NextResponse.json(
        { error: "Listing ID is required" },
        { status: 400 }
      );
    }

    // Get listing details with tags
    const [rows] = await pool.query(
      `SELECT
        l.id, l.type, l.price, l.title, l.description, l.product_condition,
        l.quantity, l.location, l.posted_date, l.posted_by, l.status, l.image_storage_ref,
        t.tag_id, t.tag_name
       FROM Listing l
       LEFT JOIN ListingTags lt ON l.id = lt.listing_id
       LEFT JOIN Tags t ON lt.tag_id = t.tag_id
       WHERE l.id = ? AND l.status != 'removed' AND l.status != 'flagged'
       ORDER BY t.tag_name`,
      [listingId]
    );

    const results = rows as any[];

    if (!results || results.length === 0) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // Extract listing data from first row
    const listing = {
      id: results[0].id,
      type: results[0].type,
      price: results[0].price,
      title: results[0].title,
      description: results[0].description,
      product_condition: results[0].product_condition,
      quantity: results[0].quantity,
      location: results[0].location,
      posted_date: results[0].posted_date,
      posted_by: results[0].posted_by,
      status: results[0].status,
      image_storage_ref: results[0].image_storage_ref,
      tags: [] as { tag_id: number; tag_name: string }[]
    };

    // Extract tags from all rows
    results.forEach(row => {
      if (row.tag_id && row.tag_name) {
        listing.tags.push({
          tag_id: row.tag_id,
          tag_name: row.tag_name
        });
      }
    });

    return NextResponse.json(listing, { status: 200 });
  } catch (error) {
    console.error("Error fetching listing:", error);
    return NextResponse.json(
      { error: "Failed to fetch listing" },
      { status: 500 }
    );
  }
}