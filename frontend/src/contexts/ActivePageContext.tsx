import { createContext } from "react";

type ActivePageContextType = {
  activePage: number;
  setActivePage: (page: number) => void;
};

export const ActivePageContext = createContext<ActivePageContextType>({
  activePage: 1,
  setActivePage: () => {},
});