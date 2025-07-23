import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db-config";

interface Notification {
  id: number;
  listing_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
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
      SELECT id, listing_id, message, is_read, created_at
      FROM Notifications 
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 50
      `,
      [uid]
    );

    const notifications = results as Notification[];

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { notificationId, isRead } = await request.json();

    if (!notificationId || typeof isRead !== "boolean") {
      return NextResponse.json(
        { error: "Notification ID and isRead status are required" },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      "UPDATE Notifications SET is_read = ? WHERE id = ?",
      [isRead, notificationId]
    );

    const updateResult = result as { affectedRows: number };

    if (updateResult.affectedRows === 0) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Notification updated successfully" });
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get("id");

    if (!notificationId) {
      return NextResponse.json(
        { error: "Notification ID is required" },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      "DELETE FROM Notifications WHERE id = ?",
      [notificationId]
    );

    const deleteResult = result as { affectedRows: number };

    if (deleteResult.affectedRows === 0) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 }
    );
  }
}
