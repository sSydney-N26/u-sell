'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateListingPage() {
  const router = useRouter();
  const [isImageUploading, setIsImageUploading] = useState(false);

  const [formData, setFormData] = useState({
    seller_id: 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', // TODO: Alice is the default seller id rn
    type: "Electronics", 
    price: 0,
    title: "",
    description: "",
    product_condition: "like new",  
    quantity: 1,
    location: "",
    posted_by: "Alice", // TODO: the current default is Alice username
    status: "for sale",
    image_storage_ref: "",
  });

    // TODO: Integrate with Firebase image upload in the future
    // const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //   const file = e.target.files?.[0];

    //   if (!file) {
    //     console.warn("No file selected.");
    //     return;
    //   }

    //   console.log("File received:", file);
    //   console.log("File type:", file.type);
    //   console.log("File size (bytes):", file.size);

    //   setIsImageUploading(true);

    //   try {
    //     const blob = file.slice(); // This is redundant in browsers but shown for debug
    //     console.log("Blob created from file:", blob);

        
    //     const url = await uploadImageToFirebase(blob as File); // ensure blob is a File-like object
    //     setFormData((prev) => ({ ...prev, image_storage_ref: url }));

    //     console.log("Image successfully uploaded to Firebase.");
    //     console.log("Download URL:", url);
    //   } catch (err) {
    //     console.error("Image upload failed:", err);
    //     alert("Image upload failed. See console for details.");
    //   } finally {
    //     setIsImageUploading(false);
    //     console.log("Upload process complete.");
    //   }
    // };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.location || !formData.posted_by || !formData.product_condition || !formData.type || isNaN(formData.price)) {
        alert("Please fill out all required fields.");
        return;
    }

    const res = await fetch("/api/createlistings", {
        
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await res.json();
    alert(result.message || "Submission failed");
    if (result.success) router.push("/");
  };

return (
  <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white flex items-center justify-center px-4">
    <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Create New Listing</h2>
        <p className="text-sm text-gray-600">Fill out the details below</p>
      </div>


      <div className="space-y-4">
        <input
          placeholder="Title"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-black"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

      {/* TODO: 'Received NaN for the `value` attribute. If this is expected, cast the value to a string.' Need to fix */}
        <input
          placeholder="Price"
          type="number"
          min="0.01"
          step="0.01"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-black"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
        />

        <textarea
          placeholder="Description"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-black"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />

        <input
          placeholder="Location"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-black"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />

        <input
          placeholder="Quantity"
          type="number"
          min="1"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-black"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
        />

        <div>
          <label
            htmlFor="file-upload"
            className="block w-full text-center cursor-pointer bg-yellow-400 text-black font-medium py-2 px-4 rounded-lg hover:bg-yellow-300"
          >
            {formData.image_storage_ref
              ? `Selected: ${formData.image_storage_ref.split('/').pop()}`
              : "Upload Image"}
          </label>

          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) {
                alert("No file selected.");
                return;
              }
              // Just show filename for now
              setFormData({ ...formData, image_storage_ref: `images/${Date.now()}-${file.name}` });
              console.log("File selected:", file.name);
            }}
          />
        </div>

        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-black"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        >
          <option value="Electronics">Electronics</option>
          <option value="Furniture">Furniture</option>
          <option value="Clothing">Clothing</option>
          <option value="Kitchen">Kitchen</option>
          <option value="School Supplies">School Supplies</option>
          <option value="Misc">Misc</option>
        </select>

        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-black"
          value={formData.product_condition}
          onChange={(e) => setFormData({ ...formData, product_condition: e.target.value })}
        >
          <option value="new">New</option>
          <option value="like new">Like New</option>
          <option value="gently used">Gently Used</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>
        </select>

        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-black"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="for sale">For Sale</option>
          <option value="pending">Pending</option>
          <option value="sold">Sold</option>
        </select>

        <button
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          onClick={handleSubmit}
        >
          Submit Listing
        </button>

        <button
          onClick={() => router.push("/")}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

}
