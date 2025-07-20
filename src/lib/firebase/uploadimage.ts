import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./config";

export async function uploadImageToFirebase(file: File): Promise<string> {
  if (!file) return '';
  const storageRef = ref(storage, `images/${Date.now()}-${file.name}`);
  await uploadBytes(storageRef, file);

  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}
