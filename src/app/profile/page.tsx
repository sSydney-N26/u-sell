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
  status: string; // "for sale" | "sold" | "removed" | "flagged"
  image_storage_ref: string;
}

interface ListingStats {
  totalListings: number;
  activeListings: number;
  soldListings: number;
  removedListings: number;
  flaggedListings: number;
  averagePrice: number;
  minPrice: number;
  maxPrice: number;
  typeBreakdown: Record<string, number>;
}

interface EnhancedListingsResponse {
  listings: DatabaseListing[];
  statistics: ListingStats;
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"active" | "sold" | "removed" | "flagged">("active");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userListings, setUserListings] = useState<DatabaseListing[]>([]);
  const [listingStats, setListingStats] = useState<ListingStats | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [editingListing, setEditingListing] = useState<DatabaseListing | null>(
    null
  );

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) router.push("/auth");
  }, [loading, user, router]);

  // Fetch user data and listings
  useEffect(() => {
    if (!user?.uid) return;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch user data
        const userProfile = await fetch(
          `/api/firebase-user-sync?uid=${user.uid}`
        );
        if (!userProfile.ok) throw new Error("Failed to fetch user");
        setUserData(await userProfile.json());

        // Fetch user listings with statistics
        const listingsResponse = await fetch(
          `/api/user-listings?uid=${user.uid}`
        );
        if (!listingsResponse.ok) throw new Error("Failed to fetch listings");
        const listingsData: EnhancedListingsResponse =
          await listingsResponse.json();
        setUserListings(listingsData.listings);
        setListingStats(listingsData.statistics);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user?.uid]);

  const convert = (l: DatabaseListing): PostInfo => ({
    imageUrl: l.image_storage_ref,
    title: l.title,
    description: l.description,
    price: l.price,
    sold: l.status === "sold",
    category: l.type,
    postedBy: userData?.username ?? "Unknown",
  });

  const activeListings = userListings.filter((l) => l.status === "for sale");
  const soldListings = userListings.filter((l) => l.status === "sold");
  const removedListings = userListings.filter((l) => l.status === "removed");
  const flaggedListings = userListings.filter((l) => l.status === "flagged");

  const openConfirm = (id: number) => {
    setPendingDeleteId(id);
    setShowConfirm(true);
  };
  const closeConfirm = () => {
    setShowConfirm(false);
    setPendingDeleteId(null);
  };
  const confirmDelete = async () => {
    if (pendingDeleteId === null) return;
    setDeletingId(pendingDeleteId);
    setShowConfirm(false);
    try {
      const res = await fetch(
        `/api/user-listings?uid=${user?.uid}&id=${pendingDeleteId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error();
      setUserListings((prev) => prev.filter((l) => l.id !== pendingDeleteId));
    } catch {
      alert("Error deleting listing");
    } finally {
      setDeletingId(null);
      setPendingDeleteId(null);
    }
  };

  const openEdit = (listing: DatabaseListing) =>
    setEditingListing({ ...listing });
  const closeEdit = () => setEditingListing(null);
  const confirmEdit = async () => {
    if (!editingListing || !user?.uid) return;
    const {
      id,
      type,
      title,
      description,
      price,
      product_condition,
      quantity,
      location,
      status,
    } = editingListing;

    try {
      const res = await fetch(`/api/user-listings?uid=${user.uid}&id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          title,
          description,
          price,
          product_condition,
          quantity,
          location,
          status,
        }),
      });
      if (!res.ok) throw new Error();
      setUserListings((prev) =>
        prev.map((l) => (l.id === id ? editingListing : l))
      );
      closeEdit();
    } catch {
      alert("Error updating listing");
    }
  };

  if (loading || isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading profile…</p>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8">
            {}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-black">
                  {userData?.username.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            {}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {userData?.username}
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                {userData?.program} • Year {userData?.year}
              </p>
              <p className="text-sm text-gray-500 mt-1">{userData?.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Member since{" "}
                {userData &&
                  new Date(userData.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
              </p>
            </div>

            {}
            <div className="flex space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {listingStats?.totalListings || 0}
                </div>
                <div className="text-sm text-gray-500">Total Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {listingStats?.activeListings || 0}
                </div>
                <div className="text-sm text-gray-500">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {listingStats?.soldListings || 0}
                </div>
                <div className="text-sm text-gray-500">Sold</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {listingStats?.removedListings || 0}
                </div>
                <div className="text-sm text-gray-500">Removed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {listingStats?.flaggedListings || 0}
                </div>
                <div className="text-sm text-gray-500">Flagged</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-6 py-3 rounded-lg font-medium ${
              activeTab === "active"
                ? "bg-yellow-400 text-black"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Active Listings ({listingStats?.activeListings || 0})
          </button>
          <button
            onClick={() => setActiveTab("sold")}
            className={`px-6 py-3 rounded-lg font-medium ${
              activeTab === "sold"
                ? "bg-yellow-400 text-black"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Sold Items ({listingStats?.soldListings || 0})
          </button>
          <button
            onClick={() => setActiveTab("removed")}
            className={`px-6 py-3 rounded-lg font-medium ${
              activeTab === "removed"
                ? "bg-yellow-400 text-black"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Removed ({listingStats?.removedListings || 0})
          </button>
          <button
            onClick={() => setActiveTab("flagged")}
            className={`px-6 py-3 rounded-lg font-medium ${
              activeTab === "flagged"
                ? "bg-yellow-400 text-black"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Flagged ({listingStats?.flaggedListings || 0})
          </button>
        </div>

        {}
        {listingStats && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Statistics & Analytics
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Overview of your listing performance
              </p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700">
                        Average Price
                      </p>
                      <p className="text-2xl font-bold text-blue-900">
                        ${listingStats.averagePrice.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-blue-500">
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700">
                        Lowest Price
                      </p>
                      <p className="text-2xl font-bold text-green-900">
                        ${listingStats.minPrice.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-green-500">
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700">
                        Highest Price
                      </p>
                      <p className="text-2xl font-bold text-purple-900">
                        ${listingStats.maxPrice.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-purple-500">
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-700">
                        Price Range
                      </p>
                      <p className="text-2xl font-bold text-orange-900">
                        $
                        {(
                          listingStats.maxPrice - listingStats.minPrice
                        ).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-orange-500">
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {Object.keys(listingStats.typeBreakdown).length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Category Distribution
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {Object.entries(listingStats.typeBreakdown).map(
                      ([type, count]) => (
                        <div
                          key={type}
                          className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors"
                        >
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900 mb-1">
                              {count}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                              {type}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(activeTab === "active" ? activeListings :
            activeTab === "sold" ? soldListings :
            activeTab === "removed" ? removedListings :
            flaggedListings).map(
            (listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden relative hover:shadow-md transition-shadow"
              >
                <Post {...convert(listing)} />
                {activeTab === "active" && (
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button
                      onClick={() => openEdit(listing)}
                      className="px-2 py-1 rounded bg-blue-500 text-white text-xs font-semibold shadow hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openConfirm(listing.id)}
                      disabled={deletingId === listing.id}
                      className={`px-2 py-1 rounded bg-red-500 text-white text-xs font-semibold shadow hover:bg-red-600 ${
                        deletingId === listing.id
                          ? "opacity-60 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {deletingId === listing.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                )}
                {activeTab === "removed" && (
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 rounded bg-red-100 text-red-800 text-xs font-semibold">
                      Removed
                    </span>
                  </div>
                )}
                {activeTab === "flagged" && (
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 rounded bg-orange-100 text-orange-800 text-xs font-semibold">
                      Under Review
                    </span>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-4">Delete Listing?</h2>
            <p className="mb-6 text-gray-700">This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded font-semibold"
              >
                Yes, Delete
              </button>
              <button
                onClick={closeConfirm}
                className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {editingListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full space-y-4">
            <h2 className="text-xl font-bold">Edit Listing</h2>

            <input
              value={editingListing.title}
              onChange={(e) =>
                setEditingListing({ ...editingListing, title: e.target.value })
              }
              placeholder="Title"
              className="w-full border rounded px-3 py-2"
            />
            <textarea
              value={editingListing.description}
              onChange={(e) =>
                setEditingListing({
                  ...editingListing,
                  description: e.target.value,
                })
              }
              placeholder="Description"
              className="w-full border rounded px-3 py-2"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                value={editingListing.price}
                onChange={(e) =>
                  setEditingListing({
                    ...editingListing,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="Price"
                className="border rounded px-3 py-2"
              />
              <select
                value={editingListing.product_condition}
                onChange={(e) =>
                  setEditingListing({
                    ...editingListing,
                    product_condition: e.target.value,
                  })
                }
                className="border rounded px-3 py-2"
              >
                <option value="new">new</option>
                <option value="like new">like new</option>
                <option value="gently used">gently used</option>
                <option value="fair">fair</option>
                <option value="poor">poor</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                value={editingListing.quantity}
                onChange={(e) =>
                  setEditingListing({
                    ...editingListing,
                    quantity: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="Quantity"
                className="border rounded px-3 py-2"
              />
              <input
                value={editingListing.location}
                onChange={(e) =>
                  setEditingListing({
                    ...editingListing,
                    location: e.target.value,
                  })
                }
                placeholder="Location"
                className="border rounded px-3 py-2"
              />
            </div>

            {}
            <div className="grid grid-cols-2 gap-4">
              <select
                value={editingListing.type}
                onChange={(e) =>
                  setEditingListing({ ...editingListing, type: e.target.value })
                }
                className="border rounded px-3 py-2"
              >
                <option value="School Supplies">School Supplies</option>
                <option value="Furniture">Furniture</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Misc">Misc</option>
              </select>
              <select
                value={editingListing.status}
                onChange={(e) =>
                  setEditingListing({
                    ...editingListing,
                    status: e.target.value,
                  })
                }
                className="border rounded px-3 py-2"
              >
                <option value="for sale">For Sale</option>
                <option value="sold">Sold</option>
              </select>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                onClick={closeEdit}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmEdit}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
