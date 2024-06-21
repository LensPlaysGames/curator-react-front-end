import { doc, firebaseDb, getDoc } from "@/libs/firebase/db";

export async function GET(request: Request, { params }: { params: { userId: string }}) {
  const userId = params.userId;

  const userDataRef = doc(firebaseDb, "Users", userId);
  const userDataSnap = await getDoc(userDataRef);
  if (!userDataSnap.exists()) {
    return Response.json({ error: "404" });
  }
  const data = userDataSnap.data();

  return Response.json(data);
}
