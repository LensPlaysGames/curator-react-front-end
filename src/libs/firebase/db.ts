import { firebaseDb } from "./config"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  limit,
  query
} from "firebase/firestore";

// Re-exports
export { firebaseDb } from "./config";
export {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  limit,
  query,
  setDoc
} from "firebase/firestore";
