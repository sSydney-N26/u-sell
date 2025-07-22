// src/app/listings/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import ReportButton from '@/components/ReportButton';
import UserListing from '@/utils/types/userListing';

interface Tag {
  tag_id: number;
  tag_name: string;
}

interface ListingWithTags extends UserListing {
  tags?: Tag[];
}

export default function ListingDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [listing, setListing] = useState<ListingWithTags | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listingRemoved, setListingRemoved] = useState(false);
  const [listingFlagged, setListingFlagged] = useState(false);

  const didLogView = useRef(false);

  useEffect(() => {
    if (!id || didLogView.current) return;

    fetch(`/api/listing/${id}/view`, { method: 'POST' })
      .catch((e) => console.error('Error logging view:', e));

    didLogView.current = true;
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await fetch(`/api/listing/${id}`);
        if (res.status === 404) {
          setError('Listing not found');
          return;
        }
        if (!res.ok) {
          throw new Error(`Status ${res.status}`);
        }
        const data = (await res.json()) as ListingWithTags;
        setListing(data);
      } catch (e) {
        console.error('Error loading listing:', e);
        setError('Failed to load listing');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleReportSuccess = (response?: { listingFlagged?: boolean; listingRemoved?: boolean }) => {
    if (response?.listingFlagged) setListingFlagged(true);
    else if (response?.listingRemoved) setListingRemoved(true);
  };

  if (listingFlagged) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center">
        <p className="text-orange-700 font-semibold mb-4">
          This listing has been flagged for admin review due to multiple reports.
        </p>
        <button
          className="text-sm text-yellow-500 underline"
          onClick={() => router.push('/listings')}
        >
          ← Back to Listings
        </button>
      </div>
    );
  }

  if (listingRemoved) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center">
        <p className="text-green-700 font-semibold mb-4">
          This listing has been removed due to multiple reports.
        </p>
        <button
          className="text-sm text-yellow-500 underline"
          onClick={() => router.push('/listings')}
        >
          ← Back to Listings
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center">
        <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading listing…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          className="text-sm text-yellow-500 underline"
          onClick={() => router.push('/listings')}
        >
          ← Back to Listings
        </button>
      </div>
    );
  }

  if (!listing) {
    return null;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button
          className="text-sm text-yellow-500 underline"
          onClick={() => router.push('/listings')}
        >
          ← Back to Listings
        </button>
        <ReportButton
          listingId={listing.id}
          onReportSuccess={handleReportSuccess}
        />
      </div>

      <h1 className="text-4xl font-bold mb-4">{listing.title}</h1>
      <p className="text-gray-600 mb-2">{listing.description}</p>
      <p className="text-lg font-semibold mb-4">${listing.price}</p>
      <p className="text-sm text-gray-500 mb-2">Category: {listing.type}</p>

      {/* Tags Display */}
      {listing.tags && listing.tags.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Tags:</p>
          <div className="flex flex-wrap gap-2">
            {listing.tags.map((tag) => (
              <span
                key={tag.tag_id}
                className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full border border-yellow-200"
              >
                {tag.tag_name}
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="text-sm text-gray-500 mb-8">
        Viewed {listing.view_count} times
      </p>
    </div>
  );
}
