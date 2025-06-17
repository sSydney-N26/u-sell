//Listings page

"use client";

import Post from "@/components/Post";
import FilterButton from "@/components/FilterButton";
import Navigation from "@/components/Navigation";
import { useState, useEffect } from "react";
import UserListing from "@/utils/types/userListing";
import { CATEGORIES_MAP } from "@/utils/categories";
import { ThreeDot } from "react-loading-indicators";
import Link from "next/link";

interface ListingResponse {
  listings: UserListing[];
  totalPages: number;
}

export default function Listings() {
  const [currentFilter, setCurrentFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [listings, setListings] = useState<UserListing[]>([]);
  const [loading, setLoading] = useState(1);

  const handleFilterClick = (category: string) => {
    if (category === "All Listings") {
      setCurrentFilter("");
      setPage(1);
    } else {
      setCurrentFilter(category);
      setPage(1);
    }
  };

  const handleClickNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handleClickPrev = () => {
    if (page != 1) {
      setPage(page - 1);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  useEffect(() => {
    const fetchData = async () => {
      const start = Date.now();

      try {
        const listingResponse = await fetch(
          `/api/listings?page=${page}&category=${currentFilter}`,
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
        setTimeout(() => setLoading(0), wait);
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
      <div className="flex p-5 m-5 justify-between">
        {CATEGORIES_MAP.map((cat, index) => (
          <FilterButton
            key={index}
            category={cat.value}
            handleClick={() => handleFilterClick(cat.value)}
          />
        ))}
      </div>

      <ul className="grid grid-cols-3 gap-10 mt-10 mb-10 mx-10 my-10">
        {listings.map((l) => (
          <Link href={`/listings/${l.id}`} key={l.id}>
            <li
              className="rounded-2xl shadow-xl hover:shadow-yellow-200 shadow-amber-50
                        shadow-s overflow-hidden hover:shadow-lg transition hover:scale-105"
            >
              <Post
                imageUrl={l.image_storage_ref}
                title={l.title}
                description={l.description}
                price={l.price}
                sold={l.status == "sold"}
                category={l.type}
                postedBy={l.posted_by}
              />
            </li>
          </Link>
        ))}
      </ul>
      <div className="flex justify-center items-center space-x-5 m-10">
        <button
          className="px-5 py-2 w-30 bg-black rounded-xl text-white font-semibold disabled:opacity-60"
          disabled={page == 1}
          onClick={() => handleClickPrev()}
        >
          Previous
        </button>

        <span className="whitespace-nowrap">
          Page {page} of {totalPages}
        </span>

        <button
          className="px-5 py-2 w-30 bg-black rounded-xl text-white font-semibold disabled:opacity-60"
          disabled={page == totalPages}
          onClick={() => handleClickNext()}
        >
          Next
        </button>
      </div>
    </div>
  );
}
