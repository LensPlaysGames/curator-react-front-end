"use client";

import {
  firebaseAuth,
  onAuthStateChanged,
  type User,
  UserContext,
} from "@/libs/firebase/auth"
import { useEffect, useState } from "react";

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

