import { createContext } from "react";

export type LoggedUser = {
  token: string;
  username: string;
  name: string;
  email: string;
};

type LoggedUserContextType = {
  loggedUser: LoggedUser | null;
  setLoggedUser: React.Dispatch<React.SetStateAction<LoggedUser | null>>;
};

export const LoggedUserContext = createContext<LoggedUserContextType>({
  loggedUser: null,
  setLoggedUser: () => {},
});