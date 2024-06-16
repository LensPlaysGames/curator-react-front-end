import { fetchPostsByUser } from "@/libs/firebase/ease";

export async function GET(request: Request, { params }: { params: { userId: string }}) {
  const posterUserId = params.userId;
  const posts = await fetchPostsByUser(posterUserId, 100);
  return Response.json({ posts });
}
