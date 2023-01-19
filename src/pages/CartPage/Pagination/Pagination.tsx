import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { PagParams, setQueryString } from '../../../utils';
import './pagination.css';

interface IProp {
  itemCount: number;
  itemsPerPage: number;
  currentPage: number;
  setItemsPerPage: (num: number) => void;
  setCurrentPage: (num: number) => void;
  setPageCount: (num: number) => void;
}

const getPagesCount = (items: number, itemsPerPage: number): number =>
  Math.ceil(items / itemsPerPage);

const setLocalStore = (key: string, value: string): void => {
  localStorage.setItem(key, value);
};

const Pagination = ({
  itemCount,
  itemsPerPage,
  currentPage,
  setCurrentPage,
  setItemsPerPage,
  setPageCount,
}: IProp) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [value, setValue] = useState(itemsPerPage);

  const changeHandler = (e: ChangeEvent) => {
    const input = e.target as HTMLInputElement;
    const value = Number(input.value);
    setValue(value);
  };

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    setItemsPerPage(value);
    const newPagesCount = getPagesCount(itemCount, value);
    setPageCount(newPagesCount);
    setLocalStore('productsPerPage', String(value));
    setQueryString(
      searchParams,
      PagParams.productsPerPage,
      currentPage,
      value,
      navigate
    );
  };

  const prevHandler = () => {
    if (currentPage - 1 === 0) return;
    setCurrentPage(currentPage - 1);
    setLocalStore('currentPage', String(currentPage - 1));
    setQueryString(
      searchParams,
      PagParams.page,
      currentPage - 1,
      itemsPerPage,
      navigate
    );
  };

  const nextHandler = () => {
    if (currentPage === getPagesCount(itemCount, itemsPerPage)) return;
    setCurrentPage(currentPage + 1);
    setLocalStore('currentPage', String(currentPage + 1));
    setQueryString(
      searchParams,
      PagParams.page,
      currentPage + 1,
      itemsPerPage,
      navigate
    );
  };

  return (
    <div className='pagination'>
      <form className='pagination__per-page' onSubmit={submitHandler}>
        <label htmlFor='productsPerPage'>Products Per Page: </label>
        <input
          id='productsPerPage'
          className='pagination__input'
          min={1}
          max={10}
          type='number'
          value={value}
          onChange={changeHandler}
        />
      </form>

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
