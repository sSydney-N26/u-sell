'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase/AuthContext";
import { useRouter } from "next/navigation";
import { uploadImageToFirebase } from "@/lib/firebase/uploadimage"; // correct path

interface Tag {
  tag_id: number;
  tag_name: string;
}

export default function CreateListingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<{ uid: string; username: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) router.push("/auth");
  }, [loading, user, router]);

  useEffect(() => {
    if (user?.uid) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`/api/firebase-user-sync?uid=${user.uid}`);
          if (!response.ok) throw new Error("Failed to fetch user profile");
          const data = await response.json();
          setUserData(data);
        } catch (err) {
          console.error("User fetch error:", err);
        }
      };
      fetchUserData();
    }
  }, [user?.uid]);

  // Fetch available tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("/api/tags");
        if (response.ok) {
          const data = await response.json();
          setAvailableTags(data.tags || []);
        }
      } catch (err) {
        console.error("Error fetching tags:", err);
      }
    };
    fetchTags();
  }, []);

  // Default values
  const [formData, setFormData] = useState({
    seller_id: "",
    type: "Electronics",
    price: "",
    title: "",
    description: "",
    product_condition: "New",
    quantity: "",
    location: "",
    posted_by: "",
    status: "for sale",
    image_storage_ref: "",
  });

    useEffect(() => {
    if (userData) {
      setFormData((prev) => ({
        ...prev,
        seller_id: userData.uid,
        posted_by: userData.username,
      }));
    }
  }, [userData]);

    useEffect(() => {
      const categoryToImage: Record<string, string> = {
        Electronics: "/photos/electronics.jpg",
        Furniture: "/photos/furniture.jpg",
        Clothing: "/photos/clothing.jpg",
        Kitchen: "/photos/kitchen.jpg",
        "School Supplies": "/photos/schoolsupplies.jpg",
        Misc: "/photos/misc.jpg",
        Toys: "/photos/toys.jpg",
        Health: "/photos/health.jpg",
        Beauty: "/photos/beauty.jpg",
        "Video Games": "/photos/videogames.jpg",
        Sports: "/photos/sports.jpg",
        Arts: "/photos/arts.jpg",
      };

      setFormData((prev) => ({...prev, image_storage_ref: categoryToImage[prev.type]}));
  }, [formData.type]);


  //   // TODO: Integrate with Firebase image upload in the future
  //  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return alert("No file selected.");

  //   setIsImageUploading(true);
  //   try {
  //     const url = await uploadImageToFirebase(file);
  //     setFormData((prev) => ({
  //       ...prev,
  //       image_storage_ref: url,
  //     }));
  //     console.log("Image uploaded:", url);
  //   } catch (err) {
  //     console.error("Upload failed:", err);
  //     alert("Failed to upload image.");
  //   } finally {
  //     setIsImageUploading(false);
  //   }
  // };

  const handleTagToggle = (tagId: number) => {
    setSelectedTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else {
        if (prev.length >= 5) {
          alert("Maximum 5 tags allowed");
          return prev;
        }
        return [...prev, tagId];
      }
    });
  };

  const handleSubmit = async () => {
    const priceNumber = parseFloat(formData.price || "0");
    const quantity = parseFloat(formData.quantity || "1");

    if (!formData.title || !formData.description || !formData.location || !formData.posted_by || !formData.product_condition || !formData.type || isNaN(priceNumber ) || isNaN(quantity) ) {
        alert("Please fill out all required fields.");
        return;
    }

    const res = await fetch("/api/createlistings", {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        tags: selectedTags
      }),
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

            <input
              placeholder="Price"
              type="number"
              min="0.01"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-black"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}            
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
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
        />

        {/* Tags Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Tags (max 5) - {selectedTags.length}/5
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
            {availableTags.map((tag) => (
                                <button
                    key={tag.tag_id}
                    type="button"
                    onClick={() => handleTagToggle(tag.tag_id)}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                      selectedTags.includes(tag.tag_id)
                        ? 'bg-yellow-400 text-black border-yellow-500'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {tag.tag_name}
                  </button>
            ))}
          </div>
          {availableTags.length === 0 && (
            <p className="text-sm text-gray-500">No tags available</p>
          )}
        </div>

        {/* <div>
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
              onChange={handleImageUpload}
            />

          </div> */}

          {/* Testing purposes to showcase item */}
          {formData.image_storage_ref && (
            <img
              src={formData.image_storage_ref}
              alt="Category Image"
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
          )}

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
            <option value="Toys">Toys</option>
            <option value="Health">Health</option>
            <option value="Beauty">Beauty</option>
            <option value="Video Games">Video Games</option>
            <option value="Sports">Sports</option>
            <option value="Arts">Arts</option>
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
