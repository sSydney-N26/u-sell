"use client";
import Link from "next/link";

import Navigation from "@/components/Navigation";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <div
        className="relative bg-gradient-to-r from-yellow-400 to-yellow-500 min-h-screen flex items-center"
        style={{ background: "linear-gradient(to right, #FED34C, #EAAB00)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-black sm:text-5xl md:text-6xl">
              <span className="block">Welcome to U-Sell</span>
              <span className="block text-gray-800">Your Marketplace Hub</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-800 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Buy and sell items in your community. Connect with local sellers
              and buyers in a safe, easy-to-use platform.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link href="/create">
                <button
                  className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-yellow-400 bg-black hover:bg-gray-800 md:py-4 md:text-lg md:px-10"
                  style={{ color: "#FED34C" }}
                >
                  Create Listing
                </button>
              </Link>
              <button
                className="px-8 py-3 border border-black text-base font-medium rounded-md text-black hover:bg-black hover:text-yellow-400 md:py-4 md:text-lg md:px-10"
                style={{ borderColor: "#000000", color: "#000000" }}
              >
                Browse Listings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
