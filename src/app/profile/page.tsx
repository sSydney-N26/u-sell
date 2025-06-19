"use client";

import { useState, useEffect } from "react";
import Post, { PostInfo } from "@/components/Post";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/lib/firebase/AuthContext";
import { useRouter } from "next/navigation";

interface UserData {
  uid: string;
  username: string;
  email: string;
  program: string;
  year: number;
  created_at: string;
}

interface DatabaseListing {
  id: number;
  type: string;
  price: number;
  title: string;
  description: string;
  product_condition: string;
  quantity: number;
  location: string;
  posted_date: string;
  posted_by: string;
  status: string;
  image_storage_ref: string | null;
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"active" | "sold">("active");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userListings, setUserListings] = useState<DatabaseListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [loading, user, router]);

  // Fetch user data and listings
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch user data
        const userResponse = await fetch(
          `/api/firebase-user-sync?uid=${user.uid}`
        );
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await userResponse.json();
        setUserData(userData);

        // Fetch user listings
        const listingsResponse = await fetch(
          `/api/user-listings?uid=${user.uid}`
        );
        if (!listingsResponse.ok) {
          throw new Error("Failed to fetch user listings");
        }
        const listingsData = await listingsResponse.json();
        setUserListings(listingsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load profile data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.uid]);

  // Convert database listings to PostInfo format
  const convertToPostInfo = (listing: DatabaseListing): PostInfo => ({
    title: listing.title,
    description: listing.description,
    price: listing.price,
    sold: listing.status === "sold",
    category: listing.type,
    postedBy: userData?.username || "Unknown",
  });

  const activePosts = userListings
    .filter((listing) => listing.status === "for sale")
    .map(convertToPostInfo);

  const soldPosts = userListings
    .filter((listing) => listing.status === "sold")
    .map(convertToPostInfo);

  // Handler to open confirmation modal
  const openConfirm = (listingId: number) => {
    setPendingDeleteId(listingId);
    setShowConfirm(true);
  };

  // Handler to close confirmation modal
  const closeConfirm = () => {
    setShowConfirm(false);
    setPendingDeleteId(null);
  };

  // Handler to actually delete after confirmation
  const confirmDelete = async () => {
    if (pendingDeleteId === null) return;
    setDeletingId(pendingDeleteId);
    setShowConfirm(false);
    try {
      const res = await fetch(
        `/api/user-listings?uid=${user?.uid}&id=${pendingDeleteId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) {
        throw new Error("Failed to delete listing");
      }
      setUserListings((prev) => prev.filter((l) => l.id !== pendingDeleteId));
    } catch {
      alert("Error deleting listing");
    } finally {
      setDeletingId(null);
      setPendingDeleteId(null);
    }
  };

  // Loading state
  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Error Loading Profile
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-yellow-400 text-black px-6 py-3 rounded-lg hover:bg-yellow-300 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No user data found
  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">👤</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Profile Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              Your profile information is not available. Please complete your
              profile setup.
            </p>
            <button
              onClick={() => router.push("/auth")}
              className="bg-yellow-400 text-black px-6 py-3 rounded-lg hover:bg-yellow-300 transition-colors"
            >
              Complete Setup
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Profile Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8">
            {/* Profile Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-black">
                  {userData.username.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {userData.username}
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                {userData.program} • Year {userData.year}
              </p>
              <p className="text-sm text-gray-500 mt-1">{userData.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Member since{" "}
                {new Date(userData.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            </div>

            {/* Stats */}
            <div className="flex space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {userListings.length}
                </div>
                <div className="text-sm text-gray-500">Total Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {activePosts.length}
                </div>
                <div className="text-sm text-gray-500">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {soldPosts.length}
                </div>
                <div className="text-sm text-gray-500">Sold</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "active"
                ? "bg-yellow-400 text-black"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Active Listings ({activePosts.length})
          </button>
          <button
            onClick={() => setActiveTab("sold")}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "sold"
                ? "bg-yellow-400 text-black"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Sold Items ({soldPosts.length})
          </button>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(activeTab === "active"
            ? userListings.filter((listing) => listing.status === "for sale")
            : userListings.filter((listing) => listing.status === "sold")
          ).map((listing) => (
            <div
              key={listing.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 relative"
            >
              <Post {...convertToPostInfo(listing)} />
              {activeTab === "active" && (
                <button
                  onClick={() => openConfirm(listing.id)}
                  disabled={deletingId === listing.id}
                  className={`absolute top-2 right-2 px-3 py-1 rounded bg-red-500 text-white text-xs font-semibold shadow hover:bg-red-600 transition-colors ${
                    deletingId === listing.id
                      ? "opacity-60 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {deletingId === listing.id ? "Deleting..." : "Delete"}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {(activeTab === "active" ? activePosts : soldPosts).length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {activeTab} listings yet
            </h3>
            <p className="text-gray-500">
              {activeTab === "active"
                ? "Create your first listing to get started!"
                : "No items have been sold yet."}
            </p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center relative">
            <h2 className="text-xl font-bold mb-4">Delete Listing?</h2>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete this listing? This action cannot
              be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded font-semibold shadow"
              >
                Yes, Delete
              </button>
              <button
                onClick={closeConfirm}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded font-semibold shadow"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
