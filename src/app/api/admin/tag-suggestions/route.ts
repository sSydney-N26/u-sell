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

    // Query to find common words in listing titles that could become tags
    // This uses MySQL's SUBSTRING_INDEX and string functions to tokenize titles
    // This is a diy tokenizer where we: loop through 20 words in the title
    // For each word, we check if it's a valid tag (not a stop word and not already in the db)
    // We then count the frequency of the word in all listing titles
    // We then order the words by frequency and return the top 20
    // We also return the total number of listings that contain the word
    const suggestionQuery = `
      WITH RECURSIVE
      numbers AS (
        SELECT 1 as n
        UNION ALL
        SELECT n + 1 FROM numbers WHERE n < 20
      ),
      words AS (
        SELECT
          TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(LOWER(l.title), ' ', n), ' ', -1)) as word,
          COUNT(*) as frequency
        FROM Listing l
        CROSS JOIN numbers
        WHERE
          l.status != 'removed'
          AND LENGTH(TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(LOWER(l.title), ' ', n), ' ', -1))) > 2
          AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(LOWER(l.title), ' ', n), ' ', -1)) != ''
          AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(LOWER(l.title), ' ', n), ' ', -1)) NOT IN (
            'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were',
            'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
            'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'a', 'an', 'new', 'used', 'like', 'good',
            'great', 'excellent', 'perfect', 'condition', 'quality', 'brand', 'original', 'authentic', 'genuine'
          )
        GROUP BY TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(LOWER(l.title), ' ', n), ' ', -1))
        HAVING COUNT(*) >= 3
      )
      SELECT
        word,
        frequency,
        (SELECT COUNT(*) FROM Listing l2 WHERE LOWER(l2.title) LIKE CONCAT('%', word, '%')) as total_listings
      FROM words
      WHERE word NOT IN (SELECT tag_name FROM Tags)
      ORDER BY frequency DESC, total_listings DESC
      LIMIT 20
    `;

    const [suggestions] = await pool.query(suggestionQuery);

    return NextResponse.json({
      success: true,
      suggestions: suggestions
    });

  } catch (error) {
    console.error("Error fetching tag suggestions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tag suggestions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const { tagName } = await request.json();

    if (!tagName || typeof tagName !== 'string') {
      return NextResponse.json(
        { success: false, error: "Tag name is required" },
        { status: 400 }
      );
    }

    // Insert the new tag
    const insertTagQuery = `
      INSERT INTO Tags (tag_name)
      VALUES (?)
      ON DUPLICATE KEY UPDATE tag_name = tag_name
    `;

    await pool.query(insertTagQuery, [tagName.toLowerCase()]);



    return NextResponse.json({
      success: true,
      message: `Tag "${tagName}" created successfully`
    });

  } catch (error) {
    console.error("Error creating tag:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create tag" },
      { status: 500 }
    );
  }
}