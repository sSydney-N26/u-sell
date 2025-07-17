"use client";

import { useState } from "react";
import { useAuth } from "@/lib/firebase/AuthContext";

interface ReportButtonProps {
  listingId: number;
  onReportSuccess?: (response?: any) => void;
}

const REPORT_REASONS = [
  { value: "inappropriate", label: "Inappropriate Content" },
  { value: "spam", label: "Spam" },
  { value: "fake", label: "Fake Listing" },
  { value: "offensive", label: "Offensive" },
  { value: "other", label: "Other" },
];

export default function ReportButton({ listingId, onReportSuccess }: ReportButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  const handleReport = async () => {
    if (!user) {
      setMessage("You must be logged in to report a listing");
      return;
    }

    if (!selectedReason) {
      setMessage("Please select a reason for reporting");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/report-listing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId,
          reporterId: user.uid,
          reason: selectedReason,
          description: description.trim() || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        if (data.listingFlagged || data.listingRemoved) {
          // If listing was flagged or removed, call the success callback with response data
          if (onReportSuccess) {
            onReportSuccess(data);
          }
        }
        // Close modal after a short delay
        setTimeout(() => {
          setIsModalOpen(false);
          setSelectedReason("");
          setDescription("");
          setMessage("");
        }, 2000);
      } else {
        setMessage(data.error || "Failed to submit report");
      }
    } catch (error) {
      setMessage("An error occurred while submitting the report");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null; // Don't show report button if user is not logged in
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-red-600 hover:text-red-800 text-sm font-medium underline"
      >
        Report Listing
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Report Listing</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for reporting:
              </label>
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a reason</option>
                {REPORT_REASONS.map((reason) => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional details (optional):
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide any additional details..."
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            {message && (
              <div className={`mb-4 p-2 rounded text-sm ${
                message.includes("successfully")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}>
                {message}
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedReason("");
                  setDescription("");
                  setMessage("");
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                disabled={isSubmitting || !selectedReason}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}