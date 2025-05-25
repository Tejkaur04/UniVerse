
// src/lib/firebase.ts

// Firebase is not being initialized in this mock authentication setup.
// If you re-introduce Firebase later, you'll need to restore its initialization here.

console.log("Firebase Service Init: Firebase initialization is currently bypassed for mock authentication.");

// To prevent errors if other parts of the app accidentally try to import these,
// export them as null or undefined. Or, ensure no other files import them.
export const app = null;
export const auth = null;
export const db = null;
