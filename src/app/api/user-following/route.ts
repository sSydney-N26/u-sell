import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db-config";
import { RowDataPacket } from 'mysql2';


export interface FollowRows extends RowDataPacket {
    uid: string;
    username: string;
    email: string;
    program: string;
    year: number;
}

export interface FollowSuggestion extends RowDataPacket {
    uid: string;
    username: string;
    email: string;
    program: string;
    year: number;
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const uid = searchParams.get("uid");
        console.log(uid);

        if (!uid) {
            return NextResponse.json(
                { error: "UID parameter is required" },
                { status: 400 }
            );
        }

        const [currentFollowings] = await pool.query<FollowRows[]>(
            `
            SELECT uf.followee_id AS uid, u.email, u.username, u.program, u.year
            FROM UserFollowedUsers uf
            JOIN Users u ON uf.followee_id = u.uid
            WHERE uf.user_id = ?
            `, [uid]
        );

        const followedUsers = currentFollowings;

        let allSuggestions: FollowSuggestion[];

        // If user currently doesn't follow anyone:
        if (followedUsers.length === 0) {
            const [results] = await pool.query<FollowSuggestion[]>(
                `
                SELECT uid, username, email, program, year
                FROM Users
                WHERE uid != ?
                ORDER BY RAND()
                LIMIT 10;
                `,
                [uid]
            );
            allSuggestions = results;
        } else {
            const [results] = await pool.query<FollowSuggestion[]>(
            `
                WITH RECURSIVE FriendsofFriends AS (
                SELECT followee_id AS uid, 1 AS depth
                FROM UserFollowedUsers
                WHERE user_id = ?
                UNION ALL
                SELECT uf.followee_id AS uid, f.depth + 1 AS depth
                FROM UserFollowedUsers uf
                JOIN FriendsofFriends f ON uf.user_id = f.uid
                WHERE f.depth < 2
                )
                SELECT DISTINCT 
                u.uid,
                u.username,
                u.email,
                u.program,
                u.year
                FROM FriendsofFriends f
                JOIN Users u ON u.uid = f.uid
                WHERE f.depth = 2
                AND u.uid NOT IN (
                    SELECT followee_id
                    FROM UserFollowedUsers
                    WHERE user_id = ?
                )
                AND u.uid != ?
                LIMIT 10;
            `,
            [uid, uid, uid]
            );

            if (results.length === 0) {
                const [random] = await pool.query<FollowSuggestion[]>(
                `
                SELECT uid, username, email, program, year
                FROM Users
                WHERE uid != ?
                ORDER BY RAND()
                LIMIT 10;
                `,
                [uid]
                );

                allSuggestions = random
            } else {
                allSuggestions = results;
            }
        }

        return NextResponse.json(
            { followedUsers, allSuggestions },
            { status: 200 }
        );
    } catch(error) {
        console.error("Database error fetching users' followers", error);
        return NextResponse.json(
            { error: "Failed to fetch users' followers" },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const { user_id, followee_id } = await request.json();

        if (!user_id || !followee_id) {
            return NextResponse.json(
                {error: "Both follower and followee IDs are required to record following"},
                { status: 400 }
            );
        }
        
        await pool.query(
            `INSERT IGNORE INTO UserFollowedUsers(user_id, followee_id)
             VALUES (?, ?)`, 
            [user_id, followee_id]
        );

        return NextResponse.json(
            { message: "Successfully followed user"},
            { status: 200 }
        )
    } catch(error) {
        console.error("POST /api/user-following error:", error)
        return NextResponse.json(
            { error: "Could not follow user" },
            { status: 500 }
        )
    }
}

export async function DELETE(request: NextRequest) {

    try {
        const { searchParams } = new URL(request.url);
        const user_id = searchParams.get("uid");
        const followee_id = searchParams.get("followee_id");

        if (!user_id || !followee_id) {
            return NextResponse.json(
                { error: "User ID and Followee ID are both required to Unfollow" },
                { status: 400 }
            )
        }

        await pool.query(
            `
            DELETE FROM UserFollowedUsers WHERE user_id = ? AND followee_id = ?
            `,
            [user_id, followee_id]
        );
        return NextResponse.json(
            { message: `${user_id} unfollowed ${followee_id} successfully!` },
            { status: 200 }
        )
    } catch(error) {
        console.error("Error unfollowing user", error);
        return NextResponse.json(
            { error: "Failed to unfollow user" },
            { status: 500 }
        )
    }

}
