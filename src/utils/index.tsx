import { NavigateFunction } from 'react-router-dom';

export enum PagParams {
  page = 'page',
  productsPerPage = 'productsPerPage',
}

export const setQueryString = (
  searchParams: URLSearchParams,
  paramToSet: PagParams,
  currentPage: number,
  productsPerPage: number,
  navigate: NavigateFunction
): void => {
  let queryString;
  if (paramToSet === PagParams.page) {
    const productsPerPage = searchParams.get(PagParams.productsPerPage);
    queryString = productsPerPage
      ? `?page=${currentPage}&productsPerPage=${productsPerPage}`
      : `?page=${currentPage}`;
  } else {
    const pageParam = searchParams.get('page');
    queryString = pageParam
      ? `?page=${pageParam}&productsPerPage=${productsPerPage}`
      : `?productsPerPage=${productsPerPage}`;
  }
  navigate(queryString);
};
