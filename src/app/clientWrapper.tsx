"use client";

import { useEffect, useState } from "react";
import {
  firebaseAuth,
  onAuthStateChanged,
  type User,
  UserContext,
} from "@/libs/firebase/auth"

export default function ClientWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (newUser) => {
      setUser(newUser);
      return newUser;
    });
    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  );
}

