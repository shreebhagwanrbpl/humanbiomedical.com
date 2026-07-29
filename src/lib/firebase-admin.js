import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let adminDb = null;

try {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (projectId && clientEmail && privateKey) {
    const app =
      getApps().length === 0
        ? initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        })
        : getApps()[0];

    adminDb = getFirestore(app);
  } else {
    console.warn("Firebase Admin environment variables are missing.");
  }
} catch (err) {
  console.error("Firebase Admin Init Error:", err);
}

export { adminDb };