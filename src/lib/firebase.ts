
import { initializeApp, getApps, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// WARNING: Firebase configuration is hardcoded here for debugging .env issues.
// This is NOT recommended for production.
// Ensure these values exactly match your Firebase project settings.
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyCEQvpnd6j-mKoISy80gjHmKvkM_WMBsGA",
  authDomain: "universe-z7j8u.firebaseapp.com",
  projectId: "universe-z7j8u",
  storageBucket: "universe-z7j8u.firebasestorage.app",
  messagingSenderId: "21422167469",
  appId: "1:21422167469:web:5f4adcc7702e1b1c703d24",
  measurementId: undefined, // Explicitly undefined if not used or empty
};

// Log the exact config being passed to Firebase
console.log("Attempting to initialize Firebase with HARDCODED config:", JSON.stringify(firebaseConfig, null, 2));

let app: FirebaseApp;
try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully with hardcoded config.");
  } else {
    app = getApps()[0];
    console.log("Firebase app already initialized (with potentially hardcoded config).");
  }
} catch (error) {
  console.error("CRITICAL ERROR during Firebase initialization:", error);
  // Re-throw the error to make it visible in the Next.js error overlay
  throw new Error(`Firebase initialization failed: ${(error as Error).message}`);
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };
