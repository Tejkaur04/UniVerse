
// src/lib/firebase.ts
import { initializeApp, getApps, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Your web app's Firebase configuration, directly from your Firebase project settings.
// WARNING: Firebase configuration is hardcoded here for debugging .env issues.
// This is NOT recommended for production.
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyCEQvpnd6j-mKoISy80gjHmKvkM_WMBsGA",
  authDomain: "universe-z7j8u.firebaseapp.com",
  projectId: "universe-z7j8u",
  storageBucket: "universe-z7j8u.firebasestorage.app",
  messagingSenderId: "21422167469",
  appId: "1:21422167469:web:5f4adcc7702e1b1c703d24"
  // measurementId is optional and can be omitted if not used
};

// Log the exact config being passed to Firebase
console.log("Firebase Service Init: Attempting to initialize Firebase with HARDCODED config:", JSON.stringify(firebaseConfig, null, 2));

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    console.log("Firebase Service Init: Firebase App initialized successfully with hardcoded config.");
  } else {
    app = getApps()[0];
    console.log("Firebase Service Init: Firebase App already initialized (with potentially hardcoded config).");
  }

  try {
    auth = getAuth(app);
    console.log("Firebase Service Init: Firebase Auth service obtained successfully.");
  } catch (authError) {
    console.error("Firebase Service Init: CRITICAL ERROR obtaining Firebase Auth service:", authError);
    throw new Error(`Firebase Auth service initialization failed: ${(authError as Error).message}`);
  }

  try {
    db = getFirestore(app);
    console.log("Firebase Service Init: Firebase Firestore service obtained successfully.");
  } catch (firestoreError) {
    console.error("Firebase Service Init: CRITICAL ERROR obtaining Firebase Firestore service:", firestoreError);
    throw new Error(`Firebase Firestore service initialization failed: ${(firestoreError as Error).message}`);
  }

} catch (initializationError) {
  console.error("Firebase Service Init: CRITICAL ERROR during Firebase App initialization:", initializationError);
  // This error will halt further execution if the app itself cannot be initialized.
  throw new Error(`Firebase App initialization failed: ${(initializationError as Error).message}`);
}

export { app, auth, db };
