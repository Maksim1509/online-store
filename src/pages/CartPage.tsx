import { useContext } from 'react';
import Product from '../components/Product/Product';
import { Context } from '../context/Context';

const CartPage = () => {
  const { cart } = useContext(Context);
  return (
    <>
      <h1>Cart</h1>
      {cart.map((product) => (
        <Product key={product.id} {...product} />
      ))}
    </>
  );
};

export default CartPage;
