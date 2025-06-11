import { NextResponse, NextRequest } from "next/server";
import type { RowDataPacket } from 'mysql2';
import pool from "@/lib/db-connect";

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
        const itemsPerPage = 18;
        
        const pageOffset = (pageToNum - 1) * itemsPerPage;

        const args : (number|string) [] = [];
        
        const query = `
        SELECT type, price, title, description, 
                product_condition AS condition, 
                quantity, location, posted_date AS postedDate, 
                posted_by AS postedBy, status
        FROM Listings
        ${category !== "all" ? 'WHERE category = ?' : ''}
        ORDER BY postedDate DESC LIMIT ? OFFSET ?
        `;

        if (category !== "all") {
            args.push(category)     // Each of the element in arg will replace 
                                    // the '?' in the query in order
        }
        args.push(itemsPerPage, pageOffset);

        const [rows] = await pool.query(query, args);

        // Now, we need to send to front-end the number of pages to render
        const countPageQuery = `
            SELECT COUNT(*) AS totalItems
            FROM Listings
            ${category !== "all" ? 'WHERE category = ?' : ''}
        `;

        const countQueryArg : string[] = category !== "all" ? [category] : []
        const [totalItems] = await pool.query<CountRows[]>(countPageQuery, countQueryArg);
        let totalRows = 0;
        if (totalItems.length >= 1) {
            totalRows = totalItems[0].total
        }

        return NextResponse.json({
            listings: rows,
            totalPages: totalRows / itemsPerPage
        })

    } catch(error) {
        console.error("Database error for listings: ", error);
        return NextResponse.json(
            { error: "Database connection failed" },
            { status: 500 }
        )
    }

}