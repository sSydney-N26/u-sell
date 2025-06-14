import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "admin",
  password: "admin1!",
  database: "u_sell",
};

interface UserListing {
  id: number;
  type: string;
  price: number;
  title: string;
  description: string;
  product_condition: string;
  quantity: number;
  location: string;
  posted_date: Date;
  posted_by: string;
  status: string;
  image_storage_ref: string | null;
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

    const connection = await mysql.createConnection(dbConfig);

    try {
      const [rows] = await connection.execute(
        `SELECT 
          id, type, price, title, description, product_condition, 
          quantity, location, posted_date, posted_by, status, image_storage_ref
         FROM Listing 
         WHERE posted_by = ? 
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
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
