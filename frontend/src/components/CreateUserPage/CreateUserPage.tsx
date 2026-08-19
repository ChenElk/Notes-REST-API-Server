
import { useState } from "react";
import userService from "../../services/userService";
import { useNavigate } from "react-router-dom";


export default function CreateUserPage() {
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();



    async function handleCreateUser(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            await userService.createUser({ name: newName, email: newEmail, username: newUsername, password: newPassword });
            navigate("/");

        } catch {
            setErrorMessage("Could not create user");
            setTimeout(() => {
                setErrorMessage("");
            }, 5000);
        }
    }

    return (
        <div>
            <h2>Create User Page</h2>
            <form data-testid="create_user_form" onSubmit={handleCreateUser}>
                <div>{errorMessage}</div>
                <input
                    data-testid="create_user_form_name"
                    type="text"
                    placeholder="Name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />

                <input
                    data-testid="create_user_form_email"
                    type="email"
                    placeholder="Email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                />

                <input
                    data-testid="create_user_form_username"
                    type="text"
                    placeholder="Username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                />

                <input
                    data-testid="create_user_form_password"
                    type="password"
                    placeholder="Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                <button type="submit" data-testid="create_user_form_create_user">
                    Create User
                </button>
            </form>

        </div>
    );
}