"use client";

import {
  signInPopupGoogle,
  type User
} from "@/libs/firebase/auth";

export function SignInButton({ callback }: { callback: (user: User) => void }) {
  async function signIn() {
    const result = await signInPopupGoogle();
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
