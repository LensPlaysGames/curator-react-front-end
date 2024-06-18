import { cert, getApps, initializeApp, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "@/serviceAccount.json";

getApps().length === 0
  ? initializeApp(
    { credential: cert(serviceAccount as ServiceAccount) }
  )
  : getApps()[0];

export const db = getFirestore();
