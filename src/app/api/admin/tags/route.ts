import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db-config";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  try {
    // Get user ID from query params or headers
    const userId = request.nextUrl.searchParams.get('uid') ||
                   request.headers.get('x-user-id');

    // Check admin access
    const { isAdmin, error } = await requireAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json(
        { error: error || "Admin access required" },
        { status: 403 }
      );
    }

    // Get all tags with usage statistics
    const tagsQuery = `
      SELECT
        t.tag_id,
        t.tag_name,
        t.created_at,
        COUNT(DISTINCT lt.listing_id) as current_listings
      FROM Tags t
      LEFT JOIN ListingTags lt ON t.tag_id = lt.tag_id
      LEFT JOIN Listing l ON lt.listing_id = l.id AND l.status != 'removed'
      GROUP BY t.tag_id, t.tag_name, t.created_at
      ORDER BY current_listings DESC, t.created_at DESC
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

export async function DELETE(request: NextRequest) {
  try {
    // Get user ID from query params or headers
    const userId = request.nextUrl.searchParams.get('uid') ||
                   request.headers.get('x-user-id');

    // Check admin access
    const { isAdmin, error } = await requireAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json(
        { error: error || "Admin access required" },
        { status: 403 }
      );
    }

    const { tagId } = await request.json();

    if (!tagId || typeof tagId !== 'number') {
      return NextResponse.json(
        { success: false, error: "Tag ID is required" },
        { status: 400 }
      );
    }

    // Delete the tag (this will cascade to ListingTags due to foreign key constraint)
    const deleteQuery = "DELETE FROM Tags WHERE tag_id = ?";
    const [result] = await pool.query(deleteQuery, [tagId]) as any;

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Tag not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tag deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete tag" },
      { status: 500 }
    );
  }
}