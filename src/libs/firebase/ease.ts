// Just a bunch of helpers to reduce code duplication, to make life
// easier. NOTE: These are UNCACHED calls. See "@/api" for cached calls to
// save cost.

import {
  firebaseDb
} from "@/libs/firebase/config"
import {
  arrayRemove,
  arrayUnion,
  doc,
  setDoc,
} from "@/libs/firebase/db";

export async function trackUser(userId: string, trackedUserId: string, remove: boolean = false) {
  setDoc(doc(firebaseDb, "Users", `${userId}`), {
    tracked: remove
      ? arrayRemove(trackedUserId)
      : arrayUnion(trackedUserId),
  }, { merge: true });
  return true;
}
