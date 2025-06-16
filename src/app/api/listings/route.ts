import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "admin",
  password: "admin",
  database: "u_sell",
};

export async function GET() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT id, title, price, location, posted_by FROM Listing"
    );
    await connection.end();

    return NextResponse.json({ listings: rows });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Database connection failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received body:", body);
    const {
      type,
      price,
      title,
      description,
      product_condition,
      quantity = 1,
      location,
      posted_by,
      status = "for sale",
      image_storage_ref = null,
    } = body;

    if (!type || !price || !title || !description || !product_condition || !location || !posted_by) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const connection = await mysql.createConnection(dbConfig);

    await connection.execute(
      `INSERT INTO Listing (type, price, title, description, product_condition, quantity, location, posted_by, status, image_storage_ref)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [type, price, title, description, product_condition, quantity, location, posted_by, status, image_storage_ref]
    );

    await connection.end();

    return NextResponse.json({ success: true, message: "Listing created" });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}
