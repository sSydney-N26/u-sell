"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/firebase/AuthContext";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-yellow-500">U-Sell</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-yellow-500 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/listings"
              className="text-gray-700 hover:text-yellow-500 transition-colors"
            >
              Browse
            </Link>
            <Link
              href="/fyp"
              className="text-gray-700 hover:text-yellow-500 transition-colors"
            >
              For You
            </Link>

            {user ? (
              <>
                <Link
                  href="/profile"
                  className="text-gray-700 hover:text-yellow-500 transition-colors"
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-yellow-500 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="bg-yellow-400 text-black px-4 py-2 rounded-md hover:bg-yellow-300 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-yellow-500 transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-yellow-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/listings"
                className="text-gray-700 hover:text-yellow-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse
              </Link>
              <Link
                href="/fyp"
                className="text-gray-700 hover:text-yellow-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                For You
              </Link>

              {user ? (
                <>
                  <Link
                    href="/profile"
                    className="text-gray-700 hover:text-yellow-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-700 hover:text-yellow-500 transition-colors text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/auth"
                  className="bg-yellow-400 text-black px-4 py-2 rounded-md hover:bg-yellow-300 transition-colors inline-block text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
