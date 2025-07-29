// src/app/listings/[id]/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import ReportButton from '@/components/ReportButton';
import UserListing from '@/utils/types/userListing';

interface Tag {
  tag_id: number;
  tag_name: string;
}

interface ListingWithTags extends UserListing {
  tags: Tag[];
  view_count?: number;
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

  // Want to log view once
  useEffect(() => {
  if (!id || didLogView.current) return;

  didLogView.current = true;
  (async () => {
    try {
      const res = await fetch(`/api/listing/${id}/view`, { method: 'POST' });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const { view_count } = await res.json();
      setListing((prev) => (prev ? { ...prev, view_count } : prev));
    } catch (e) {
      console.error("Error logging view:", e);
    }
  })();
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

  const handleReportSuccess = (response?: {
    listingFlagged?: boolean;
    listingRemoved?: boolean;
  }) => {
    if (response?.listingFlagged) setListingFlagged(true);
    else if (response?.listingRemoved) setListingRemoved(true);
  };

  if (listingFlagged) {
    return (
      <>
        <Navigation />
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
      </>
    );
  }

  if (listingRemoved) {
    return (
      <>
        <Navigation />
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
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="p-8 max-w-2xl mx-auto text-center">
          <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading listing…</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navigation />
        <div className="p-8 max-w-2xl mx-auto text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            className="text-sm text-yellow-500 underline"
            onClick={() => router.push('/listings')}
          >
            ← Back to Listings
          </button>
        </div>
      </>
    );
  }

  if (!listing) return null;

  return (
    <>
      <Navigation />
      <div className="p-8 max-w-2xl mx-auto">
        {/* Links */}
        <div className="flex justify-between items-center mb-6">
          <button
            className="text-sm text-yellow-500 underline"
            onClick={() => router.push('/listings')}
          >
            ← Back to Listings
          </button>
          <ReportButton listingId={listing.id} onReportSuccess={handleReportSuccess} />
        </div>

        {/* Image */}
        {listing.image_storage_ref && (
          <div className="relative w-full h-80 mb-8 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={listing.image_storage_ref}
              alt={listing.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Title + Price */}
        <h1 className="text-4xl font-bold mb-2">{listing.title}</h1>
        <p className="text-2xl text-gray-800 font-semibold mb-8">
          ${listing.price}
        </p>

        {/* grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-8">
          <div>
            <p className="text-sm font-medium text-gray-600">Condition</p>
            <p className="text-lg">{listing.product_condition}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Category</p>
            <p className="text-lg">{listing.type}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Quantity</p>
            <p className="text-lg">{listing.quantity}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Location</p>
            <p className="text-lg">{listing.location}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Seller</p>
            <p className="text-lg">{listing.posted_by}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Status</p>
            <p className="text-lg capitalize">{listing.status}</p>
          </div>
        </div>

        {/* Description */}
        <section className="mb-8">
          <h2 className="text-lg font-medium mb-2">Description</h2>
          <p className="text-gray-700">{listing.description}</p>
        </section>

        {/* Tags */}
        {listing.tags.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm text-gray-500 mb-2">Tags</h2>
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
          </section>
        )}

        {/* View count */}
        {typeof listing.view_count === 'number' && (
          <p className="text-sm text-gray-500">
            Viewed {listing.view_count} times
          </p>
        )}

      </div>
    </>
  );
}
