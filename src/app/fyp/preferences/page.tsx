"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase/AuthContext";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import { FollowRows } from "@/app/api/user-following/route";
import { FollowSuggestion } from "@/app/api/user-following/route";

interface UserPreferences {
  followedCategories: string[];
  followedKeywords: string[];
}

interface ConfirmDialog {
  isOpen: boolean;
  type: "category" | "keyword";
  value: string;
}

export default function PreferencesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [preferences, setPreferences] = useState<UserPreferences>({
    followedCategories: [],
    followedKeywords: [],
  });
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  const [followedUsers, setFollowedUsers] = useState<FollowRows[]>([]);
  const [suggestedFollows, setSuggestedFollows] = useState<FollowSuggestion[]>(
    []
  );
  const [currentFollowPage, setCurrentFollowPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [newKeyword, setNewKeyword] = useState("");
  const [keywordError, setKeywordError] = useState("");

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog>({
    isOpen: false,
    type: "category",
    value: "",
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
    }
  }, [authLoading, user, router]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch user preferences and available categories in parallel
        const [preferencesResponse, categoriesResponse, followingResponse] =
          await Promise.all([
            fetch(`/api/user-preferences?uid=${user.uid}`),
            fetch("/api/categories"),
            fetch(`/api/user-following?uid=${user.uid}`),
          ]);

        if (preferencesResponse.ok) {
          const preferencesData = await preferencesResponse.json();
          setPreferences(preferencesData);
        }

        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setAvailableCategories(categoriesData.categories);
        }

        if (followingResponse.ok) {
          const followingData = await followingResponse.json();
          console.log(followingData);
          setFollowedUsers(followingData.followedUsers);
          setSuggestedFollows(followingData.allSuggestions);
        }
      } catch (err) {
        setError("Failed to load preferences");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Show success message temporarily
  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  // Add category
  const addCategory = async (category: string) => {
    if (!user) return;

    try {
      const response = await fetch("/api/user-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          type: "category",
          value: category,
        }),
      });

      if (response.ok) {
        setPreferences((prev) => ({
          ...prev,
          followedCategories: [...prev.followedCategories, category],
        }));
        showSuccess(`Following ${category}`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to follow category");
      }
    } catch (err) {
      setError("Failed to follow category");
      console.error("Error adding category:", err);
    }
  };

  // Add keyword
  const addKeyword = async () => {
    if (!user || !newKeyword.trim()) return;

    const keyword = newKeyword.trim();
    setKeywordError("");

    if (keyword.length > 20) {
      setKeywordError("Keyword must be 20 characters or less");
      return;
    }

    try {
      const response = await fetch("/api/user-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          type: "keyword",
          value: keyword,
        }),
      });

      if (response.ok) {
        setPreferences((prev) => ({
          ...prev,
          followedKeywords: [...prev.followedKeywords, keyword.toLowerCase()],
        }));
        setNewKeyword("");
        showSuccess(`Following "${keyword}"`);
      } else {
        const errorData = await response.json();
        setKeywordError(errorData.error || "Failed to follow keyword");
      }
    } catch (err) {
      setKeywordError("Failed to follow keyword");
      console.error("Error adding keyword:", err);
    }
  };

  // Open confirmation dialog
  const openConfirmDialog = (type: "category" | "keyword", value: string) => {
    setConfirmDialog({ isOpen: true, type, value });
  };

  // Close confirmation dialog
  const closeConfirmDialog = () => {
    setConfirmDialog({ isOpen: false, type: "category", value: "" });
  };

  // Confirm unfollow
  const confirmUnfollow = async () => {
    if (!user) return;

    const { type, value } = confirmDialog;

    try {
      const response = await fetch(
        `/api/user-preferences?uid=${
          user.uid
        }&type=${type}&value=${encodeURIComponent(value)}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        if (type === "category") {
          setPreferences((prev) => ({
            ...prev,
            followedCategories: prev.followedCategories.filter(
              (cat) => cat !== value
            ),
          }));
        } else {
          setPreferences((prev) => ({
            ...prev,
            followedKeywords: prev.followedKeywords.filter(
              (keyword) => keyword !== value
            ),
          }));
        }
        showSuccess(`Unfollowed ${value}`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || `Failed to unfollow ${type}`);
      }
    } catch (err) {
      setError(`Failed to unfollow ${type}`);
      console.error(`Error removing ${type}:`, err);
    } finally {
      closeConfirmDialog();
    }
  };

  const followUser = async (followee: string) => {
    if (!user) return;

    try {
      const response = await fetch("/api/user-following", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.uid,
          followee_id: followee,
        }),
      });

      if (response.ok) {
        const follow = suggestedFollows.find((user) => user.uid === followee);
        if (follow) {
          setFollowedUsers((prev) => [follow, ...prev]);
        }
        setSuggestedFollows((prev) =>
          prev.filter((user) => user.uid != followee)
        );
        showSuccess(`Now follows user`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to follow user");
      }
    } catch (error) {
      setError("Failed to follow user");
      console.error("Error following user:", error);
    }
  };

  const unfollowUser = async (
    followee_id: string,
    followee_username: string
  ) => {
    if (!user) return;

    try {
      const response = await fetch(
        `/api/user-following?uid=${user.uid}&followee_id=${followee_id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setFollowedUsers((prev) => prev.filter((u) => u.uid != followee_id));
        showSuccess(`Succesfully Unfollowed User ${followee_username}`);
      }
    } catch (error) {
      setError("Failed to Follow User");
      console.error("Error Unfollowing User: ", error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">Loading preferences...</p>
          </div>
        </div>
      </div>
    );
  }

  const unfollowedCategories = availableCategories.filter(
    (category) => !preferences.followedCategories.includes(category)
  );

  const itemsLimit = 4;
  const followingTotalPage = Math.ceil(followedUsers.length / itemsLimit);
  const currentPage = followedUsers.slice(
    (currentFollowPage - 1) * itemsLimit,
    currentFollowPage * itemsLimit
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Preferences</h1>
            <p className="text-gray-600 mt-2">
              Manage your followed categories and keywords for personalized
              recommendations
            </p>
          </div>

          <Link
            href="/fyp"
            className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors font-medium"
          >
            ← Back to Feed
          </Link>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
            <button
              onClick={() => setError(null)}
              className="float-right text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Categories Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Categories
            </h2>

            {/* Followed Categories */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-3">
                Currently Following ({preferences.followedCategories.length})
              </h3>
              {preferences.followedCategories.length > 0 ? (
                <div className="space-y-2">
                  {preferences.followedCategories.map((category) => (
                    <div
                      key={category}
                      className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-md px-3 py-2"
                    >
                      <span className="text-yellow-800 font-medium">
                        {category}
                      </span>
                      <button
                        onClick={() => openConfirmDialog("category", category)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Unfollow
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  No categories followed yet
                </p>
              )}
            </div>

            {/* Available Categories */}
            <div>
              <h3 className="font-medium text-gray-700 mb-3">
                Available Categories
              </h3>
              {unfollowedCategories.length > 0 ? (
                <div className="space-y-2">
                  {unfollowedCategories.map((category) => (
                    <div
                      key={category}
                      className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md px-3 py-2"
                    >
                      <span className="text-gray-700">{category}</span>
                      <button
                        onClick={() => addCategory(category)}
                        className="bg-yellow-400 text-black px-3 py-1 rounded text-sm font-medium hover:bg-yellow-300 transition-colors"
                      >
                        Follow
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  All categories are being followed
                </p>
              )}
            </div>
          </div>

          {/* Keywords Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Keywords
            </h2>

            {/* Add New Keyword */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-3">
                Add New Keyword
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="e.g., headphones, nike, textbook..."
                  maxLength={20}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  onKeyPress={(e) => e.key === "Enter" && addKeyword()}
                />
                <button
                  onClick={addKeyword}
                  disabled={!newKeyword.trim()}
                  className="bg-yellow-400 text-black px-4 py-2 rounded-md font-medium hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
              {keywordError && (
                <p className="text-red-600 text-sm mt-1">{keywordError}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                {newKeyword.length}/20 characters
              </p>
            </div>

            {/* Followed Keywords */}
            <div>
              <h3 className="font-medium text-gray-700 mb-3">
                Currently Following ({preferences.followedKeywords.length})
              </h3>
              {preferences.followedKeywords.length > 0 ? (
                <div className="space-y-2">
                  {preferences.followedKeywords.map((keyword) => (
                    <div
                      key={keyword}
                      className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-md px-3 py-2"
                    >
                      <span className="text-blue-800 font-medium">
                        {keyword}
                      </span>
                      <button
                        onClick={() => openConfirmDialog("keyword", keyword)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Unfollow
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  No keywords followed yet
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Users Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 my-6 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Following
          </h2>

          {/* Follow New Users */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-4">
              Currently Following {followedUsers.length} Users
            </h3>
            {followedUsers.length > 0 ? (
              <div className="space-y-2">
                {currentPage.map((user) => (
                  <div
                    key={user.uid}
                    className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-md px-3 py-2"
                  >
                    <div className="space-y-3">
                      <p className="text-gray-900 font-semibold text-lg">
                        {" "}
                        {user.username}{" "}
                      </p>
                      <p className="text-gray-600 text-sm"> {user.email} </p>
                      <p className="text-gray-600 text-sm">
                        {user.program} - Year {user.year}
                      </p>
                    </div>
                    <button
                      onClick={() => unfollowUser(user.uid, user.username)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Unfollow
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No Users Followed Yet</p>
            )}
          </div>

          {followingTotalPage > 1 && (
            <div className="flex justify-between my-6">
              <button
                className="px-4 py-2 bg-yellow-500 rounded-md"
                onClick={() => setCurrentFollowPage((p) => Math.max(1, p - 1))}
                disabled={currentFollowPage === 1}
              >
                Previous
              </button>
              <button
                className="px-4 py-2 bg-yellow-500 rounded-md"
                onClick={() =>
                  setCurrentFollowPage((p) =>
                    Math.min(followingTotalPage, p + 1)
                  )
                }
                disabled={currentFollowPage === followingTotalPage}
              >
                Next
              </button>
            </div>
          )}

          {/* Suggested Users to Follow */}
          <div>
            <h3 className="font-medium text-gray-700 my-5">
              Suggested Users to Follow
            </h3>
            <div className="space-y-2">
              {suggestedFollows.map((user) => (
                <div
                  key={user.username}
                  className="flex items-center justify-between bg-yellow-50  border border-gray-200 rounded-md px-3 py-2"
                >
                  <div className="space-y-3">
                    <p className="text-gray-900 font-semibold text-lg">
                      {user.username}
                    </p>
                    <p className="text-gray-600 text-sm"> {user.email} </p>
                    <p className="text-gray-600 text-sm">
                      {user.program} - Year {user.year}
                    </p>
                  </div>
                  <button
                    onClick={() => followUser(user.uid)}
                    className="bg-yellow-400 text-black px-3 py-1 rounded text-sm font-medium hover:bg-yellow-300 transition-colors"
                  >
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Unfollow
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to unfollow &quot;{confirmDialog.value}
              &quot;? You will no longer see listings related to this{" "}
              {confirmDialog.type}.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeConfirmDialog}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmUnfollow}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Unfollow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
