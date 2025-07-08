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
  status: string; // "for sale" | "sold"
  image_storage_ref: string | null;
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"active" | "sold">("active");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userListings, setUserListings] = useState<DatabaseListing[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [editingListing, setEditingListing] = useState<DatabaseListing | null>(null);

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
        const userProfile = await fetch(`/api/firebase-user-sync?uid=${user.uid}`);
        if (!userProfile.ok) throw new Error("Failed to fetch user");
        setUserData(await userProfile.json());
        
        // Fetch user listings
        const listingsResponse = await fetch(`/api/user-listings?uid=${user.uid}`);
        if (!listingsResponse.ok) throw new Error("Failed to fetch listings");
        setUserListings(await listingsResponse.json());
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
    imageUrl: null,
    title: l.title,
    description: l.description,
    price: l.price,
    sold: l.status === "sold",
    category: l.type,
    postedBy: userData?.username ?? "Unknown",
  });

  const activeListings = userListings.filter((l) => l.status === "for sale");
  const soldListings = userListings.filter((l) => l.status === "sold");

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
      const res = await fetch(`/api/user-listings?uid=${user?.uid}&id=${pendingDeleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setUserListings((prev) => prev.filter((l) => l.id !== pendingDeleteId));
    } catch {
      alert("Error deleting listing");
    } finally {
      setDeletingId(null);
      setPendingDeleteId(null);
    }
  };

  const openEdit = (listing: DatabaseListing) => setEditingListing({ ...listing });
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
      setUserListings((prev) => prev.map((l) => (l.id === id ? editingListing : l)));
      closeEdit();
    } catch {
      alert("Error updating listing");
    }
  };

  const duplicateListing = async (id: number) => {
    if (!user?.uid) return;
    try {
      const res = await fetch(
        `/api/user-listings?uid=${user.uid}&duplicateId=${id}`,
        { method: "POST" }
      );
      if (!res.ok) throw new Error();
      const newListing = await res.json();

      setUserListings((prev) => [newListing, ...prev]);
    } catch {
      alert("Error duplicating listing");
    }
  };

  if (loading || isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-600">Loading profile…</p>
    </div>
  );
  if (error) return (
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
                Member since{' '}
                {userData && new Date(userData.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                })}
              </p>
            </div>

            {}
            <div className="flex space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {userListings.length}
                </div>
                <div className="text-sm text-gray-500">Total Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {activeListings.length}
                </div>
                <div className="text-sm text-gray-500">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {soldListings.length}
                </div>
                <div className="text-sm text-gray-500">Sold</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {}
        <div className="flex space-x-1 mb-8">
          <button onClick={() => setActiveTab("active")} className={`px-6 py-3 rounded-lg font-medium ${activeTab === "active" ? "bg-yellow-400 text-black" : "bg-white text-gray-600 hover:bg-gray-50"}`}>Active Listings ({activeListings.length})</button>
          <button onClick={() => setActiveTab("sold")} className={`px-6 py-3 rounded-lg font-medium ${activeTab === "sold" ? "bg-yellow-400 text-black" : "bg-white text-gray-600 hover:bg-gray-50"}`}>Sold Items ({soldListings.length})</button>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(activeTab === "active" ? activeListings : soldListings).map((listing) => (
            <div key={listing.id} className="bg-white rounded-lg shadow-sm overflow-hidden relative hover:shadow-md transition-shadow">
              <Post {...convert(listing)} />
              {activeTab === "active" && (
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button onClick={() => openEdit(listing)} className="px-2 py-1 rounded bg-blue-500 text-white text-xs font-semibold shadow hover:bg-blue-600">Edit</button>
                  <button onClick={() => openConfirm(listing.id)} disabled={deletingId === listing.id} className={`px-2 py-1 rounded bg-red-500 text-white text-xs font-semibold shadow hover:bg-red-600 ${deletingId === listing.id ? "opacity-60 cursor-not-allowed" : ""}`}>{deletingId === listing.id ? "Deleting…" : "Delete"}</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-4">Delete Listing?</h2>
            <p className="mb-6 text-gray-700">This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded font-semibold">Yes, Delete</button>
              <button onClick={closeConfirm} className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded font-semibold">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {}
      {editingListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full space-y-4">
            <h2 className="text-xl font-bold">Edit Listing</h2>

            <input value={editingListing.title} onChange={(e) => setEditingListing({ ...editingListing, title: e.target.value })} placeholder="Title" className="w-full border rounded px-3 py-2" />
            <textarea value={editingListing.description} onChange={(e) => setEditingListing({ ...editingListing, description: e.target.value })} placeholder="Description" className="w-full border rounded px-3 py-2" />

            <div className="grid grid-cols-2 gap-4">
              <input type="number" value={editingListing.price} onChange={(e) => setEditingListing({ ...editingListing, price: parseFloat(e.target.value) || 0 })} placeholder="Price" className="border rounded px-3 py-2" />
              <select
  value={editingListing.product_condition}
  onChange={(e) => setEditingListing({ ...editingListing, product_condition: e.target.value })}
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
              <input type="number" value={editingListing.quantity} onChange={(e) => setEditingListing({ ...editingListing, quantity: parseInt(e.target.value) || 0 })} placeholder="Quantity" className="border rounded px-3 py-2" />
              <input value={editingListing.location} onChange={(e) => setEditingListing({ ...editingListing, location: e.target.value })} placeholder="Location" className="border rounded px-3 py-2" />
            </div>

            {}
            <div className="grid grid-cols-2 gap-4">
              <select
  value={editingListing.type}
  onChange={(e) => setEditingListing({ ...editingListing, type: e.target.value })}
  className="border rounded px-3 py-2"
>
  <option value="School Supplies">School Supplies</option>
  <option value="Furniture">Furniture</option>
  <option value="Kitchen">Kitchen</option>
  <option value="Electronics">Electronics</option>
  <option value="Clothing">Clothing</option>
  <option value="Misc">Misc</option>
</select>
              <select value={editingListing.status} onChange={(e) => setEditingListing({ ...editingListing, status: e.target.value })} className="border rounded px-3 py-2">
                <option value="for sale">For Sale</option>
                <option value="sold">Sold</option>
              </select>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button onClick={closeEdit} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">Cancel</button>
              <button onClick={confirmEdit} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
