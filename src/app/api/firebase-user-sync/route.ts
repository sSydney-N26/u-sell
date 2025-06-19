import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db-config";

interface UserData {
  uid: string;
  username: string;
  email: string;
  program: string;
  year: number;
  created_at?: Date;
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

    //const connection = await mysql.createConnection(dbConfig);

    try {
      const [rows] = await pool.execute(
        "SELECT uid, username, email, program, year, created_at FROM Users WHERE uid = ?",
        [uid]
      );

      const users = rows as UserData[];

      if (users.length === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json(users[0], { status: 200 });
    } catch (dbError: unknown) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to fetch user data" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, username, email, program, year } = body;

    if (!uid || !username || !email || !program || !year) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    //const connection = await mysql.createConnection(dbConfig);

    try {
      await pool.query(
        "INSERT INTO Users (uid, username, email, program, year, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
        [uid, username, email, program, year]
      );

      return NextResponse.json(
        { message: "Firebase user synced to MySQL successfully" },
        { status: 201 }
      );
    } catch (dbError: unknown) {
      console.error("Database error:", dbError);

      if (dbError && typeof dbError === "object" && "code" in dbError) {
        const mysqlError = dbError as { code: string; message: string };
        if (mysqlError.code === "ER_DUP_ENTRY") {
          if (mysqlError.message.includes("username")) {
            return NextResponse.json(
              { error: "Username already exists" },
              { status: 409 }
            );
          } else if (mysqlError.message.includes("email")) {
            return NextResponse.json(
              { error: "Email already exists" },
              { status: 409 }
            );
          }
        }
      }

      return NextResponse.json(
        { error: "Failed to sync Firebase user to MySQL" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
}
