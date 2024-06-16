"use client";

import { useContext } from "react";
import Link from "next/link";
import { SignInButton } from "@/components/SignInButton";
import { UserContext } from "@/libs/firebase/auth";

export default function ClientHome() {
  const {user, setUser} = useContext(UserContext);
  return (
    user
      ? <div className="panel">
          <Link href="/you">
            <button className="w-full">Make Posts</button>
          </Link>
        </div>
      : <SignInButton callback={setUser}/>
  )
}
