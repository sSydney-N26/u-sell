// src/app/api/listing/bundles/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db-config";

const SELLERS_PER_PAGE = 5;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);

  try {
    // Step 1: Get distinct seller_ids from the view
    const [distinctSellerRows] = await pool.query(`
      SELECT DISTINCT seller_id
      FROM BackToSchoolBundleView
    `);

    const sellerIds = (distinctSellerRows as any[]).map(row => row.seller_id);

    // Step 2: Paginate seller_ids
    const start = (page - 1) * SELLERS_PER_PAGE;
    const paginatedSellerIds = sellerIds.slice(start, start + SELLERS_PER_PAGE);

    if (paginatedSellerIds.length === 0) {
      return NextResponse.json({ bundles: [], totalPages: Math.ceil(sellerIds.length / SELLERS_PER_PAGE) });
    }

    // Step 3: Get listings for those seller_ids
    const [bundleRows] = await pool.query(
      `
        SELECT *
        FROM BackToSchoolBundleView
        WHERE seller_id IN (?)
        ORDER BY seller_id, posted_date DESC
      `,
      [paginatedSellerIds]
    );

    return NextResponse.json({
      bundles: bundleRows,
      totalPages: Math.ceil(sellerIds.length / SELLERS_PER_PAGE),
    });
    } catch (error) {
      console.error("Error fetching bundle feature:", error);
      return NextResponse.json(
        { error: "DB error" },
        { status: 500 }
      );
    }
  }