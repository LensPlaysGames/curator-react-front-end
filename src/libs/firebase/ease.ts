// Just a bunch of helpers to reduce code duplication, to make life
// easier. NOTE: These are UNCACHED calls. See "@/api" for cached calls to
// save cost.

import {
  firebaseDb
} from "@/libs/firebase/config"
import {
  collection,
  doc,
  getDocs,
  query,
  orderBy,
  limit
} from "@/libs/firebase/db";

export async function fetchPostsByUser(posterUserId: string, givenLimit: number = 10) {
  const postsRef = collection(firebaseDb, "Users", `${posterUserId}`, "Posts");
  const postsData = await getDocs(query(
    postsRef,
    orderBy("date", "desc"),
    limit(givenLimit)
  ));

  const posts = postsData.docs.map(doc => ({
    id: doc.id,
    posterUserId,
    ...doc.data(),
    date: doc.data().date.toDate() // convert Firebase Timestamp to JavaScript Date
  }))

  // Confidence check: sort by date, most recent first (descending)
  posts.sort((a, b) => (b.date - a.date));

  return posts;
}
