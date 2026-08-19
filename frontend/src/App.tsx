import { useState } from "react";
import "./App.css";
import LoginPage from "./components/LoginPage/LoginPage";
import CreateUserPage from "./components/CreateUserPage/CreateUserPage";
import HomePage from "./components/HomePage/HomePage";

import { ActivePageContext } from "./contexts/ActivePageContext";
import {LoggedUserContext, type LoggedUser } from "./contexts/LoggedUserContext";

import { BrowserRouter, Routes, Route } from "react-router-dom";



export default function App() {
  const [activePage, setActivePage] = useState(1);
  const [totalNotes, setTotalNotes] = useState(0);
  const [loggedUser, setLoggedUser] = useState<LoggedUser | null>(null);

  const POSTS_PER_PAGE = 10;


  const totalPages = Math.max(1, Math.ceil(totalNotes / POSTS_PER_PAGE));
  return (
  <ActivePageContext.Provider value={{ activePage, setActivePage }}>
    <LoggedUserContext.Provider value={{ loggedUser, setLoggedUser }}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                totalPages={totalPages}
                setTotalNotes={setTotalNotes}
                POSTS_PER_PAGE={POSTS_PER_PAGE}
              />
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-user" element={<CreateUserPage />} />
        </Routes>
      </BrowserRouter>
    </LoggedUserContext.Provider>
  </ActivePageContext.Provider>
);
}