
import { initializeApp, getApps, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Directly build the config object from environment variables
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || undefined, // Ensure undefined if empty
};

// List of required keys in the firebaseConfig object for Firebase to initialize correctly
const requiredConfigKeys: (keyof FirebaseOptions)[] = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

// Check if all required configuration values are present and are strings
for (const key of requiredConfigKeys) {
  const value = firebaseConfig[key as keyof FirebaseOptions]; // Type assertion
  if (typeof value !== 'string' || value.trim() === '') {
    const envVarName = `NEXT_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, "_$1").toUpperCase().replace('I_D', 'ID')}`; // Attempt to reconstruct env var name for error
    console.error(
      `Firebase configuration error: Value for '${key}' (from env variable ${envVarName}) is missing, not a string, or empty.`,
      `Actual value: ${value}`
    );
    throw new Error(
      `CRITICAL: Firebase configuration for '${key}' is invalid. ` +
      "Please ensure it is correctly set in your .env file at the project root, " +
      "that the value is not empty, and that you have RESTARTED your development server after any changes to .env."
    );
  }
}

// Log the exact config being passed to Firebase
console.log("Attempting to initialize Firebase with config:", JSON.stringify(firebaseConfig, null, 2));

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully.");
} else {
  app = getApps()[0];
  console.log("Firebase app already initialized.");
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };
