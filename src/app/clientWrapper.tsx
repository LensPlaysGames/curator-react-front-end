"use client";

import {
  firebaseAuth,
  onAuthStateChanged,
  type User,
  UserContext,
} from "@/libs/firebase/auth"
import { useState } from "react";

export default function ClientWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, setUser] = useState<User | null>(null);

  onAuthStateChanged(firebaseAuth, (newUser) => {
    setUser(newUser);
    return newUser;
  });

  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  );
}

