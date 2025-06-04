"use client";

import Post from "@/components/Post";
import { mockListings } from "@/utils/mocklistings";

export default function Listings() {
  //onst [currentFilter, setCurrentFilter] = useState("All Listings");

  const filteredListings = mockListings;

  return (
    <ul className="grid grid-cols-3 gap-10 mt-10 mb-10 mx-10 my-10">
      {filteredListings.map((listing, id) => (
        <li
          key={listing.id}
          className="rounded-2xl shadow-xl hover:shadow-pink-300
                    overflow-hidden hover:shadow-lg transition hover:scale-105"
        >
          <Post
            id={id}
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
  );
}
