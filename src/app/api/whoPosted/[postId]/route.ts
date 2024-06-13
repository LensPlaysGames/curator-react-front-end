import {
  collection,
  doc,
  firebaseDb,
  getDoc,
  limit,
  orderBy,
  query
} from "@/libs/firebase/db";

export async function GET(request: Request, { params }: { params: { postId: string }}) {
  const whoPostsRef = doc(firebaseDb, "WhoPosts", `${params.postId}`);
  const whoPostsData = await getDoc(whoPostsRef);

  // If there is no WhoPosts entry, it is likely the postId isn't valid.
  if (!whoPostsData.exists()) return Response.json(
    { error: `Post ${params.postId} not found.` },
    { status: 404 }
  );

  const whoPosted = whoPostsData.data()?.uid;

  return Response.json({ uid: whoPosted });
}
