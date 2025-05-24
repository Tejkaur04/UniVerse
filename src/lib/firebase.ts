// Firebase initialization is temporarily removed to resolve configuration issues.
// To re-enable Firebase, you will need to:
// 1. Restore the Firebase SDK imports (initializeApp, getAuth).
// 2. Restore the firebaseConfig object with your project credentials (preferably from .env variables).
// 3. Ensure your .env file is correctly set up in the project root and
//    your development server is restarted after any .env changes.
// 4. Restore the app and auth exports.

// Example of what was here:
// import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
// import { getAuth, type Auth } from "firebase/auth";
//
// const requiredEnvVars = [
//   'NEXT_PUBLIC_FIREBASE_API_KEY',
//   'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
//   'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
//   'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
//   'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
//   'NEXT_PUBLIC_FIREBASE_APP_ID',
// ];
//
// for (const varName of requiredEnvVars) {
//   if (!process.env[varName]) {
//     console.error(`Firebase configuration error: Environment variable ${varName} is missing.`);
//     throw new Error(
//       `CRITICAL: Firebase Environment variable ${varName} is missing. ` +
//       "Please ensure it is correctly set in your .env file at the project root, " +
//       "and that you have RESTARTED your development server after any changes to .env."
//     );
//   }
// }
//
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
// };
//
// let app: FirebaseApp;
// if (!getApps().length) {
//   app = initializeApp(firebaseConfig);
// } else {
//   app = getApps()[0];
// }
//
// const auth: Auth = getAuth(app);
//
// export { app, auth };

export {}; // Ensures the file is treated as a module
