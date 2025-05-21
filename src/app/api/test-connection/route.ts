import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "admin",
      password: "admin1!",
      database: "testDB",
    });

    const [rows] = await connection.execute(
      "SELECT uid, name, score FROM student"
    );
    await connection.end();

    return NextResponse.json({ students: rows });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Database connection failed" },
      { status: 500 }
    );
  }
}
