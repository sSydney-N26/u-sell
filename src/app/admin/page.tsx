"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";

interface FlaggedListing {
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
  seller_id: string;
  seller_username: string;
  seller_email: string;
  report_count: number;
}

export default function AdminPage() {
  const [flaggedListings, setFlaggedListings] = useState<FlaggedListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    fetchFlaggedListings();
  }, []);

  const fetchFlaggedListings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/flagged-listings");
      if (!response.ok) {
        throw new Error("Failed to fetch flagged listings");
      }
      const data = await response.json();
      setFlaggedListings(data.flaggedListings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (listingId: number, action: 'approve' | 'remove') => {
    try {
      setProcessingId(listingId);
      const response = await fetch("/api/admin/flagged-listings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listingId, action }),
      });

      if (!response.ok) {
        throw new Error("Failed to process listing");
      }

      // Remove the listing from the list since it's no longer flagged
      setFlaggedListings(prev => prev.filter(listing => listing.id !== listingId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">Loading flagged listings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Review flagged listings</p>
        </div>

        {flaggedListings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No flagged listings to review</p>
          </div>
        ) : (
          <div className="space-y-6">
            {flaggedListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {listing.title}
                    </h3>
                    <p className="text-gray-600 mt-1">{listing.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      ${listing.price}
                    </p>
                    <p className="text-sm text-red-600 font-semibold">
                      {listing.report_count} reports
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Category:</span> {listing.type}
                  </div>
                  <div>
                    <span className="font-medium">Condition:</span> {listing.product_condition}
                  </div>
                  <div>
                    <span className="font-medium">Posted by:</span> {listing.seller_username}
                  </div>
                  <div>
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(listing.posted_date).toLocaleDateString()}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      <p>Seller: {listing.seller_username} ({listing.seller_email})</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAction(listing.id, 'approve')}
                        disabled={processingId === listing.id}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingId === listing.id ? "Processing..." : "Approve"}
                      </button>
                      <button
                        onClick={() => handleAction(listing.id, 'remove')}
                        disabled={processingId === listing.id}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingId === listing.id ? "Processing..." : "Remove"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}