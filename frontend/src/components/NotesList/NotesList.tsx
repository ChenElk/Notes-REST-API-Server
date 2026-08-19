import { useEffect, useReducer, useContext, useState } from "react";
import './NotesList.css'
import type { Note } from "../types";
import { ActivePageContext } from "../../contexts/ActivePageContext";
import notesService from "../../services/notesService";
import notesReducer from "./notesReducer";
import CreateNote from "../CreateNote/CreateNote";
import NoteItem from "../NoteItem/NoteItem";
import { getVisiblePages } from "../../utils/pagination";



type NotesListProps = {
  setTotalNotes: (total: number | ((prev: number) => number)) => void;
  POSTS_PER_PAGE: number;
  totalPages: number;
};


export default function NotesList({ setTotalNotes, POSTS_PER_PAGE, totalPages }: NotesListProps) {
  const { activePage } = useContext(ActivePageContext);
  const [notes, dispatch] = useReducer(notesReducer, []);
  const [pagesCache, setPagesCache] = useState<Record<number, Note[]>>({});

  const [notification, setNotification] = useState("Notification area");
  const [sanitizerOn, setSanitizerOn] = useState(true);


  async function handleGetAllNotes() {
    const response = await notesService.getAll({
      activePage,
      POSTS_PER_PAGE
    });

    dispatch({
      type: 'getAll',
      notes: response.data
    });

    setPagesCache({
      [activePage]: response.data,
    });

    setTotalNotes(Number(response.headers["x-total-count"]));
  }




useEffect(() => {
  const loadPages = async () => {
    try {
      const visiblePages = totalPages <= 0 ? [1] : getVisiblePages(activePage, totalPages);

      if (pagesCache[activePage]) {
        dispatch({
          type: "getAll",
          notes: pagesCache[activePage],
        });
      }

      const missingPages = visiblePages.filter((page) => !pagesCache[page]);

      if (missingPages.length === 0) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const fetchedPages = await Promise.all(
        missingPages.map(async (page) => {
          const response = await notesService.getAll({
            activePage: page,
            POSTS_PER_PAGE,
          });

          const totalCount = response.headers["x-total-count"];
          if (totalCount !== undefined) {
            setTotalNotes(Number(totalCount));
          }

          return [page, response.data] as const;
        })
      );

      setPagesCache((prevCache) => {
        const nextCache: Record<number, Note[]> = {};

        for (const page of visiblePages) {
          if (prevCache[page]) {
            nextCache[page] = prevCache[page];
          }
        }

        for (const [page, pageNotes] of fetchedPages) {
          nextCache[page] = pageNotes;
        }

        return nextCache;
      });

      const currentPageFromFetch = fetchedPages.find(
        ([page]) => page === activePage
      );

      if (currentPageFromFetch) {
        dispatch({
          type: "getAll",
          notes: currentPageFromFetch[1],
        });
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.log(error);
    }
  };

  loadPages();
}, [activePage, POSTS_PER_PAGE, totalPages, setTotalNotes,pagesCache]);


  return (
    <div>
      <h1>Notes</h1>

      <div className="notification">{notification}</div>

      <button
        type="button"
        data-testid="sanitizer_toggle"
        onClick={() => setSanitizerOn((prev) => !prev)}
      >
        Sanitizer: {sanitizerOn ? "ON" : "OFF"}
      </button>

      <CreateNote setNotification={setNotification} handleGetAllNotes={handleGetAllNotes} />

      {notes.map((note) => (

        <NoteItem
          key={note._id}
          note={note}
          setNotification={setNotification}
          handleGetAllNotes={handleGetAllNotes}
          dispatch={dispatch}
          sanitizerOn={sanitizerOn}
        />
      ))}
    </div>);
}

