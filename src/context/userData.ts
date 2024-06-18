"use client";

import { createContext } from "react";

export type UserDataContent = {
  displayName: string,
  tracked: Array<string>,
};

export type UserDataContextContent = {
  userData: UserDataContent,
  setUserData: Function,
};

export const UserDataContext = createContext<UserDataContextContent>({
  userData: {
    displayName: "",
    tracked: [],
  },
  setUserData: () => {},
});
