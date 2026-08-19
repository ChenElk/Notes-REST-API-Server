import type { Note } from "../types";

export type NotesAction =
  | { type: "getAll"; notes: Note[] }
  | { type: "update"; note: Note };

export default function notesReducer(notes: Note[], action: NotesAction) {
  switch (action.type) {
    case "getAll":
      return action.notes;

    case "update":
      return notes.map((note) =>
        note._id === action.note._id ? action.note : note
      );

    default:
      throw new Error("Unknown action");
  }
}