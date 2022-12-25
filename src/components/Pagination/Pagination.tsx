import { ChangeEvent } from 'react';
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
  };

  const prevHandler = () => {
    if (currentPage - 1 === 0) return;
    setCurrentPage(currentPage - 1);
  };

  const nextHandler = () => {
    if (currentPage > Math.ceil(itemCount / itemsPerPage)) return;
    setCurrentPage(currentPage + 1);
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
