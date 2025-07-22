"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/lib/firebase/AuthContext";
import { useRouter } from "next/navigation";

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
  image_storage_ref: string;
  seller_id: string;
  seller_username: string;
  seller_email: string;
  report_count: number;
}

interface TagSuggestion {
  word: string;
  frequency: number;
  total_listings: number;
}

interface Tag {
  tag_id: number;
  tag_name: string;
  created_at: string;
  current_listings: number;
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [flaggedListings, setFlaggedListings] = useState<FlaggedListing[]>([]);
  const [tagSuggestions, setTagSuggestions] = useState<TagSuggestion[]>([]);
  const [existingTags, setExistingTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'flagged' | 'tags'>('flagged');
  const [processingTag, setProcessingTag] = useState<string | null>(null);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user?.uid) {
      fetchFlaggedListings();
      fetchTagSuggestions();
      fetchExistingTags();
    }
  }, [user?.uid]);

  const fetchFlaggedListings = async () => {
    try {
      const response = await fetch(`/api/admin/flagged-listings?uid=${user?.uid}`);
      if (!response.ok) {
        if (response.status === 403) {
          setError("Admin access required");
          return;
        }
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

  const fetchTagSuggestions = async () => {
    try {
      const response = await fetch(`/api/admin/tag-suggestions?uid=${user?.uid}`);
      if (response.ok) {
        const data = await response.json();
        setTagSuggestions(data.suggestions || []);
      } else if (response.status === 403) {
        setError("Admin access required");
      }
    } catch (err) {
      console.error("Error fetching tag suggestions:", err);
    }
  };

  const fetchExistingTags = async () => {
    try {
      const response = await fetch(`/api/admin/tags?uid=${user?.uid}`);
      if (response.ok) {
        const data = await response.json();
        setExistingTags(data.tags || []);
      } else if (response.status === 403) {
        setError("Admin access required");
      }
    } catch (err) {
      console.error("Error fetching existing tags:", err);
    }
  };

  const handleAction = async (listingId: number, action: 'approve' | 'remove') => {
    try {
      setProcessingId(listingId);
      const response = await fetch(`/api/admin/flagged-listings?uid=${user?.uid}`, {
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

  const handleCreateTag = async (tagName: string) => {
    try {
      setProcessingTag(tagName);
      const response = await fetch(`/api/admin/tag-suggestions?uid=${user?.uid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tagName }),
      });

      if (!response.ok) {
        throw new Error("Failed to create tag");
      }

      // Remove the suggestion and refresh existing tags
      setTagSuggestions(prev => prev.filter(suggestion => suggestion.word !== tagName));
      await fetchExistingTags();
      alert(`Tag "${tagName}" created successfully!`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setProcessingTag(null);
    }
  };

  const handleDeleteTag = async (tagId: number, tagName: string) => {
    if (!confirm(`Are you sure you want to delete the tag "${tagName}"? This will remove it from all listings.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/tags?uid=${user?.uid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tagId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete tag");
      }

      // Remove the tag from the list
      setExistingTags(prev => prev.filter(tag => tag.tag_id !== tagId));
      alert(`Tag "${tagName}" deleted successfully!`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unknown error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">Loading admin dashboard...</p>
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
            {error === "Admin access required" && (
              <p className="text-gray-600 mt-2">
                You don&apos;t have permission to access the admin dashboard.
              </p>
            )}
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
          <p className="text-gray-600 mt-2">Manage flagged listings and tags</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('flagged')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'flagged'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Flagged Listings ({flaggedListings.length})
            </button>
            <button
              onClick={() => setActiveTab('tags')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tags'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tag Management
            </button>
          </nav>
        </div>

        {/* Flagged Listings Tab */}
        {activeTab === 'flagged' && (
          <div>
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
        )}

        {/* Tag Management Tab */}
        {activeTab === 'tags' && (
          <div className="space-y-8">
            {/* Tag Suggestions */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tag Suggestions</h2>
              <p className="text-gray-600 mb-4">
                Common words found in listing titles that could become tags
              </p>
              {tagSuggestions.length === 0 ? (
                <p className="text-gray-500">No new tag suggestions available</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tagSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.word}
                      className="bg-white rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900 capitalize">
                          {suggestion.word}
                        </h3>
                        <button
                          onClick={() => handleCreateTag(suggestion.word)}
                          disabled={processingTag === suggestion.word}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingTag === suggestion.word ? "Creating..." : "Create Tag"}
                        </button>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Frequency: {suggestion.frequency} times</p>
                        <p>Total listings: {suggestion.total_listings}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Existing Tags */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Existing Tags</h2>
              {existingTags.length === 0 ? (
                <p className="text-gray-500">No tags created yet</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {existingTags.map((tag) => (
                    <div
                      key={tag.tag_id}
                      className="bg-white rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900 capitalize">
                          {tag.tag_name}
                        </h3>
                        <button
                          onClick={() => handleDeleteTag(tag.tag_id, tag.tag_name)}
                          className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Current listings: {tag.current_listings}</p>
                        <p>Created: {new Date(tag.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}