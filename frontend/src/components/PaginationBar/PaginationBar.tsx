import { ActivePageContext } from '../../contexts/ActivePageContext';
import './PaginationBar.css'
import { useContext } from 'react';
import { getVisiblePages } from '../../utils/pagination';

type PaginationProps = {
  totalPages: number;
};

export default function PaginationBar({totalPages}: PaginationProps){ 
  const {activePage,setActivePage } = useContext(ActivePageContext);
  const arr = getVisiblePages(activePage, totalPages);

  function handleOnClickPagination(page: number){
    setActivePage(page);
  }

  const pages= arr.map((page) => (
    <li key={page}>
      <button
        name={`page-${page}`}
        className={activePage === page ? "active" : ""}
        disabled={activePage === page}
        onClick={() => handleOnClickPagination(page)}
      >{page} 
      </button>
    </li>
  ));
  

  return (   
    <div>
    <ul className="pagination">
      <li><button name="first" disabled={activePage === 1}  onClick={() => handleOnClickPagination(1)}>First</button></li>
      <li><button name="previous" disabled={activePage === 1}   onClick={() => handleOnClickPagination(activePage - 1)}>Previous</button></li>
      {pages}
      <li><button name="next" disabled={activePage === totalPages}  onClick={() => handleOnClickPagination(activePage + 1)}>Next</button></li>
      <li><button name="last" disabled={activePage === totalPages} onClick={() => handleOnClickPagination(totalPages)}>Last</button></li>
    </ul>
    </div>
  );
}