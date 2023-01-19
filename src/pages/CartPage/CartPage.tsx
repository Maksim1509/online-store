import { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Pagination from './Pagination/Pagination';
import Product from '../../components/Product/Product';
import Summary from './Summary/Summary';
import { cartContext, ICartState } from '../../context/CartState';
import './cart.css';
import Modal from '../../components/Modal/Modal';
import { modalContext } from '../../context/ModalState';
import { PagParams, setQueryString } from '../../utils';

const getTotalCount = (state: ICartState[]): number =>
  state.reduce((acc, { count }) => acc + count, 0);

const getTotalCoast = (state: ICartState[]): number =>
  state.reduce((acc, { count, price }) => {
    const sum = count * price;
    return acc + sum;
  }, 0);

const getLocalStorageData = (key: string, def: number): number =>
  localStorage[key] ? JSON.parse(localStorage[key]) : def;

const CartPage = () => {
  const { cartProducts, updateCart, cartSummary, updateCartSummary } =
    useContext(cartContext);
  const { modal, showModal } = useContext(modalContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentPageStorage = getLocalStorageData('currentPage', 1);
  const productsPerPageStorage = getLocalStorageData('productsPerPage', 3);

  const productsPerPageInit = searchParams.get('productsPerPage')
    ? Number(searchParams.get('productsPerPage'))
    : productsPerPageStorage;

  const pageInit = searchParams.get('page')
    ? Number(searchParams.get('page'))
    : currentPageStorage;

  const [productsPerPage, setProductsPerPage] = useState(productsPerPageInit);
  const [currentPage, setCurrentPage] = useState(pageInit);
  const [idWithError, setIdWithError] = useState<null | number>(null);
  const [pageCount, setPageCount] = useState(
    Math.ceil(cartProducts.length / productsPerPage)
  );

  useEffect(() => {
    if (currentPage > pageCount) {
      setQueryString(
        searchParams,
        PagParams.page,
        pageCount,
        productsPerPage,
        navigate
      );
      setCurrentPage(pageCount);
    }
  }, [productsPerPage, currentPage, pageCount, navigate, searchParams]);

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

  const renderCartList = (products: ICartState[]) =>
    products.map(({ id, count, price, data }, orderNumber) => (
      <li className='cart__item' key={data.id}>
        <div className='cart__product'>
          <b className='cart__product-order'>{orderNumber + 1}</b>{' '}
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
    ));

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
        {renderCartList(currentProducts)}
      </ul>
      <section className='cart__summary'>
        {cartProducts.length ? (
          <Summary {...cartSummary} modalShow={showModal} />
        ) : (
          <h2>Cart is Empty</h2>
        )}
      </section>
      {modal && <Modal />}
    </section>
  );
};

export default CartPage;
