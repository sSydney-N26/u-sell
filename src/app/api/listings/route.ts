import { NextResponse, NextRequest } from "next/server";
import type { RowDataPacket } from 'mysql2';
import pool from "@/lib/db-config";

interface CountRows extends RowDataPacket {
    totalRows : number
}

// We need query to fetch desired products.
// We need what page we are on to return the appropriate number of listings
// We need category as well in case users are filtering by
// product type to display the appropriate products

export async function GET(request : NextRequest) {
    try {
        const parsedUrl = new URL(request.url);
        const params = parsedUrl.searchParams;

        const page = params.get("page") || '1';
        const pageToNum = parseInt(page, 10);
        const category = params.get("category") || "all";
        const itemsPerPage = 15;

        const pageOffset = (pageToNum - 1) * itemsPerPage;

        const args : (number|string) [] = [];

        const query = `
        SELECT id, type, price, title, description, 
                product_condition, 
                quantity, location, posted_date, 
                posted_by, status
        FROM Listing
        ${category !== "all" ? 'WHERE type = ?' : ''}
        ORDER BY posted_date ASC LIMIT ? OFFSET ?
        `;

        if (category !== "all") {
            args.push(category)     // Each of the element in arg will replace 
                                    // the '?' in the query in order
        }
        args.push(itemsPerPage, pageOffset);

        const [rows] = await pool.query(query, args);

        const countPageQuery = `
            SELECT COUNT(*) AS totalItems
            FROM Listing
            ${category !== "all" ? 'WHERE type = ?' : ''}
        `;

        const countQueryArg : string[] = category !== "all" ? [category] : []
        const [countResponse] = await pool.query<CountRows[]>(countPageQuery, countQueryArg);
        const totalRows = countResponse[0].totalItems;
        const totalPages = Math.ceil((totalRows/itemsPerPage) > 0 ? totalRows/itemsPerPage : 1)

        return NextResponse.json({
            listings: rows,
            totalPages: totalPages
        })

    } catch(error) {
        console.error("Database error for listings: ", error);
        return NextResponse.json(
            { error: "Database connection failed" },
            { status: 500 }
        )
    }
}
