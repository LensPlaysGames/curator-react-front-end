import {
  collection,
  firebaseDb,
  getDocs,
  orderBy,
  query
} from "@/libs/firebase/db";

export async function GET(request: Request, { params }: { params: { userId: string }}) {
  const posterUserId = params.userId;

  const postsRef = collection(firebaseDb, "Users", posterUserId, "Posts");
  const postsQuery = query(postsRef, orderBy("date", "desc"));

  const postsData = await getDocs(postsQuery);
  const posts: Array<any> = [];
  postsData.forEach(doc => posts.push({
    id: doc.id,
    posterUserId,
    ...doc.data(),
    date: doc.data().date.toDate() // convert Firebase Timestamp to JavaScript Date
  }))

  // Sort by date, most recent first (descending)
  posts.sort((a, b) => (b.date - a.date));

  return Response.json({ posts });
}
