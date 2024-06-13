"use client";

import { type User } from "firebase/auth";
import { createContext, useContext } from "react";

export type UserContent = {
  user: User | null,
  setUser: any, // Dispatch<SetStateAction<null>>
};

export const UserContext = createContext<UserContent>({
  user: null,
  setUser: () => {}
});
