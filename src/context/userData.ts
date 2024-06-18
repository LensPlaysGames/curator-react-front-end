"use client";

import { createContext } from "react";

export type UserDataContent = {
  userData: {
    displayName: string,
    tracked: Array<string>,
  },
  setUserData: Function,
};

export const UserDataContext = createContext<UserDataContent>({
  displayName: "",
  tracked: [],
});
