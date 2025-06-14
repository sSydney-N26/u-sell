//editing screen (dont acc save changes rn)

'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { mockListings } from '@/utils/mocklistings';
import { CATEGORIES } from '@/utils/categories';

export default function EditListing() {
  const { id } = useParams();
  const router = useRouter();

  const listing = mockListings.find((l) => l.id === Number(id));
  const [form, setForm] = useState({
    title: listing?.title || '',
    description: listing?.description || '',
    price: listing?.price || 0,
    category: listing?.category || '',
    sold: listing?.sold || false,
  });

  if (!listing) return <p className="p-8">Listing not found.</p>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'price'
          ? parseFloat(value)
          : name === 'sold'
          ? value === 'true'
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();


    listing.title = form.title;
    listing.description = form.description;
    listing.price = form.price;
    listing.category = form.category;
    listing.sold = form.sold;

    alert('Listing updated (fake need to implement sql queries for db)');
    router.push(`/listings/${listing.id}`);
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <button
        className="mb-4 text-sm text-yellow-500 hover:text-yellow-600 underline"
        onClick={() => router.push(`/listings/${listing.id}`)}
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-4">Edit Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            {CATEGORIES.filter((c) => c !== 'All Listings').map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Sold</label>
          <select
            name="sold"
            value={form.sold.toString()}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
