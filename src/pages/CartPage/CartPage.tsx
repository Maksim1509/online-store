import { useContext, useState } from 'react';
import Product from '../../components/Product/Product';
import { Context } from '../../context/Context';
import './cart.css';

const CartPage = () => {
  const { cart } = useContext(Context);
  const [products, setProducts] = useState(cart);
  const [idWithError, setIdWithError] = useState<null | number>(null);

  const countStateInit = Object.fromEntries(
    products.map((item) => [item.id, 1])
  );
  const [countState, setCount] = useState(countStateInit);

  const removeProductHandler = (removeId: number) => () => {
    const newProductsState = products.filter(({ id }) => id !== removeId);
    setProducts(newProductsState);
    setCount({ ...countState, [removeId]: 0 });
    localStorage.cartData = JSON.stringify(newProductsState);
  };

  const decrementHendler = (currentId: number) => () => {
    setIdWithError(null);
    const newCount = countState[currentId] - 1;
    if (newCount < 1) {
      setProducts(products.filter(({ id }) => id !== currentId));
      setCount({ ...countState, [currentId]: 0 });
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
  console.log(products);
  console.log(countState);
  return (
    <>
      <h1>Cart</h1>
      <b>
        TOTAL:{' '}
        {products.reduce((acc, item) => {
          const sum = item.price * countState[item.id];
          return acc + sum;
        }, 0)}
      </b>
      <ul className='cart__list'>
        {products.map((product) => (
          <li className='cart__item' key={product.id}>
            <Product {...product} />
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
            <span>SUM: {product.price * countState[product.id]}</span>
          </li>
        ))}
      </ul>
    </>
  );
};

export default CartPage;
