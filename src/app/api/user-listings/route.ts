import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db-config";
import UserListing from "@/utils/types/userListing";

interface ListingStats {
  totalListings: number;
  activeListings: number;
  soldListings: number;
  removedListings: number;
  flaggedListings: number;
  averagePrice: number;
  minPrice: number;
  maxPrice: number;
  typeBreakdown: Record<string, number>;
}

interface EnhancedResponse {
  listings: UserListing[];
  statistics: ListingStats;
}

interface MySQLResult {
  affectedRows: number;
  insertId: number;
  warningStatus: number;
}

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

    const [results] = await pool.query(
      `
      SELECT
        l.id, l.type, l.price, l.title, l.description, l.product_condition,
        l.quantity, l.location, l.posted_date, l.posted_by, l.status,
        l.image_storage_ref,
        (SELECT COUNT(*) FROM Listing WHERE seller_id = ?) as totalListings,
        (SELECT SUM(status = 'for sale') FROM Listing WHERE seller_id = ?) as activeListings,
        (SELECT SUM(status = 'sold') FROM Listing WHERE seller_id = ?) as soldListings,
        (SELECT SUM(status = 'removed') FROM Listing WHERE seller_id = ?) as removedListings,
        (SELECT SUM(status = 'flagged') FROM Listing WHERE seller_id = ?) as flaggedListings,
        (SELECT AVG(price) FROM Listing WHERE seller_id = ?) as averagePrice,
        (SELECT MIN(price) FROM Listing WHERE seller_id = ?) as minPrice,
        (SELECT MAX(price) FROM Listing WHERE seller_id = ?) as maxPrice
       FROM Listing l
       WHERE l.seller_id = ?
       ORDER BY l.posted_date DESC`,
      [uid, uid, uid, uid, uid, uid, uid, uid, uid]
    );

    const listings = results as (UserListing & {
      totalListings: number;
      activeListings: number;
      soldListings: number;
      removedListings: number;
      flaggedListings: number;
      averagePrice: string;
      minPrice: string;
      maxPrice: string;
    })[];

    const stats: ListingStats = {
      totalListings: listings[0]?.totalListings || 0,
      activeListings: listings[0]?.activeListings || 0,
      soldListings: listings[0]?.soldListings || 0,
      removedListings: listings[0]?.removedListings || 0,
      flaggedListings: listings[0]?.flaggedListings || 0,
      averagePrice: parseFloat(listings[0]?.averagePrice || "0"),
      minPrice: parseFloat(listings[0]?.minPrice || "0"),
      maxPrice: parseFloat(listings[0]?.maxPrice || "0"),
      typeBreakdown: listings.reduce((acc, listing) => {
        acc[listing.type] = (acc[listing.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };

    const cleanListings: UserListing[] = listings.map((listing) => ({
      id: listing.id,
      type: listing.type,
      price: listing.price,
      title: listing.title,
      description: listing.description,
      product_condition: listing.product_condition,
      quantity: listing.quantity,
      location: listing.location,
      posted_date: listing.posted_date,
      posted_by: listing.posted_by,
      status: listing.status,
      image_storage_ref: listing.image_storage_ref,
    }));

    const response: EnhancedResponse = {
      listings: cleanListings,
      statistics: stats,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error("Database error:", err);
    return NextResponse.json(
      { error: "Failed to fetch user listings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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

    const body = await request.json();

    const editable = [
      "type",
      "title",
      "description",
      "price",
      "product_condition",
      "quantity",
      "location",
      "status",
    ] as const satisfies readonly (keyof UserListing)[];

    const setClauses: string[] = [];
    const values: any[] = [];

    editable.forEach((col) => {
      if (body[col] !== undefined) {
        const colName = col === "type" ? "`type`" : `\`${col}\``;
        setClauses.push(`${colName} = ?`);
        values.push(body[col]);
      }
    });

    if (!setClauses.length) {
      return NextResponse.json(
        { error: "No editible field chosen" },
        { status: 400 }
      );
    }

    const [ownerRows] = await pool.query(
      "SELECT seller_id FROM Listing WHERE id = ?",
      [id]
    );
    const owner = (ownerRows as { seller_id: string }[])[0];
    if (!owner) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }
    if (owner.seller_id !== uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await pool.query(
      `UPDATE Listing SET ${setClauses.join(", ")} WHERE id = ?`,
      [...values, id]
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Error updating listing:", err);
    return NextResponse.json(
      { error: "Failed to update listing" },
      { status: 500 }
    );
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

    const [result] = await pool.query(
      "DELETE FROM Listing WHERE id = ? AND seller_id = ?",
      [id, uid]
    );

    // Check if any rows were affected
    if ((result as MySQLResult).affectedRows === 0) {
      return NextResponse.json(
        { error: "Listing not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Error deleting listing:", err);
    return NextResponse.json(
      { error: "Failed to delete listing" },
      { status: 500 }
    );
  }
}
