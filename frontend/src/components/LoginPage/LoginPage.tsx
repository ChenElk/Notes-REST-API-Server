import { useContext, useState } from "react";
import { LoggedUserContext } from "../../contexts/LoggedUserContext";
import loginService from "../../services/loginService";
import noteService from "../../services/notesService";
import { useNavigate } from "react-router-dom";
import AIService from "../../services/AIService";

export default function LoginPage() {
  const {setLoggedUser } = useContext(LoggedUserContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      noteService.setToken(user.token);
      AIService.setToken(user.token);
      setLoggedUser(user);
      navigate("/");
      

    } catch {
      setErrorMessage("Invalid username or password");
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  }

  return (
    <div>
      <h2>Login Page</h2>
        <form data-testid="login_form" onSubmit={handleLogin}>
          <div>{errorMessage}</div>

          <input
            data-testid="login_form_username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            data-testid="login_form_password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" data-testid="login_form_login">
            Login
          </button>
        </form>
    </div>
  );
}