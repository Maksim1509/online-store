import { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Pagination from './Pagination/Pagination';
import Product from '../../components/Product/Product';
import Summary from './Summary/Summary';
import { Context, ICartState } from '../../context/Context';
import './cart.css';
import Modal from '../../components/Modal/Modal';

const getTotalCount = (state: ICartState[]): number =>
  state.reduce((acc, { count }) => acc + count, 0);

const getTotalCoast = (state: ICartState[]): number =>
  state.reduce((acc, { count, price }) => {
    const sum = count * price;
    return acc + sum;
  }, 0);

const CartPage = () => {
  const [modal, setModal] = useState(false);

  const modalShow = () => setModal(true);
  const modalClose = () => setModal(false);
  const { cartProducts, updateCart, cartSummary, updateCartSummary } =
    useContext(Context);
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

  const [productsPerPage, setProductsPerPage] = useState(limitInit);
  const [currentPage, setCurrentPage] = useState(pageInit);
  const [idWithError, setIdWithError] = useState<null | number>(null);
  const [pageCount, setPageCount] = useState(
    Math.ceil(cartProducts.length / productsPerPage)
  );

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
    const newProductsState = cartProducts.filter(({ id }) => id !== removeId);
    updateCart(newProductsState);
    updateCartSummary({
      productsCount: getTotalCount(newProductsState),
      totalCoast: getTotalCoast(newProductsState),
    });
    localStorage.cartProducts = JSON.stringify(newProductsState);
    const newPageCount =
      Math.ceil(newProductsState.length / productsPerPage) || 1;
    setPageCount(newPageCount);
  };
  const decrementHendler = (currentId: number) => () => {
    setIdWithError(null);
    const curentProduct = cartProducts.find(
      ({ id }) => id === currentId
    ) as ICartState;
    if (curentProduct.count === 1) {
      const newProductsState = cartProducts.filter(
        ({ id }) => id !== currentId
      );
      updateCartSummary({
        productsCount: getTotalCount(newProductsState),
        totalCoast: getTotalCoast(newProductsState),
      });
      updateCart(newProductsState);
      const newPageCount =
        Math.ceil(newProductsState.length / productsPerPage) || 1;
      setPageCount(newPageCount);
      return;
    }
    const newProductsState = cartProducts.map((product) => {
      if (product.id === currentId) {
        const copyProduct = { ...product, count: product.count - 1 };
        return copyProduct;
      }
      return product;
    });
    updateCart(newProductsState);
    updateCartSummary({
      productsCount: getTotalCount(newProductsState),
      totalCoast: getTotalCoast(newProductsState),
    });
  };
  const incrementHendler = (id: number) => () => {
    const item = cartProducts.find((item) => item.id === id) as ICartState;
    const newCount = item.count + 1;
    if (item.data.stock < newCount) {
      setIdWithError(id);
      return;
    }
    const newProductsState = cartProducts.map((product) => {
      if (product.id === id) {
        const copyProduct = { ...product, count: newCount };
        return copyProduct;
      }
      return product;
    });
    updateCart(newProductsState);
    updateCartSummary({
      productsCount: getTotalCount(newProductsState),
      totalCoast: getTotalCoast(newProductsState),
    });
  };

  const lastProductIndex = currentPage * productsPerPage;
  const firstProductIndex = lastProductIndex - productsPerPage;
  const currentProducts = cartProducts.slice(
    firstProductIndex,
    lastProductIndex
  );

  return (
    <section className='cart'>
      <h1>Cart</h1>
      <div className='cart__pagination'>
        <Pagination
          itemCount={cartProducts.length}
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
          <span>SUM$</span>
        </li>
        {currentProducts.map(({ id, count, price, data }) => (
          <li className='cart__item' key={data.id}>
            <div>
              <Product {...data} />
            </div>
            <div className='cart__counter'>
              <button className='cart__btn' onClick={incrementHendler(id)}>
                {data.id === idWithError && (
                  <span className='cart__error-message'>
                    The maximum count of goods {data.stock}pcs
                  </span>
                )}
                +
              </button>
              <span className='cart__count'>{count}</span>
              <button className='cart__btn' onClick={decrementHendler(id)}>
                -
              </button>
              <button className='cart__btn' onClick={removeProductHandler(id)}>
                Remove
              </button>
            </div>
            <span>SUM: ${price * count}</span>
          </li>
        ))}
      </ul>
      <section className='cart__summary'>
        <Summary {...cartSummary} modalShow={modalShow} />
      </section>
      {modal && <Modal modalClose={modalClose} />}
    </section>
  );
};

export default CartPage;
