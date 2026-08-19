import { useContext, useState } from "react";
import notesService from "../../services/notesService";
import { LoggedUserContext } from "../../contexts/LoggedUserContext";
import AIService from "../../services/AIService";


type Props = {
    setNotification: (notification: string) => void;
    handleGetAllNotes: () => Promise<void>;
};


export default function CreateNote({ setNotification,
    handleGetAllNotes,
}: Props) {
    const [isCreating, setIsCreating] = useState(false);
    const [newNoteContent, setNewNoteContent] = useState("");
    const [isUsingAI, setIsUsingAI] = useState(false);
    const [newPromptContent, setNewPromptContent] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiError, setAiError] = useState("");

    const { loggedUser } = useContext(LoggedUserContext);


    function handleOnClickCreate() {
        setIsCreating(true);
    }


    async function handleSaveNewNote() {
        const newNote = {
            title: "New Note",
            content: newNoteContent
        };

        try {
            await notesService.create(newNote);

            await handleGetAllNotes();

            setNotification("Added a new note");
            setNewNoteContent("");
            setIsCreating(false);
            setIsUsingAI(false);
            setNewPromptContent("");
            setAiError("");

        } catch (error) {
            console.log(error);
        }
    }

    async function handleGenerateNote() {
        if (!newPromptContent.trim()) {
            setAiError("Please enter a prompt");
            return;
        }

        setIsGenerating(true);
        setAiError("");
        const prompt = newPromptContent;

        try {
            const result = await AIService.complete(prompt);
            setNewNoteContent((prev) => prev ? `${prev}\n${result.text}` : result.text);
            setIsUsingAI(false);
            setNewPromptContent("");
        } catch {
            setAiError("Failed to generate note. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    }


    return (
        <div>
            {loggedUser && (
                !isCreating ? (
                    <button name="add_new_note" onClick={handleOnClickCreate}>
                        Add new note
                    </button>
                ) : (
                    <div>
                        <button
                            type="button"
                            data-testid="help_me_write"
                            onClick={() => {
                                setIsUsingAI((prev) => !prev);
                                setAiError("");
                            }}
                        >
                            ★
                        </button>

                        <input
                            type="text"
                            name="text_input_new_note"
                            value={newNoteContent}
                            onChange={(e) => setNewNoteContent(e.target.value)}
                        />


                        <button
                            type="button"
                            name="text_input_save_new_note"
                            onClick={handleSaveNewNote}
                        >
                            Save
                        </button>

                        <button
                            type="button"
                            name="text_input_cancel_new_note"
                            onClick={() => {
                                setIsCreating(false);
                                setNewNoteContent("");
                                setIsUsingAI(false);
                                setNewPromptContent("");
                                setAiError("");
                            }}
                        >
                            Cancel
                        </button>

                        {isUsingAI && (
                            <div>
                                <input
                                    data-testid="help_me_write_prompt"
                                    type="text"
                                    value={newPromptContent}
                                    onChange={(e) => setNewPromptContent(e.target.value)}
                                    placeholder="Ask AI to help write this note"
                                />

                                <button
                                    type="button"
                                    data-testid="help_me_write_submit"
                                    onClick={handleGenerateNote}
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? "Generating..." : "Generate"}
                                </button>

                                {aiError && <div>{aiError}</div>}
                            </div>
                        )}
                        
                    </div>
                )
            )}
        </div>
    );
}