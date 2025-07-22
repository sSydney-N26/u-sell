import pool from "@/lib/db-config";

export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const [results] = await pool.query(
      "SELECT COUNT(*) as count FROM Admin WHERE admin_id = ?",
      [userId]
    );

    const result = results as any[];
    return result[0]?.count > 0;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

export async function requireAdmin(userId: string | null): Promise<{ isAdmin: boolean; error?: string }> {
  if (!userId) {
    return { isAdmin: false, error: "Authentication required" };
  }

  const adminStatus = await isAdmin(userId);
  if (!adminStatus) {
    return { isAdmin: false, error: "Admin access required" };
  }

  return { isAdmin: true };
}