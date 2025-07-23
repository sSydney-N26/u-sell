"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/lib/firebase/AuthContext";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import Post from "@/components/Post";
import Link from "next/link";
import { ThreeDot } from "react-loading-indicators";
import { FollowRows } from "@/app/api/user-following/route";

interface FYPListing {
  id: number;
  seller_id: string;
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
  match_type: string;
}

interface FYPResponse {
  listings: FYPListing[];
}

interface UserPreferences {
  followedCategories: string[];
  followedKeywords: string[];
  followedTags: { tag_id: number; tag_name: string }[];
}

export default function FYPPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [preferences, setPreferences] = useState<UserPreferences>({
    followedCategories: [],
    followedKeywords: [],
    followedTags: [],
  });

  // Filter and sort states
  const [followedUsers, setFollowedUsers] = useState<FollowRows[]>([]);
  const [allListings, setAllListings] = useState<FYPListing[]>([]);

  const [filterType, setFilterType] = useState<
    "all" | "category" | "keyword" | "tag" | "user"
  >("all");
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "price_low" | "price_high"
  >("newest");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemsShowing, setItemsShowing] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch FYP listings
  useEffect(() => {
    const fetchListings = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/fyp?uid=${user.uid}`);

        if (!response.ok) {
          throw new Error("Failed to fetch personalized listings");
        }
        const data: FYPResponse = await response.json();
        setAllListings(data.listings);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user]);

  // Apply filters and sorting
  const applyFiltersAndSort = useCallback(
    (listingsToFilter: FYPListing[]) => {
      let filtered = [...listingsToFilter];

      // Apply filter
      if (filterType !== "all") {
        if (filterType === "user") {
          filtered = filtered.filter(
            (listing) => listing.match_type === "user"
          );
        } else if (filterType === "tag") {
          filtered = filtered.filter(
            (listing) =>
              listing.match_type === "tag" ||
              listing.match_type === "category_tag" ||
              listing.match_type === "keyword_tag" ||
              listing.match_type === "all"
          );
        } else {
          filtered = filtered.filter(
            (listing) =>
              listing.match_type === filterType ||
              listing.match_type === "category_keyword" ||
              listing.match_type === "category_tag" ||
              listing.match_type === "keyword_tag" ||
              listing.match_type === "all"
          );
        }
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
    },
    [filterType, sortBy]
  );

  const filteredListings = useMemo(
    () => applyFiltersAndSort(allListings),
    [allListings, applyFiltersAndSort]
  );

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

  useEffect(() => {
    setItemsShowing(20);
  }, [filteredListings]);

  // Fetch user following
  useEffect(() => {
    const fetchFollowUsers = async () => {
      if (!user) return;

      try {
        const response = await fetch(`/api/user-following?uid=${user.uid}`);
        if (response.ok) {
          const data = await response.json();
          setFollowedUsers(data.followedUsers);
        }
      } catch (err) {
        console.error("Error fetching preferences:", err);
      }
    };

    fetchFollowUsers();
  }, [user]);

  const currDisplayListings = useMemo(
    () => filteredListings.slice(0, itemsShowing),
    [filteredListings, itemsShowing]
  );

  const hasMore = itemsShowing < filteredListings.length;
  // Load more listings
  const loadMoreListings = async () => {
    if (!user || !hasMore || loadingMore) return;

    try {
      setLoadingMore(true);
      setItemsShowing((prev) => Math.min(prev + 20, filteredListings.length));
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
    preferences.followedKeywords.length > 0 ||
    preferences.followedTags.length > 0 ||
    followedUsers.length > 0;

  console.log(filteredListings);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">For You</h1>
            <p className="text-gray-600 mt-2">
              Personalized listings based on your preferences
            </p>
          </div>

          <Link
            href="/fyp/preferences"
            className="bg-yellow-400 text-black px-6 py-3 rounded-md hover:bg-yellow-300 transition-colors font-medium"
          >
            Manage Preferences
          </Link>
        </div>

        {/* Current Preferences Display */}
        {hasPreferences && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your Current Preferences
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

              {preferences.followedTags.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Followed Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {preferences.followedTags.map((tag) => (
                      <span
                        key={tag.tag_id}
                        className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                      >
                        {tag.tag_name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {followedUsers.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Followed Users
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {followedUsers.map((user) => (
                      <span
                        key={user.uid}
                        className="px-3 py-1 bg-pink-100 text-gray-700 text-sm rounded-full"
                      >
                        {user.username}
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
              Follow categories, keywords, tags, and users to see listings that
              match your interests
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Filter Controls */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 self-center">
                Filter:
              </span>
              {["all", "category", "keyword", "tag", "user"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterType(filter as typeof filterType)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filterType === filter
                      ? "bg-yellow-400 text-black"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter === "all"
                    ? "All"
                    : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>

            {/* Sort Controls */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 self-center">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {currDisplayListings.length} of {filteredListings.length}{" "}
            personalized listings
            {filterType !== "all" && (
              <span className="font-medium"> filtered by {filterType}</span>
            )}
          </p>
        </div>

        {/* Listings Grid */}
        {currDisplayListings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {currDisplayListings.map((listing) => (
                <Link href={`/listings/${listing.id}`} key={listing.id}>
                  <div className="relative rounded-2xl shadow-xl hover:shadow-yellow-200 shadow-amber-50 overflow-hidden hover:shadow-lg transition hover:scale-105 cursor-pointer">
                    <Post
                      imageUrl={listing.image_storage_ref}
                      title={listing.title}
                      description={listing.description}
                      price={listing.price}
                      sold={listing.status === "sold"}
                      category={listing.type}
                      postedBy={listing.posted_by}
                      listingId={listing.id}
                    />
                    {/* Match Type Badge */}
                    <div className="absolute top-2 right-2 z-10">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          listing.match_type === "user"
                            ? "bg-pink-100 text-pink-800"
                            : listing.match_type === "category"
                            ? "bg-yellow-100 text-yellow-800"
                            : listing.match_type === "keyword"
                            ? "bg-blue-100 text-blue-800"
                            : listing.match_type === "tag"
                            ? "bg-green-100 text-green-800"
                            : listing.match_type === "all"
                            ? "bg-purple-100 text-purple-800"
                            : listing.match_type === "category_keyword"
                            ? "bg-orange-100 text-orange-800"
                            : listing.match_type === "category_tag"
                            ? "bg-teal-100 text-teal-800"
                            : listing.match_type === "keyword_tag"
                            ? "bg-indigo-100 text-indigo-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {listing.match_type === "all"
                          ? "Perfect Match"
                          : listing.match_type === "category_keyword"
                          ? "Category + Keyword"
                          : listing.match_type === "category_tag"
                          ? "Category + Tag"
                          : listing.match_type === "keyword_tag"
                          ? "Keyword + Tag"
                          : listing.match_type.charAt(0).toUpperCase() +
                            listing.match_type.slice(1)}
                      </span>
                    </div>
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
                  className="bg-yellow-400 text-black px-8 py-3 rounded-md hover:bg-yellow-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No matching listings found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or{" "}
              <Link
                href="/fyp/preferences"
                className="text-yellow-600 hover:text-yellow-500 font-medium"
              >
                updating your preferences
              </Link>{" "}
              to see more listings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
