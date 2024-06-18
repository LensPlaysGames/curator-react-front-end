"use client";

import { createContext } from "react";

export type UserDataContent = {
  displayName: string,
  tracked: Array<string>,
};

export const UserDataContext = createContext<UserDataContent>({
  displayName: "",
  tracked: [],
});
