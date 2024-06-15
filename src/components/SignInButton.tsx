"use client";

import {
  logEvent
} from "firebase/analytics"
import {
  firebaseAnalytics
} from "@/libs/firebase/config"
import {
  signInPopupGoogle,
  type User
} from "@/libs/firebase/auth";

export function SignInButton({ callback }: { callback: (user: User) => void }) {
  async function signIn() {
    const result = await signInPopupGoogle();
    callback(result);
    logEvent(firebaseAnalytics, "sign_up", {
      method: "Google"
    })
  }

  return (
    <button onClick={signIn}>
      Sign In
    </button>
  )
}
