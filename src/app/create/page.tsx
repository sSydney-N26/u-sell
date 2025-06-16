'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateListingPage() {
  const router = useRouter();

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
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
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
            {formData.image_storage_ref ? "Image Selected ✔️" : "Upload Image"}
        </label>

        {/* TODO: Uploading into Firebase */}
        <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
                const filename = file.name;
                setFormData({ ...formData, image_storage_ref: `images/${filename}` });
                console.log("Selected file:", file);
            }
            }}
        />

        {/* Placeholder. Firebase setup is below () */}
        {formData.image_storage_ref && (
            <p className="text-sm mt-1 text-gray-700">
            Selected file: <span className="font-medium">{formData.image_storage_ref.split("/").pop()}</span>
            </p>
        )}

            {/* {formData.image_storage_ref && (
            <>
            <p className="text-sm mt-1 text-gray-700">
                File URL:{" "}
                <a
                href={formData.image_storage_ref}
                target="_blank"
                className="text-blue-600 underline"
                >
                {formData.image_storage_ref.split("/").pop()}
                </a>
            </p>
            <img
                src={formData.image_storage_ref}
                alt="Uploaded Preview"
                className="mt-2 w-32 h-32 object-cover rounded shadow"
            />
            </>
        )} */}
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
