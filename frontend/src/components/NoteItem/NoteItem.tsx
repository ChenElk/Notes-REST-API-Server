import { useContext, useState } from "react";
import notesService from "../../services/notesService";
import type { Note } from "../types";
import { LoggedUserContext } from "../../contexts/LoggedUserContext";
import type { NotesAction } from "../NotesList/notesReducer";
import { sanitizeHtml } from "../../utils/sanitizeHtml";

type Props = {
    note: Note;
    setNotification: (notification: string) => void;
    handleGetAllNotes: () => Promise<void>;
    dispatch: React.Dispatch<NotesAction>;
    sanitizerOn: boolean;
};

export default function NoteItem({ note, setNotification, handleGetAllNotes, dispatch, sanitizerOn }: Props) {
  
    const [isEditing, setisEditing] = useState(false);
    const [editedContent, setEditedContent] = useState("");

    const { loggedUser } = useContext(LoggedUserContext);

    const htmlContent = sanitizerOn
    ? sanitizeHtml(note.content)
    : note.content;

      async function handleDeleteNote(id: string) {
        try {
          await notesService.remove(id);
    
          await handleGetAllNotes();
    
          setNotification("Note deleted");
    
        } catch (error) {
          console.log(error);
        }
      }
    
      function handleEditClick(note: Note) {
        setisEditing(true);
        setEditedContent(note.content);
      }
    
      function handleCancelEdit() {
        setisEditing(false);
        setEditedContent("");
      }
    
      async function handleSaveEdit(note: Note) {
        const updatedNote = {
          title: note.title,
          content: editedContent
        };
    
        try {
          const savedNote = await notesService.update(note._id, updatedNote);
    
          dispatch({
            type: "update",
            note: savedNote
          });

          await handleGetAllNotes();
    
          setNotification("Note updated");
    
          setisEditing(false);
          setEditedContent("");
        } catch (error) {
          console.log(error);
        }
      }
    


    return (
    <div>
      <div key={note._id} className="note" data-testid={note._id}>
          <h2>{note.title}</h2>
          <small>By {note.author?.name ?? "Unknown"}</small>
              
          <div
            data-testid="note_body"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {loggedUser && loggedUser?.email === note.author?.email && (
            <button
              data-testid={`delete-${note._id}`}
              name={`delete-${note._id}`}
              onClick={() => handleDeleteNote(note._id)}
            >
              Delete
            </button>
          )}

          {isEditing ? (
            <div>
              <textarea
                data-testid={`text_input-${note._id}`}
                name={`text_input-${note._id}`}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />

              <button
                data-testid={`text_input_save-${note._id}`}
                name={`text_input_save-${note._id}`}
                onClick={() => handleSaveEdit(note)}
              >
                Save
              </button>

              <button
                data-testid={`text_input_cancel-${note._id}`}
                name={`text_input_cancel-${note._id}`}
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </div>
          ) : ( loggedUser &&
              loggedUser?.email === note.author?.email && (
                <button
                  data-testid={`edit-${note._id}`}
                  name={`edit-${note._id}`}
                  onClick={() => handleEditClick(note)}
                >
                  Edit
                </button>
              )
          )}
        </div>
    </div>
  );
}