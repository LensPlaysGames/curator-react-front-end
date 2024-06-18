import { db } from "@/libs/firebase/admin";

export async function GET(request: Request, { params }: { params: { userId: string }}) {
  const userId = params.userId;

  const userDataRef = db.collection("Users").doc(userId);
  const userDataSnap = await userDataRef.get();
  if (!userDataSnap.exists) {
    return Response.json({ error: "404" });
  }
  const data = userDataSnap.data();

  return Response.json(data);
}
