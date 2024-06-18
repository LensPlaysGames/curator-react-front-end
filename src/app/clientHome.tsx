"use client";

import { useContext } from "react";
import Link from "next/link";
import { SignInButton } from "@/components/SignInButton";
import { UserContext } from "@/libs/firebase/auth";
import { UserDataContext } from "@/context/userData";

export default function ClientHome() {
  const {user, setUser} = useContext(UserContext);
  const udata = useContext(UserDataContext);
  return (
    user
      ? <div className="panel">
          <span className="mx-auto">Welcome, {udata.displayName}</span>
          <Link href="/you">
            <button className="w-full">Make Posts</button>
          </Link>
        </div>
      : <SignInButton callback={setUser}/>
  )
}
