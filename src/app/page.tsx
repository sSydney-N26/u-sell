"use client";

import Navigation from "@/components/Navigation";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <div
        className="relative bg-gradient-to-r from-yellow-400 to-yellow-500"
        style={{ background: "linear-gradient(to right, #FED34C, #EAAB00)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
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
              <button
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-yellow-400 bg-black hover:bg-gray-800 md:py-4 md:text-lg md:px-10"
                style={{ color: "#FED34C" }}
              >
                Create Listing
              </button>
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

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
          Popular Categories
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category.name}
              className="group relative rounded-lg overflow-hidden bg-gray-100 hover:bg-yellow-50 transition-all duration-200"
            >
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                <div className="p-6 text-center">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {category.count} listings
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Listings Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            Featured Listings
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  {/* Add image here when available */}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {listing.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {listing.description}
                  </p>
                  <div className="mt-4">
                    <span
                      className="text-lg font-bold"
                      style={{ color: "#EAAB00" }}
                    >
                      ${listing.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to start selling?
            </h2>
            <p className="mt-4 text-lg" style={{ color: "#FED34C" }}>
              Join our community of buyers and sellers today.
            </p>
            <div className="mt-8">
              <button
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-black bg-yellow-400 hover:bg-yellow-300 md:py-4 md:text-lg md:px-10"
                style={{ backgroundColor: "#FED34C", color: "#000000" }}
              >
                Create Your First Listing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sample data
const categories = [
  { name: "Electronics", icon: "📱", count: 156 },
  { name: "Furniture", icon: "🪑", count: 89 },
  { name: "Clothing", icon: "👕", count: 234 },
  { name: "Books", icon: "📚", count: 67 },
  { name: "Sports", icon: "⚽", count: 45 },
  { name: "Toys", icon: "🎮", count: 78 },
  { name: "Home", icon: "🏠", count: 123 },
  { name: "Other", icon: "📦", count: 90 },
];

const featuredListings = [
  {
    id: 1,
    title: "iPhone 13 Pro Max",
    description: "Like new condition, comes with original box and accessories",
    price: 899,
  },
  {
    id: 2,
    title: "Modern Sofa Set",
    description: "3-piece sofa set in excellent condition",
    price: 599,
  },
  {
    id: 3,
    title: "Gaming Laptop",
    description: "High-performance gaming laptop with RTX 3080",
    price: 1299,
  },
];
