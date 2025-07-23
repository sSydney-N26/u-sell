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

    const [results] = await pool.query(
      `
      SELECT DISTINCT 
        l.id, l.seller_id, l.type, l.price, l.title, l.description, 
        l.product_condition, l.quantity, l.location, l.posted_date, 
        l.posted_by, l.status, l.image_storage_ref,
        CASE
          WHEN l.seller_id IN (SELECT followee_id FROM UserFollowedUsers WHERE user_id = ?)
          THEN 'user'
          WHEN l.type IN (SELECT category FROM UserFollowedCategories WHERE user_id = ?) 
            AND EXISTS (SELECT 1 FROM UserFollowedKeywords uk WHERE uk.user_id = ?
              AND (LOWER(l.title) LIKE CONCAT('%', uk.keyword, '%') OR LOWER(l.description) LIKE CONCAT('%', uk.keyword, '%')))
          THEN 'both'
          WHEN l.type IN (SELECT category FROM UserFollowedCategories WHERE user_id = ?)
          THEN 'category'
          ELSE 'keyword'
        END as match_type
      FROM Listing l
      WHERE l.seller_id != ? 
        AND l.status = 'for sale'
        AND (
          l.type IN (
            SELECT category 
            FROM UserFollowedCategories 
            WHERE user_id = ?
          )
          OR 
          EXISTS (
            SELECT 1 
            FROM UserFollowedKeywords uk 
            WHERE uk.user_id = ? 
              AND (
                LOWER(l.title) LIKE CONCAT('%', uk.keyword, '%') 
                OR LOWER(l.description) LIKE CONCAT('%', uk.keyword, '%')
              )
          ) OR l.seller_id IN (
              SELECT followee_id FROM UserFollowedUsers WHERE user_id = ? 
          )
        )
      ORDER BY l.posted_date DESC
      `,
      [uid, uid, uid, uid, uid, uid, uid, uid]
    );

    const listings = results as UserListing[];

    return NextResponse.json({
      listings,
    });
  } catch (error) {
    console.error("Error fetching FYP listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch personalized listings" },
      { status: 500 }
    );
  }
}
