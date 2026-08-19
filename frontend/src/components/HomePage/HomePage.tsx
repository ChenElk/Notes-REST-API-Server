import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import NotesList from "../NotesList/NotesList";
import PaginationBar from "../PaginationBar/PaginationBar";
import { LoggedUserContext } from "../../contexts/LoggedUserContext";
import notesService from "../../services/notesService";
import AIService from "../../services/AIService";

type HomePageProps = {
  totalPages: number;
  setTotalNotes: React.Dispatch<React.SetStateAction<number>>;
  POSTS_PER_PAGE: number;
};

export default function HomePage({
  totalPages,
  setTotalNotes,
  POSTS_PER_PAGE,
}: HomePageProps) {
  const { loggedUser, setLoggedUser } = useContext(LoggedUserContext);
  const navigate = useNavigate();

  function handleLogout() {
    setLoggedUser(null);
    notesService.setToken(null);
    AIService.setToken(null);
  }

  return (
    <div>
      {loggedUser === null ? (
        <div>
          <button
            data-testid="go_to_login_button"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>

          <button
            data-testid="go_to_create_user_button"
            onClick={() => navigate("/create-user")}
          >
            Create New User
          </button>
        </div>
      ) : (
        <div>
          <p>Logged in as {loggedUser.name}</p>

          <button data-testid="logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      <NotesList
        setTotalNotes={setTotalNotes}
        POSTS_PER_PAGE={POSTS_PER_PAGE}
        totalPages={totalPages}
      />

      <PaginationBar totalPages={totalPages} />
    </div>
  );
}