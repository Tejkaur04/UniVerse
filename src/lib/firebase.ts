
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

let firebaseConfig: Record<string, string | undefined> = {};

if (typeof window !== 'undefined' || process.env.NODE_ENV === 'test') {
  // On client-side or test environment, directly use process.env
  firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
} else {
  // For server-side, ensure you handle env vars appropriately if needed
  // This setup primarily focuses on client-side accessible NEXT_PUBLIC_ vars
  firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
}


for (const varName of requiredEnvVars) {
  if (!firebaseConfig[varName.replace('NEXT_PUBLIC_FIREBASE_', '').toLowerCase().replace(/_([a-z])/g, g => g[1].toUpperCase())] && !firebaseConfig[varName.substring('NEXT_PUBLIC_'.length).toLowerCase()]) {
     // A bit of a convoluted check for different casing, simplified
     const simpleKey = varName === 'NEXT_PUBLIC_FIREBASE_API_KEY' ? 'apiKey' : varName.substring('NEXT_PUBLIC_FIREBASE_'.length).replace(/_([a-z])/g, (_match, letter) => letter.toUpperCase());
     if (!firebaseConfig[simpleKey as keyof typeof firebaseConfig]) {
        console.error(`Firebase configuration error: Environment variable ${varName} is missing or not loaded correctly.`);
        throw new Error(
          `CRITICAL: Firebase Environment variable ${varName} is missing. ` +
          "Please ensure it is correctly set in your .env file at the project root, " +
          "and that you have RESTARTED your development server after any changes to .env."
        );
     }
  }
}

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig as any); // Cast as any to bypass strict FirebaseOptions type checking here, assuming vars are correct
} else {
  app = getApps()[0];
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };
