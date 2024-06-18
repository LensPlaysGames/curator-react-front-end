"use client";

import { useEffect, useState } from "react";
import {
  firebaseAuth,
  onAuthStateChanged,
  type User,
  UserContext,
} from "@/libs/firebase/auth"

import { ownUserData } from "@/libs/api";
import { UserDataContent, UserDataContext } from "@/context/userData";

export default function ClientWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, setUser] = useState<User | null>(null);
  // NOTE: Should match default value for context in "@/context/userData"...
  const [userData, setUserData] = useState<UserDataContent>({
    displayName: "",
    tracked: [],
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (newUser) => {
      setUser(newUser);

      if (newUser) {
        const userData = await ownUserData(newUser.uid);
        setUserData(userData as UserDataContent);
      }

      return newUser;
    });
    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider value={{user, setUser}}>
      <UserDataContext.Provider value={{userData, setUserData}}>
        {children}
      </UserDataContext.Provider>
    </UserContext.Provider>
  );
}

