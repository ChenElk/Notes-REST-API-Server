import { Request, Response } from 'express';
import {getAllNotesService,getNoteByIdService,createNoteService,updateNoteService,deleteNoteService,getNoteByIndexService, updateNoteByIndexService,deleteNoteByIndexService, filterNotesService}  from '../services/noteService';
import { Note } from '../models/Note';
import { AuthenticatedRequest } from '../middlewares/authentication';

export const getAllNotes = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query._page);
        const perPage = Number(req.query._per_page);

        const { notes, count } = await getAllNotesService(page, perPage);
        
        res.set('X-Total-Count', String(count)); // need to set this header for the frontend to know how many notes there are in total
        res.status(200).json(notes);

    } catch {
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};


export const getNoteById = async (req: Request, res: Response) => {
    try {   
        const note = await getNoteByIdService(String(req.params.id));
        if (!note) {
            return res.status(404).json({
                message: 'Not Found'
            });
        }
        res.status(200).json(note);
    
    } catch{
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
   
};

export const createNote = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const { title, content } = req.body;

        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!title || !content) {
            return res.status(400).json({
                message: 'Bad Request'
            });
        }
        
        const note = await createNoteService(title, content, userId);

        res.status(201).json(note);

    } catch {
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
    
}

export const updateNote = async (req: AuthenticatedRequest, res: Response) => {
   try {
        const { title, author, content } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const note_id= String(req.params.id);

        const exiting_note = await Note.findById(note_id);

        if (!exiting_note) {
            return res.status(404).json({ message: 'Not Found' });
            }

        if (exiting_note.user?.toString() !== userId) {
            return res.status(401).json({ message: 'Unauthorized' });
            }

        if (!title || !content) {
                return res.status(400).json({
                    message: 'Bad Request'
                });
            }

        const note = await updateNoteService(note_id, title, author, content);

        if (!note) {
            return res.status(404).json({
                message: 'Not Found'
            });
        }

        res.status(200).json(note);


   } catch {
        res.status(500).json({
            message: 'Internal Server Error'
        });
   }
};


export const deleteNote = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const note_id= String(req.params.id);

        const exiting_note = await Note.findById(note_id);

        if (!exiting_note) {
            return res.status(404).json({ message: 'Not Found' });
            }

        if (exiting_note.user?.toString() !== userId) {
            return res.status(401).json({ message: 'Unauthorized' });
            }

        const note = await deleteNoteService(note_id);

        if (!note) {
            return res.status(404).json({
                message: 'Not Found'
            });
        }

        res.status(204).send();

    } catch {
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};

export const getNoteByIndex = async (req: Request, res: Response) => {
    try {
        const index = Number(req.params.i);
        const note = await getNoteByIndexService(index);
        
        if (!note) {
      return res.status(404).json({ message: 'Not Found' });
    }

        res.status(200).json(note);

    } catch {
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};

export const updateNoteByIndex = async (req: Request, res: Response) => {
    try {
        const index = Number(req.params.i);
        const { title, author, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: 'Bad Request'
            });
        }


        const updatedNote = await updateNoteByIndexService(index, title, author, content);
        
        if (!updatedNote) {
            return res.status(404).json({ message: 'Not Found' });
        }
        
        res.status(200).json(updatedNote);

    } catch {
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};

export const deleteNoteByIndex = async (req: Request, res: Response) => {
    try {
        const index = Number(req.params.i);
        const deletedNote  = await deleteNoteByIndexService(index);

        if (!deletedNote) {
            return res.status(404).json({ message: 'Not Found' });
        }

        res.status(204).send();
        
    } catch {
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};


export const filterNotes = async (req: Request, res: Response) => {
  try {
    const query = req.query.query;

    if (typeof query !== "string" || query.trim() === "") {
      return res.status(400).json({ message: "query is required" });
    }

    const notes = await filterNotesService(query);

    res.set("X-Total-Count", String(notes.length));
    return res.status(200).json(notes);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

