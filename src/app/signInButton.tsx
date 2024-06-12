"use client";

import { type User } from "firebase/auth";
import { signInPopupGoogle } from "@/libs/firebase/auth";

export function SignInButton({ callback }: { callback: (user: User) => void }) {
  async function signIn() {
    const result = await signInPopupGoogle();
    console.log(callback);
    callback(result);
  }

  return (
    <button
      onClick={signIn}
    >
      Sign In
    </button>
  )
}
