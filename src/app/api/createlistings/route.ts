import { NextResponse, NextRequest } from "next/server";
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import mysql from "mysql2/promise";
import pool from "@/lib/db-config";

interface CountRows extends RowDataPacket {
    totalItems : number
}

// We need query to fetch desired products.
// We need what page we are on to return the appropriate number of listings
// We need category as well in case users are filtering by
// product type to display the appropriate products

export async function GET(request : NextRequest) {
    try {
        const parsedUrl = new URL(request.url);
        const params = parsedUrl.searchParams;

        const page = params.get("page") || '1';
        const pageToNum = parseInt(page, 10);
        const category = params.get("category") || "all";
        const itemsPerPage = 15;

        const pageOffset = (pageToNum - 1) * itemsPerPage;

        const args : (number|string) [] = [];

        const query = `
        SELECT id, type, price, title, description,
                product_condition,
                quantity, location, posted_date,
                posted_by, status
        FROM Listing
        WHERE status != 'removed' AND status != 'flagged' AND status != 'sold'
        ${category !== "all" ? 'AND type = ?' : ''}
        ORDER BY posted_date ASC LIMIT ? OFFSET ?
        `;

        if (category !== "all") {
            args.push(category)     // Each of the element in arg will replace
                                    // the '?' in the query in order
        }
        args.push(itemsPerPage, pageOffset);

        const [rows] = await pool.query(query, args);

        const countPageQuery = `
        SELECT COUNT(*) AS totalItems
        FROM Listing
        WHERE status != 'removed'
        AND status != 'flagged' AND status != 'sold'
        ${category !== "all" ? 'AND type = ?' : ''}
      `;

  const countQueryArgs = category !== "all" ? [category] : [];
  const [countResponse] = await pool.query<CountRows[]>(countPageQuery, countQueryArgs);
  const totalRows  = countResponse[0].totalItems;
  const totalPages = Math.max(1, Math.ceil(totalRows / itemsPerPage));

  return NextResponse.json({ listings: rows, totalPages });

    } catch(error) {
        console.error("Database error for listings: ", error);
        return NextResponse.json(
            { error: "Database connection failed" },
            { status: 500 }
        )
    }
}

const dbConfig = {
  host: "localhost",
  user: "admin",
  password: "admin1!",
  database: "u_sell",
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received body:", body);

    const {
      seller_id,
      type,
      price, // TODO
      title,
      description,
      product_condition,
      quantity,
      location,
      posted_by,
      status = "for sale",
      image_storage_ref,
      tags = [], // New field for tags
    } = body;

    if (!type || price < 0 || !title || !description || !product_condition || !location || !posted_by) {
      console.log("Missing required fields");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate tags (max 5 tags)
    if (tags && tags.length > 5) {
      return NextResponse.json({ error: "Maximum 5 tags allowed" }, { status: 400 });
    }

    const connection = await mysql.createConnection(dbConfig);

    // Start transaction
    await connection.beginTransaction();

    try {
      // Insert the listing
      const [result] = await connection.execute(
        `INSERT INTO Listing (seller_id, type, price, title, description, product_condition, quantity, location, posted_by, status, image_storage_ref)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [seller_id, type, price, title, description, product_condition, quantity, location, posted_by, status, image_storage_ref]
      );

      const listingId = (result as ResultSetHeader).insertId;

      // Add tags if provided
      if (tags && tags.length > 0) {
        for (const tagId of tags) {
          // Verify tag exists
          const [tagCheck] = await connection.execute(
            "SELECT tag_id FROM Tags WHERE tag_id = ?",
            [tagId]
          );

          if ((tagCheck as RowDataPacket[]).length > 0) {
            // Insert tag association
            await connection.execute(
              "INSERT IGNORE INTO ListingTags (listing_id, tag_id) VALUES (?, ?)",
              [listingId, tagId]
            );
          }
        }
      }

      await connection.commit();
      await connection.end();

      return NextResponse.json({ success: true, message: "Listing created" });
    } catch (error) {
      await connection.rollback();
      await connection.end();
      throw error;
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}
