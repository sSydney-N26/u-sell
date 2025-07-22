import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('uid');

    if (!userId) {
      return NextResponse.json(
        { isAdmin: false, error: "User ID required" },
        { status: 400 }
      );
    }

    const adminStatus = await isAdmin(userId);

    return NextResponse.json({
      isAdmin: adminStatus
    });

  } catch (error) {
    console.error("Error checking admin status:", error);
    return NextResponse.json(
      { isAdmin: false, error: "Failed to check admin status" },
      { status: 500 }
    );
  }
}