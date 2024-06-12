import {
  type User,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "firebase/auth";
import { firebaseAuth } from "./config";
import { UserContext } from "@/context/auth"

// Re-exports
export {
  type User,
  onAuthStateChanged
} from "firebase/auth";
export { firebaseAuth } from "./config";
export { UserContext } from "@/context/auth";


export async function signOut() {
  await firebaseAuth.signOut();
}

async function signInPopup(provider: any) {
  const result = await signInWithPopup(firebaseAuth, provider);
  if (!result || !result.user) {
    throw new Error("signInWithPopup failed: ${result}");
  }
  return result.user;
}

export async function signInPopupGoogle() {
  return signInPopup(new GoogleAuthProvider());
}


