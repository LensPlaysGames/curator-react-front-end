import { db } from "@/libs/firebase/admin";

export async function GET(request: Request, { params }: { params: { userId: string }}) {
  const posterUserId = params.userId;

  const postsRef = db.collection("Users").doc(`${posterUserId}`).collection("Posts");
  const postsQuery = postsRef.orderBy("date", "desc");

  const postsData = await postsQuery.get();
  const posts = [];
  postsData.forEach(doc => posts.push({
    id: doc.id,
    posterUserId,
    ...doc.data(),
    date: doc.data().date.toDate() // convert Firebase Timestamp to JavaScript Date
  }))

  // Confidence check: sort by date, most recent first (descending)
  posts.sort((a, b) => (b.date - a.date));

  return Response.json({ posts });
}
