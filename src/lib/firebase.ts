
import { initializeApp, getApps, type FirebaseApp, type FirebaseOptions } from "firebase/app";
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

const firebaseConfigAttempt: Record<string, string | undefined> = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

for (const varName of requiredEnvVars) {
  // Using a slightly different way to access the key in firebaseConfigAttempt based on varName
  const keyMapping: { [key: string]: keyof typeof firebaseConfigAttempt } = {
    'NEXT_PUBLIC_FIREBASE_API_KEY': 'apiKey',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN': 'authDomain',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID': 'projectId',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET': 'storageBucket',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID': 'messagingSenderId',
    'NEXT_PUBLIC_FIREBASE_APP_ID': 'appId',
  };
  const configKey = keyMapping[varName];

  if (!firebaseConfigAttempt[configKey]) {
    console.error(`Firebase configuration error: Environment variable ${varName} (for config key ${configKey}) is missing or not loaded.`);
    throw new Error(
      `CRITICAL: Firebase Environment variable ${varName} is missing. ` +
      "Please ensure it is correctly set in your .env file at the project root, " +
      "and that you have RESTARTED your development server after any changes to .env."
    );
  }
}

// All required vars are present, so we can assert they are strings for FirebaseOptions
const firebaseConfig: FirebaseOptions = {
  apiKey: firebaseConfigAttempt.apiKey!,
  authDomain: firebaseConfigAttempt.authDomain!,
  projectId: firebaseConfigAttempt.projectId!,
  storageBucket: firebaseConfigAttempt.storageBucket!,
  messagingSenderId: firebaseConfigAttempt.messagingSenderId!,
  appId: firebaseConfigAttempt.appId!,
  measurementId: firebaseConfigAttempt.measurementId, // Still optional
};

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };
