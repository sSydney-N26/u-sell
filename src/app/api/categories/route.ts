import { NextResponse } from "next/server";
import pool from "@/lib/db-config";

export async function GET() {
  try {
    const [results] = await pool.query(
      "SELECT type as category FROM ProductType ORDER BY type"
    );

    const categories = (results as { category: string }[]).map(
      (row) => row.category
    );

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
