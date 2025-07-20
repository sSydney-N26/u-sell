// src/app/listings/page.tsx



"use client";

import Post from "@/components/Post";
import FilterButton from "@/components/FilterButton";
import Navigation from "@/components/Navigation";
import { useState, useEffect } from "react";
import UserListing from "@/utils/types/userListing";
import { CATEGORIES_MAP } from "@/utils/categories";
import { ThreeDot } from "react-loading-indicators";
import Link from "next/link";
const MOST_VIEWED_LABEL = "Top 10 Most Viewed";
interface ListingResponse {
  listings: UserListing[];
  totalPages: number;
}

export default function Listings() {
  const [currentFilter, setCurrentFilter] = useState("all");
  const [page, setPage]                   = useState(1);
  const [totalPages, setTotalPages]       = useState(1);
  const [listings, setListings]           = useState<UserListing[]>([]);
  const [loading, setLoading]             = useState(true);

  const handleFilterClick = (category: string) => {
    setCurrentFilter(category === "All Listings" ? "" : category);
    setPage(1);
  };

  const handleClickNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleClickPrev = () => {
    if (page > 1) setPage(page - 1);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      if (currentFilter === MOST_VIEWED_LABEL) {
        try {
          const res = await fetch("/api/listing/most-viewed");
          if (!res.ok) throw new Error("Failed to fetch most-viewed");
          const data = (await res.json()) as UserListing[];
          setListings(data);
          setTotalPages(1);
        } catch (err) {
          console.error("Error fetching most-viewed:", err);
        } finally {
          setLoading(false);
        }
        return;
      }

      const start = Date.now();
      try {
        const listingResponse = await fetch(
          `/api/createlistings?page=${page}&category=${currentFilter}`,
          { next: { revalidate: 0 } }
        );
        if (!listingResponse.ok) {
          throw new Error("Failed to fetch listings");
        }
        const data = (await listingResponse.json()) as ListingResponse;
        setTotalPages(data.totalPages);
        setListings(data.listings);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        const elapsed = Date.now() - start;
        const wait = Math.max(0, 1500 - elapsed);
        setTimeout(() => setLoading(false), wait);
      }
    };

    fetchData();
  }, [page, currentFilter]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white space-x-5">
        <div className="text-center font-black text-3xl">Loading Listings</div>
        <ThreeDot color="#FFD54F" size="medium" text="" textColor="" />
      </div>
    );
  }

  return (
    <div>
      <Navigation />

      {/* Filter buttons + Top 10 Most Viewed button */}
      <div className="flex p-5 m-5 justify-between">
        <FilterButton
          key="most-viewed"
          category={MOST_VIEWED_LABEL}
          handleClick={() => handleFilterClick(MOST_VIEWED_LABEL)}
        />
        {CATEGORIES_MAP.map((cat, idx) => (
          <FilterButton
            key={idx}
            category={cat.value}
            handleClick={() => handleFilterClick(cat.value)}
          />
        ))}
      </div>

      {/*grid */}
      <ul className="grid grid-cols-3 gap-10 mt-10 mb-10 mx-10 my-10">
        {listings.map((l) => {
          // Image storage ref is undefined
          const fallbackImage = `/photos/${l.type.toLowerCase().replace(/\s/g, "")}.jpg`;

          return (
            <Link href={`/listings/${l.id}`} key={l.id}>
              <li className="rounded-2xl shadow-xl hover:shadow-yellow-200 shadow-amber-50 overflow-hidden hover:shadow-lg transition hover:scale-105">
                <Post
                  imageUrl={l.image_storage_ref || fallbackImage}
                  title={l.title}
                  description={l.description}
                  price={l.price}
                  sold={l.status === "sold"}
                  category={
                    currentFilter === MOST_VIEWED_LABEL
                      ? `Views: ${l.view_count}`
                      : l.type
                  }
                  postedBy={l.posted_by}
                />
              </li>
            </Link>
          );
        })}

      </ul>

      {/* Pagination*/}
      {currentFilter !== "Most Viewed" && (
        <div className="flex justify-center items-center space-x-5 m-10">
          <button
            className="px-5 py-2 w-30 bg-black rounded-xl text-white font-semibold disabled:opacity-60"
            disabled={page === 1}
            onClick={handleClickPrev}
          >
            Previous
          </button>
          <span className="whitespace-nowrap">
            Page {page} of {totalPages}
          </span>
          <button
            className="px-5 py-2 w-30 bg-black rounded-xl text-white font-semibold disabled:opacity-60"
            disabled={page === totalPages}
            onClick={handleClickNext}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
