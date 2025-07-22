import { NextResponse } from "next/server";
import pool from "@/lib/db-config";

export async function GET() {
  try {
    // Get all active tags ordered by usage
    const tagsQuery = `
      SELECT tag_id, tag_name
      FROM Tags
      ORDER BY tag_name ASC
    `;

    const [tags] = await pool.query(tagsQuery);

    return NextResponse.json({
      success: true,
      tags: tags
    });

  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}