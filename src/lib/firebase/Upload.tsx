import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase/config";

export default function UploadImage() {
  const [imageURL, setImageURL] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const blob = file.slice(); // or use directly
      const storagePath = `images/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, storagePath);

      await uploadBytes(storageRef, blob); // 👈 Upload Blob
      const url = await getDownloadURL(storageRef);

      setImageURL(url);
      console.log("Image uploaded:", url);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileUpload} />
      {uploading && <p>Uploading...</p>}
      {imageURL && (
        <>
          <p>Image uploaded: <a href={imageURL} target="_blank">{imageURL}</a></p>
          <img src={imageURL} alt="Uploaded" width={200} />
        </>
      )}
    </div>
  );
}
