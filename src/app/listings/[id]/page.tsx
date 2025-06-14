//Listing Detail page - full screen version of the listing
// 
'use client';

import { useParams, useRouter } from 'next/navigation';
import { mockListings } from '@/utils/mocklistings';

export default function ListingDetail() {
  const { id } = useParams();
  const router = useRouter();
  const listing = mockListings.find((l) => l.id === Number(id));

  if (!listing) return <p className="p-8">Listing not found.</p>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button
          className="mb-4 text-sm text-yellow-500 hover:text-yellow-600 underline"
          onClick={() => router.push('/listings')}
        >
          ← Back to Listings
        </button>
        <button
          className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300"
          onClick={() => router.push(`/listings/${listing.id}/edit`)}
        >
          Edit Listing
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-4">{listing.title}</h1>
      <p className="text-gray-600 mb-2">{listing.description}</p>
      <p className="text-lg font-semibold mb-4">${listing.price}</p>
      <p className="text-sm text-gray-500 mb-2">Category: {listing.category}</p>
      <p className="text-sm text-gray-500 mb-8">Sold: {listing.sold ? 'Yes' : 'No'}</p>
    </div>
  );
}
