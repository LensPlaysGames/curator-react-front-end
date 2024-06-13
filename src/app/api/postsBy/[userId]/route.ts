import { firebaseDb } from "@/libs/firebase/config";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";

export async function GET(request: Request, { params }: { params: { userId: string }}) {
  const postsRef = collection(firebaseDb, "Users", `${params.userId}`, "Posts");
  const postsData = await getDocs(query(
    postsRef,
    orderBy("date", "desc"),
    limit(10)
  ));
  const posts = postsData.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date.toDate() // convert Firebase Timestamp to JavaScript Date
  }))

  // Confidence check: sort by date, most recent first (descending)
  posts.sort((a, b) => (b.date - a.date));

  return Response.json({ posts });
}
