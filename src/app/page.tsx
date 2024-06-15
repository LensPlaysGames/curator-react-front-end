"use client";

import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc
} from "firebase/firestore";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignInButton } from "@/components/SignInButton";
import { firebaseDb } from "@/libs/firebase/config";
import {
  type User,
  firebaseAuth,
  onAuthStateChanged,
  signOut,
  UserContext
} from "@/libs/firebase/auth";

export default function Home() {
  const {user, setUser} = useContext(UserContext);
  return (
    <div className="flex flex-col items-center w-full max-w-screen-sm">
      { user
        ? <>
            <div className="panel">
              <Link href="/you">
                <button className="w-full">Make Posts</button>
              </Link>
            </div>
            <div className="panel">
              <h1>Featured Channels</h1>
              <p>It's a bit quiet right now...</p>
              <p>Make a few posts, contact the owner, and maybe you could show up here.</p>
            </div>
          </>
        : <SignInButton callback={setUser}/>
      }
    </div>
  );
}
