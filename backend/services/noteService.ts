import { Note } from '../models/Note';
import { User } from '../models/User';
import mongoose from 'mongoose';

export const getAllNotesService = async (page: number, perPage: number) => {
  const safePage = Math.max(page || 1, 1);
  const safePerPage = Math.min(Math.max(perPage || 10, 1), 10);

  const count = await Note.countDocuments();

  const notes = await Note.find().sort({ _id: -1 }).skip((safePage - 1) * safePerPage).limit(safePerPage);

  return { notes, count };
};

export const getNoteByIdService = async (id: string) => {
    //check validation for mongoos object id
    if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return Note.findById(id);
};

export const createNoteService = async (
  title: string,
  content: string,
  userId: string
) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('Unauthorized') as Error & { status?: number };
    error.status = 401;
    throw error;
  }
    const note = new Note({
    title,
    author: {
      name: user.name,
      email: user.email,
    },
    content,
    user: user._id,
  });
  return note.save();
};

export const updateNoteService = async (
  id: string,
  title: string,
  author: { name: string; email: string } | null,
  content: string
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return Note.findByIdAndUpdate(
    id,
    { title, author, content },
    { new: true , runValidators: true }
  );
};

export const deleteNoteService = async (id: string) => {
    //check validation for mongoos object id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return Note.findByIdAndDelete(id);
};

export const getNoteByIndexService = async (index: number) => {
  if (isNaN(index) || index < 0) {
    return null;
  }

  const note = await Note.findOne()
    .sort({ _id: -1 })
    .skip(index);

  return note;
};

export const updateNoteByIndexService = async (
  index: number,
  title: string,
  author: { name: string; email: string } | null,
  content: string
) => {
  const note = await getNoteByIndexService(index);

  if (!note) {
    return null;
  }

  return Note.findByIdAndUpdate(
    note._id,
    { title, author, content },
    { returnDocument: 'after', runValidators: true }
  );
};

export const deleteNoteByIndexService = async (index: number) => {
  const note = await getNoteByIndexService(index);

  if (!note) {
    return null;
  }

  return Note.findByIdAndDelete(note._id);
};

export const filterNotesService = async (query: string) => {
  return Note.find({
    content: { $regex: query, $options: "i" },
  })
    .sort({ _id: 1 })
    .limit(10);
};