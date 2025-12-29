import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCHOwwaKTQS9SirgnvI8vm5D5j2XPbdUzE",
  authDomain: "simply-notify-68b52.firebaseapp.com",
  databaseURL: "https://simply-notify-68b52.firebaseio.com",
  projectId: "simply-notify-68b52",
  storageBucket: "simply-notify-68b52.firebasestorage.app",
  messagingSenderId: "838544611655",
  appId: "1:838544611655:web:ac89b5c2177b35eb8b1462",
  measurementId: "G-X58YBQG1EB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics (optional, only in browser)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
