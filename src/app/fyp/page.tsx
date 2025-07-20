"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase/AuthContext";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import Post from "@/components/Post";
import UserListing from "@/utils/types/userListing";

interface FYPListing extends UserListing {
  match_type: "category" | "keyword" | "both";
}
import Link from "next/link";
import { ThreeDot } from "react-loading-indicators";

interface FYPResponse {
  listings: FYPListing[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

interface UserPreferences {
  followedCategories: string[];
  followedKeywords: string[];
}

export default function FYPPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [listings, setListings] = useState<FYPListing[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>({
    followedCategories: [],
    followedKeywords: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Filter and sort states
  const [allListings, setAllListings] = useState<FYPListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<FYPListing[]>([]);
  const [filterType, setFilterType] = useState<"all" | "category" | "keyword">(
    "all"
  );
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "price_low" | "price_high"
  >("newest");

  // Apply filters and sorting
  const applyFiltersAndSort = (listingsToFilter: FYPListing[]) => {
    let filtered = [...listingsToFilter];

    // Apply filter
    if (filterType !== "all") {
      filtered = filtered.filter(
        (listing) =>
          listing.match_type === filterType || listing.match_type === "both"
      );
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return (
            new Date(a.posted_date).getTime() -
            new Date(b.posted_date).getTime()
          );
        case "price_low":
          return a.price - b.price;
        case "price_high":
          return b.price - a.price;
        case "newest":
        default:
          return (
            new Date(b.posted_date).getTime() -
            new Date(a.posted_date).getTime()
          );
      }
    });

    return filtered;
  };

  // Update filtered listings when filter/sort changes
  useEffect(() => {
    const filtered = applyFiltersAndSort(allListings);
    setFilteredListings(filtered);
  }, [filterType, sortBy, allListings]);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
    }
  }, [authLoading, user, router]);

  // Fetch user preferences
  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user) return;

      try {
        const response = await fetch(`/api/user-preferences?uid=${user.uid}`);
        if (response.ok) {
          const data = await response.json();
          setPreferences(data);
        }
      } catch (err) {
        console.error("Error fetching preferences:", err);
      }
    };

    fetchPreferences();
  }, [user]);

  // Fetch FYP listings
  useEffect(() => {
    const fetchListings = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const response = await fetch(
          `/api/fyp?uid=${user.uid}&limit=20&offset=0`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch personalized listings");
        }

        const data: FYPResponse = await response.json();
        setAllListings(data.listings);
        setListings(data.listings);
        setHasMore(data.pagination.hasMore);
        setPage(1);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user, preferences]); // Refetch when preferences change

  // Load more listings
  const loadMoreListings = async () => {
    if (!user || !hasMore || loadingMore) return;

    try {
      setLoadingMore(true);
      const response = await fetch(
        `/api/fyp?uid=${user.uid}&limit=20&offset=${page * 20}`
      );

      if (!response.ok) {
        throw new Error("Failed to load more listings");
      }

      const data: FYPResponse = await response.json();
      const newAllListings = [...allListings, ...data.listings];
      setAllListings(newAllListings);
      setListings((prev) => [...prev, ...data.listings]);
      setHasMore(data.pagination.hasMore);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Error loading more listings:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white space-x-5">
        <div className="text-center font-black text-3xl">Loading Your Feed</div>
        <ThreeDot color="#FFD54F" size="medium" text="" textColor="" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const hasPreferences =
    preferences.followedCategories.length > 0 ||
    preferences.followedKeywords.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">For You</h1>
          <p className="text-gray-600 mt-2">
            Personalized listings based on your interests
          </p>
        </div>

        {/* Preferences Summary */}
        {hasPreferences && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Your Interests
              </h3>
              <Link
                href="/fyp/preferences"
                className="bg-yellow-400 text-black px-4 py-2 rounded-md hover:bg-yellow-300 transition-colors font-medium text-sm"
              >
                ⚙️ Manage Preferences
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {preferences.followedCategories.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Followed Categories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {preferences.followedCategories.map((category) => (
                      <span
                        key={category}
                        className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {preferences.followedKeywords.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Followed Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {preferences.followedKeywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* No preferences message */}
        {!hasPreferences && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8 text-center">
            <div className="text-4xl mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Set up your preferences to get personalized recommendations
            </h3>
            <p className="text-gray-600 mb-6">
              Follow categories and keywords to see listings that match your
              interests
            </p>
            <Link
              href="/fyp/preferences"
              className="bg-yellow-400 text-black px-6 py-3 rounded-md hover:bg-yellow-300 transition-colors font-medium inline-block"
            >
              Get Started
            </Link>
          </div>
        )}

        {/* Filter and Sort Controls */}
        {hasPreferences && allListings.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Filter by:
                </label>
                <select
                  value={filterType}
                  onChange={(e) =>
                    setFilterType(
                      e.target.value as "all" | "category" | "keyword"
                    )
                  }
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="all">All Matches</option>
                  <option value="category">Category Matches</option>
                  <option value="keyword">Keyword Matches</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as
                        | "newest"
                        | "oldest"
                        | "price_low"
                        | "price_high"
                    )
                  }
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
              </div>

              <div className="text-sm text-gray-500 ml-auto">
                Showing {filteredListings.length} of {allListings.length}{" "}
                listings
              </div>
            </div>
          </div>
        )}

        {/* Listings Grid */}
        {(hasPreferences ? filteredListings : listings).length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {(hasPreferences ? filteredListings : listings).map((listing) => (
                <Link href={`/listings/${listing.id}`} key={listing.id}>
                  <div className="rounded-2xl shadow-xl hover:shadow-yellow-200 shadow-amber-50 overflow-hidden hover:shadow-lg transition hover:scale-105 relative">
                    {/* Match Type Badge */}
                    {"match_type" in listing && (
                      <div className="absolute top-2 left-2 z-10">
                        {listing.match_type === "category" && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                            📂 Category
                          </span>
                        )}
                        {listing.match_type === "keyword" && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                            🔍 Keyword
                          </span>
                        )}
                        {listing.match_type === "both" && (
                          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">
                            ⭐ Both
                          </span>
                        )}
                      </div>
                    )}
                    <Post
                      imageUrl={listing.image_storage_ref}
                      title={listing.title}
                      description={listing.description}
                      price={listing.price}
                      sold={listing.status === "sold"}
                      category={listing.type}
                      postedBy={listing.posted_by}
                    />
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center">
                <button
                  onClick={loadMoreListings}
                  disabled={loadingMore}
                  className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors font-medium disabled:opacity-60"
                >
                  {loadingMore ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        ) : hasPreferences ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {allListings.length > 0
                ? "No listings match your current filters"
                : "No listings match your preferences yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {allListings.length > 0
                ? "Try adjusting your filter and sort options above, or update your preferences"
                : "Try adjusting your followed categories or keywords, or check back later for new listings"}
            </p>
            <div className="flex gap-3 justify-center">
              {allListings.length > 0 && (
                <button
                  onClick={() => {
                    setFilterType("all");
                    setSortBy("newest");
                  }}
                  className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors font-medium"
                >
                  Clear Filters
                </button>
              )}
              <Link
                href="/fyp/preferences"
                className="bg-yellow-400 text-black px-6 py-3 rounded-md hover:bg-yellow-300 transition-colors font-medium inline-block"
              >
                Update Preferences
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
