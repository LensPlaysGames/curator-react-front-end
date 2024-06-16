// Just a bunch of helpers to reduce code duplication, to make life
// easier.

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

// TODO: Make an API endpoint and then a function in "@/libs/api" that
// caches for 48 hours or something to majorly save on reading data that
// for the most part will never change.
export async function fetchUserData(uid: string) {
  const userDataRef = doc(firebaseDb, "Users", uid);
  const userDataSnap = await getDoc(userDataRef);
  if (!userDataSnap.exists()) {
    return { error: "404" };
  }
  return userDataSnap.data();
}
