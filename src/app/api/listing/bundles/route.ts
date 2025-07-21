// src/app/api/listing/api/bundles/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db-config";

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM BackToSchoolBundleView
      ORDER BY seller_id, posted_date DESC
    `);
    return NextResponse.json({ bundles: rows });
  } catch (error) {
    console.error("Bundle fetch error:", error);
    return NextResponse.json({ error: "Error fetching bundles" }, { status: 500 });
  }
}
