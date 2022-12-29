import { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Pagination from '../../components/Pagination/Pagination';
import Product from '../../components/Product/Product';
import Summary from '../../components/Summary/Summary';
import { Context } from '../../context/Context';
import './cart.css';

const CartPage = () => {
  const { cart } = useContext(Context);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentPageStorage = localStorage.currentPage
    ? JSON.parse(localStorage.currentPage)
    : 1;
  const productsPerPageStorage = localStorage.productsPerPage
    ? JSON.parse(localStorage.productsPerPage)
    : 3;

  const limitParams = searchParams.get('productsPerPage');
  const limitInit = limitParams
    ? Number(searchParams.get('productsPerPage'))
    : productsPerPageStorage;

  const pageParams = searchParams.get('page');
  const pageInit = pageParams ? Number(pageParams) : currentPageStorage;

  const [products, setProducts] = useState(cart);
  const [productsPerPage, setProductsPerPage] = useState(limitInit);
  const [currentPage, setCurrentPage] = useState(pageInit);
  const [idWithError, setIdWithError] = useState<null | number>(null);
  const [pageCount, setPageCount] = useState(
    Math.ceil(products.length / productsPerPage)
  );

  const countStateInit = Object.fromEntries(
    products.map((item) => [item.id, 1])
  );
  const [countState, setCount] = useState(countStateInit);
  console.log(countState);
  useEffect(() => {
    if (currentPage > pageCount) {
      const productsPerPage = searchParams.get('productsPerPage');
      const queryString = productsPerPage
        ? `?page=${pageCount}&productsPerPage=${productsPerPage}`
        : `?page=${pageCount}`;
      navigate(queryString);
      setCurrentPage(pageCount);
    }
  }, [currentPage, pageCount, navigate, searchParams]);

  const removeProductHandler = (removeId: number) => () => {
    const newProductsState = products.filter(({ id }) => id !== removeId);
    setProducts(newProductsState);
    setCount({ ...countState, [removeId]: 0 });
    localStorage.cartData = JSON.stringify(newProductsState);
    const newPageCount =
      Math.ceil(newProductsState.length / productsPerPage) || 1;
    setPageCount(newPageCount);
  };
  const decrementHendler = (currentId: number) => () => {
    setIdWithError(null);
    const newCount = countState[currentId] - 1;
    if (newCount < 1) {
      const newProductsState = products.filter(({ id }) => id !== currentId);
      setProducts(newProductsState);
      setCount({ ...countState, [currentId]: 0 });
      const newPageCount =
        Math.ceil(newProductsState.length / productsPerPage) || 1;
      setPageCount(newPageCount);
    }
    const newCountState = { ...countState, [currentId]: newCount };
    setCount(newCountState);
  };
  const incrementHendler = (id: number) => () => {
    const newCount = countState[id] + 1;
    const item = products.find((item) => item.id === id);
    if (!item) throw new Error('Item not found');
    if (item.stock < newCount) {
      setIdWithError(id);
      return;
    }
    setCount({ ...countState, [id]: newCount });
  };

  const lastProductIndex = currentPage * productsPerPage;
  const firstProductIndex = lastProductIndex - productsPerPage;
  const currentProducts = products.slice(firstProductIndex, lastProductIndex);
  return (
    <section className='cart'>
      <h1>Cart</h1>
      <b>
        TOTAL:{' '}
        {products.reduce((acc, item) => {
          const sum = item.price * countState[item.id];
          return acc + sum;
        }, 0)}
      </b>
      <div className='cart__pagination'>
        <Pagination
          itemCount={products.length}
          itemsPerPage={productsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setItemsPerPage={setProductsPerPage}
          setPageCount={setPageCount}
        />
      </div>

      <ul className='cart__list'>
        <li className='cart__item'>
          <span>Product</span>
          <span>Count</span>
          <span>SUM</span>
        </li>
        {currentProducts.map((product) => (
          <li className='cart__item' key={product.id}>
            <div>
              <Product {...product} />
            </div>
            <div className='cart__counter'>
              <button
                className='cart__btn'
                onClick={incrementHendler(product.id)}
              >
                {product.id === idWithError && (
                  <span className='cart__error-message'>
                    The maximum count of goods {product.stock}pcs
                  </span>
                )}
                +
              </button>
              <span className='cart__count'>{countState[product.id]}</span>
              <button
                className='cart__btn'
                onClick={decrementHendler(product.id)}
              >
                -
              </button>
              <button
                className='cart__btn'
                onClick={removeProductHandler(product.id)}
              >
                Remove
              </button>
            </div>
            <span>SUM: {product.price * countState[product.id]}</span>
          </li>
        ))}
      </ul>
      <section className='cart__summary'>
        <Summary
          count={Object.values(countState).reduce((acc, val) => acc + val, 0)}
          total={products.reduce((acc, item) => {
            const sum = item.price * countState[item.id];
            return acc + sum;
          }, 0)}
        />
      </section>
    </section>
  );
};

export default CartPage;
