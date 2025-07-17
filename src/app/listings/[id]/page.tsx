//Listing Detail page - full screen version of the listing
//
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import ReportButton from '@/components/ReportButton';
import UserListing from '@/utils/types/userListing';

export default function ListingDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<UserListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listingRemoved, setListingRemoved] = useState(false);
  const [listingFlagged, setListingFlagged] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listing/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError("Listing not found");
          } else {
            setError("Failed to load listing");
          }
          return;
        }
        const data = await response.json();
        setListing(data);
      } catch {
        setError("Failed to load listing");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id]);

  const handleReportSuccess = (response?: { listingFlagged?: boolean; listingRemoved?: boolean }) => {
    // If listing was flagged, show a message instead of redirecting
    if (response?.listingFlagged) {
      setListingFlagged(true);
    } else if (response?.listingRemoved) {
      setListingRemoved(true);
    }
  };

  if (listingFlagged) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="text-center">
          <p className="text-orange-700 text-lg font-semibold mb-4">This listing has been flagged for admin review due to multiple reports. Thanks for helping us keep U Sell safe!</p>
          <button
            className="text-sm text-yellow-500 hover:text-yellow-600 underline"
            onClick={() => router.push('/listings')}
          >
            ← Back to Listings
          </button>
        </div>
      </div>
    );
  }

  if (listingRemoved) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="text-center">
          <p className="text-green-700 text-lg font-semibold mb-4">This listing has been removed due to multiple reports.</p>
          <button
            className="text-sm text-yellow-500 hover:text-yellow-600 underline"
            onClick={() => router.push('/listings')}
          >
            ← Back to Listings
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading listing...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Listing not found"}</p>
          <button
            className="text-sm text-yellow-500 hover:text-yellow-600 underline"
            onClick={() => router.push('/listings')}
          >
            ← Back to Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button
          className="mb-4 text-sm text-yellow-500 hover:text-yellow-600 underline"
          onClick={() => router.push('/listings')}
        >
          ← Back to Listings
        </button>
        <div className="flex space-x-2">
          <ReportButton
            listingId={listing.id}
            onReportSuccess={handleReportSuccess}
          />
        <button
          className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300"
          onClick={() => router.push(`/listings/${listing.id}/edit`)}
        >
          Edit Listing
        </button>
        </div>
      </div>

      <h1 className="text-4xl font-bold mb-4">{listing.title}</h1>
      <p className="text-gray-600 mb-2">{listing.description}</p>
      <p className="text-lg font-semibold mb-4">${listing.price}</p>
      <p className="text-sm text-gray-500 mb-2">Category: {listing.type}</p>
      <p className="text-sm text-gray-500 mb-8">Sold: {listing.status === 'sold' ? 'Yes' : 'No'}</p>
    </div>
  );
}
