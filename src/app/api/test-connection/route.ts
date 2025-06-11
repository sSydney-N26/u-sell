import { NextResponse } from "next/server";
import pool from "@/lib/db-connect";

export async function GET() {
  try {

    const [rows] = await pool.execute(
      "SELECT uid, name, score FROM student"
    );

    return NextResponse.json({ students: rows });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Database connection failed" },
      { status: 500 }
    );
  }
}
