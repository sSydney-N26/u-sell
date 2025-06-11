"use client";

import Post from "@/components/Post";
import FilterButton from "@/components/FilterButton";
import { useState } from "react";
import { mockListings } from "@/utils/mocklistings";
import { CATEGORIES_MAP } from "@/utils/categories";

export default function Listings() {
  const [currentFilter, setCurrentFilter] = useState("All Listings");

  const filteredListings =
    currentFilter === "All Listings"
      ? mockListings
      : mockListings.filter((curr) => curr.category === currentFilter);

  const handleClick = (category: string) => {
    setCurrentFilter(category);
  };

  return (
    <div>
      <div className="flex p-5 m-5 justify-between">
        {CATEGORIES_MAP.map((cat, index) => (
          <FilterButton
            key={index}
            category={cat.value}
            handleClick={() => handleClick(cat.value)}
          />
        ))}
      </div>

      <ul className="grid grid-cols-3 gap-10 mt-10 mb-10 mx-10 my-10">
        {filteredListings.map((listing, id) => (
          <li
            key={`${listing.title}-${id}-${listing.title}`}
            className="rounded-2xl shadow-xl hover:shadow-yellow-200 shadow-amber-50
                      shadow-s overflow-hidden hover:shadow-lg transition hover:scale-105"
          >
            <Post
              imageUrl={listing.imageUrl}
              title={listing.title}
              description={listing.description}
              price={listing.price}
              sold={listing.sold}
              category={listing.category}
              postedBy={listing.postedBy}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
