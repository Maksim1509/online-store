import { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

import './pagination.css';

interface IProp {
  itemCount: number;
  itemsPerPage: number;
  currentPage: number;
  setItemsPerPage: (num: number) => void;
  setCurrentPage: (num: number) => void;
  setPageCount: (num: number) => void;
}

const Pagination = (prop: IProp) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    itemCount,
    itemsPerPage,
    currentPage,
    setCurrentPage,
    setItemsPerPage,
    setPageCount,
  } = prop;
  const changeHandler = (e: ChangeEvent) => {
    const input = e.target as HTMLInputElement;
    const value = Number(input.value);
    const newPagesCount = Math.ceil(itemCount / value);
    setPageCount(newPagesCount);
    setItemsPerPage(value);
    localStorage.setItem('productsPerPage', String(value));
    const pageParam = searchParams.get('page');
    const queryString = pageParam
      ? `?page=${pageParam}&productsPerPage=${value}`
      : `?productsPerPage=${value}`;
    navigate(queryString);
  };

  const prevHandler = () => {
    if (currentPage - 1 === 0) return;
    localStorage.setItem('currentPage', String(currentPage - 1));
    const productsPerPage = searchParams.get('productsPerPage');
    const queryString = productsPerPage
      ? `?page=${currentPage - 1}&productsPerPage=${productsPerPage}`
      : `?page=${currentPage - 1}`;
    navigate(queryString);
    setCurrentPage(currentPage - 1);
  };

  const nextHandler = () => {
    if (currentPage === Math.ceil(itemCount / itemsPerPage)) return;
    localStorage.setItem('currentPage', String(currentPage + 1));
    const productsPerPage = searchParams.get('productsPerPage');
    const queryString = productsPerPage
      ? `?page=${currentPage + 1}&productsPerPage=${productsPerPage}`
      : `?page=${currentPage + 1}`;
    setCurrentPage(currentPage + 1);
    navigate(queryString);
  };
  return (
    <div className='pagination'>
      <div className='pagination__per-page'>
        <label htmlFor='productsPerPage'>Products Per Page: </label>
        <input
          id='productsPerPage'
          className='pagination__input'
          min={1}
          max={10}
          type='number'
          value={itemsPerPage}
          onChange={changeHandler}
        />
      </div>

      <button className='pagination__prev' onClick={prevHandler}>
        {'<'}
      </button>
      <span className='pagination__current-page'>
        Current page: {currentPage}
      </span>
      <button className='pagination__next' onClick={nextHandler}>
        {'>'}
      </button>
    </div>
  );
};

export default Pagination;
