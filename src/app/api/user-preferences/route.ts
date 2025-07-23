import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db-config";

interface UserPreferences {
  followedCategories: string[];
  followedKeywords: string[];
  followedTags: { tag_id: number; tag_name: string }[];
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

    const [results] = await pool.query(
      `
      SELECT 'category' as type, category as value, NULL as tag_id, NULL as tag_name
      FROM UserFollowedCategories 
      WHERE user_id = ?
      UNION ALL
      SELECT 'keyword' as type, keyword as value, NULL as tag_id, NULL as tag_name
      FROM UserFollowedKeywords 
      WHERE user_id = ?
      UNION ALL
      SELECT 'tag' as type, NULL as value, t.tag_id, t.tag_name
      FROM UserFollowedTags ut
      JOIN Tags t ON ut.tag_id = t.tag_id
      WHERE ut.user_id = ?
      ORDER BY type, value, tag_name
      `,
      [uid, uid, uid]
    );

    const preferences: UserPreferences = {
      followedCategories: [],
      followedKeywords: [],
      followedTags: [],
    };

    const rows = results as {
      type: string;
      value: string | null;
      tag_id: number | null;
      tag_name: string | null;
    }[];
    rows.forEach((row) => {
      if (row.type === "category" && row.value) {
        preferences.followedCategories.push(row.value);
      } else if (row.type === "keyword" && row.value) {
        preferences.followedKeywords.push(row.value);
      } else if (row.type === "tag" && row.tag_id && row.tag_name) {
        preferences.followedTags.push({
          tag_id: row.tag_id,
          tag_name: row.tag_name,
        });
      }
    });

    return NextResponse.json(preferences);
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch user preferences" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { uid, type, value } = await request.json();

    if (!uid || !type || !value) {
      return NextResponse.json(
        { error: "UID, type, and value are required" },
        { status: 400 }
      );
    }

    if (type !== "category" && type !== "keyword" && type !== "tag") {
      return NextResponse.json(
        { error: "Type must be 'category', 'keyword', or 'tag'" },
        { status: 400 }
      );
    }

    let query: string;
    let params: (string | number)[];

    if (type === "category") {
      query = `
        INSERT INTO UserFollowedCategories (user_id, category)
        SELECT ?, ? 
        WHERE EXISTS (SELECT 1 FROM ProductType WHERE type = ?)
        AND NOT EXISTS (SELECT 1 FROM UserFollowedCategories WHERE user_id = ? AND category = ?)
      `;
      params = [uid, value, value, uid, value];
    } else if (type === "keyword") {
      const keyword = value.toLowerCase().trim();
      if (keyword.length > 20) {
        return NextResponse.json(
          { error: "Keyword must be 20 characters or less" },
          { status: 400 }
        );
      }

      query = `
        INSERT INTO UserFollowedKeywords (user_id, keyword)
        SELECT ?, ?
        WHERE NOT EXISTS (SELECT 1 FROM UserFollowedKeywords WHERE user_id = ? AND keyword = ?)
      `;
      params = [uid, keyword, uid, keyword];
    } else {
      // type === "tag"
      const tagId = parseInt(value.toString(), 10);
      if (isNaN(tagId)) {
        return NextResponse.json(
          { error: "Tag ID must be a valid number" },
          { status: 400 }
        );
      }

      query = `
        INSERT INTO UserFollowedTags (user_id, tag_id)
        SELECT ?, ?
        WHERE EXISTS (SELECT 1 FROM Tags WHERE tag_id = ?)
        AND NOT EXISTS (SELECT 1 FROM UserFollowedTags WHERE user_id = ? AND tag_id = ?)
      `;
      params = [uid, tagId, tagId, uid, tagId];
    }

    const [result] = await pool.query(query, params);
    const insertResult = result as { affectedRows: number };

    if (insertResult.affectedRows === 0) {
      return NextResponse.json(
        {
          error:
            type === "category"
              ? "Category already followed or invalid"
              : type === "keyword"
              ? "Keyword already followed"
              : "Tag already followed or invalid",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: `${type} added successfully` },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding user preference:", error);
    return NextResponse.json(
      { error: "Failed to add preference" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");
    const type = searchParams.get("type");
    const value = searchParams.get("value");

    if (!uid || !type || !value) {
      return NextResponse.json(
        { error: "UID, type, and value are required" },
        { status: 400 }
      );
    }

    if (type !== "category" && type !== "keyword" && type !== "tag") {
      return NextResponse.json(
        { error: "Type must be 'category', 'keyword', or 'tag'" },
        { status: 400 }
      );
    }

    let query: string;
    let params: (string | number)[];

    if (type === "category") {
      query =
        "DELETE FROM UserFollowedCategories WHERE user_id = ? AND category = ?";
      params = [uid, value];
    } else if (type === "keyword") {
      const keyword = value.toLowerCase().trim();
      query =
        "DELETE FROM UserFollowedKeywords WHERE user_id = ? AND keyword = ?";
      params = [uid, keyword];
    } else {
      // type === "tag"
      const tagId = parseInt(value, 10);
      if (isNaN(tagId)) {
        return NextResponse.json(
          { error: "Tag ID must be a valid number" },
          { status: 400 }
        );
      }
      query = "DELETE FROM UserFollowedTags WHERE user_id = ? AND tag_id = ?";
      params = [uid, tagId];
    }

    const [result] = await pool.query(query, params);
    const deleteResult = result as { affectedRows: number };

    if (deleteResult.affectedRows === 0) {
      return NextResponse.json(
        { error: `${type} not found in followed list` },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: `${type} removed successfully` });
  } catch (error) {
    console.error("Error removing user preference:", error);
    return NextResponse.json(
      { error: "Failed to remove preference" },
      { status: 500 }
    );
  }
}
