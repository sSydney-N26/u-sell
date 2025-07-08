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

    const [rows] = await pool.query(
      `SELECT id, type, price, title, description, product_condition,
              quantity, location, posted_date, posted_by, status,
              image_storage_ref
         FROM Listing
        WHERE seller_id = ?
        ORDER BY posted_date DESC`,
      [uid]
    );

    return NextResponse.json(rows as UserListing[], { status: 200 });
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
    return NextResponse.json({ error: "Failed to update listing" }, { status: 500 });
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
    const [rows] = await pool.query("SELECT seller_id FROM Listing WHERE id = ?", [id]);
    const result = rows as { seller_id: string }[];
    if (!result.length) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }
    if (result[0].seller_id !== uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await pool.query("DELETE FROM Listing WHERE id = ?", [id]);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Error deleting listing:", err);
    return NextResponse.json({ error: "Failed to delete listing" }, { status: 500 });
  }
}
