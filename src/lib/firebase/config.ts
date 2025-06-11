import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAXFZuxJv2yCkzWifuoy0K74CoOndIymHk",
  authDomain: "u-sell-bde68.firebaseapp.com",
  projectId: "u-sell-bde68",
  storageBucket: "u-sell-bde68.firebasestorage.app",
  messagingSenderId: "984041524077",
  appId: "1:984041524077:web:22dd5f424e056ffa4aa864",
};

// Initialize Firebase
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { app, auth };
