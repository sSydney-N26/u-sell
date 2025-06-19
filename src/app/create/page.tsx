'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateListingPage() {
  const router = useRouter();
  const [isImageUploading, setIsImageUploading] = useState(false);

  const [formData, setFormData] = useState({
    type: "Electronics", 
    price: 0,
    title: "",
    description: "",
    product_condition: "like new",  
    quantity: 1,
    location: "",
    posted_by: "uid_alice", // TODO
    status: "for sale",
    image_storage_ref: "",
  });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (!file) {
        console.warn("No file selected.");
        return;
      }

      console.log("File received:", file);
      console.log("File type:", file.type);
      console.log("File size (bytes):", file.size);

      setIsImageUploading(true);

      try {
        const blob = file.slice(); // This is redundant in browsers but shown for debug
        console.log("Blob created from file:", blob);

        const url = await uploadImageToFirebase(blob as File); // ensure blob is a File-like object
        setFormData((prev) => ({ ...prev, image_storage_ref: url }));

        console.log("Image successfully uploaded to Firebase.");
        console.log("Download URL:", url);
      } catch (err) {
        console.error("Image upload failed:", err);
        alert("Image upload failed. See console for details.");
      } finally {
        setIsImageUploading(false);
        console.log("Upload process complete.");
      }
    };



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
      <div className="max-w-xl mx-auto py-10 px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Create New Listing</h1>
          <button
            onClick={() => router.push("/")}
            className="text-white text-xl hover:text-gray-300"
            aria-label="Cancel and return home"
          >
            ✕
          </button>
      </div>

      <input
        placeholder="Title"
        className="w-full mb-3 p-2 border rounded bg-white text-black"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />

      <input
        placeholder="Price"
        className="w-full mb-3 p-2 border rounded bg-white text-black"
        type="number"
        min="0.01"
        step="0.01"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })
        }
      />

      <textarea
        placeholder="Description"
        className="w-full mb-3 p-2 border rounded bg-white text-black"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />

      <input
        placeholder="Location"
        className="w-full mb-3 p-2 border rounded bg-white text-black"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
      />

      <input
        placeholder="Quantity"
        className="w-full mb-3 p-2 border rounded bg-white text-black"  
        type="number"
        value={formData.quantity}
        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
      />

      <div className="mb-3">
        <label
          htmlFor="file-upload"
          className="block w-full text-center cursor-pointer bg-yellow-400 text-black font-medium py-2 px-4 rounded hover:bg-yellow-300"
        >
          {formData.image_storage_ref
            ? `Selected: ${formData.image_storage_ref.split('/').pop()}`
            : "Upload Image"}
        </label>

        <input // TODO: Upload into Firebase
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
            setFormData({ ...formData, image_storage_ref: `images/${Date.now()}-${file.name}`  });
            console.log("File selected:", file.name);
          }}
        />
      </div>
  
    <select
        className="w-full mb-3 p-2 border rounded bg-white text-black"
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
        className="w-full mb-3 p-2 border rounded bg-white text-black"
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
        className="w-full mb-3 p-2 border rounded bg-white text-black"
        value={formData.status}
        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
      >
        <option value="for sale">For Sale</option>
        <option value="pending">Pending</option>
        <option value="sold">Sold</option>
      </select>

      <button
        className="w-full py-2 bg-yellow-400 text-black rounded hover:bg-yellow-300"
        onClick={handleSubmit}
      >
        Submit Listing
      </button>
    </div>
  );
}
