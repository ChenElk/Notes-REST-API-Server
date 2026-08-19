import express from 'express';
import { authentication } from '../middlewares/authentication';
import { getAllNotes, createNote, getNoteById, updateNote, deleteNote, getNoteByIndex, updateNoteByIndex, deleteNoteByIndex, filterNotes} from '../controllers/noteController';

const router = express.Router();

router.get('/notes', getAllNotes);
router.get("/notes/filter", filterNotes);
router.get('/notes/:id', getNoteById);
router.post('/notes', authentication, createNote);
router.put('/notes/:id', authentication, updateNote);
router.delete('/notes/:id', authentication, deleteNote);
router.get('/notes/by-index/:i', getNoteByIndex);
router.put('/notes/by-index/:i', updateNoteByIndex);
router.delete('/notes/by-index/:i', deleteNoteByIndex);




export default router;