import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartContext } from '../../context/CartState';
import { IProduct } from '../../types';
import './product.css';

const Product = (data: IProduct) => {
  const navigate = useNavigate();
  const { cartProducts, cartSummary, updateCart, updateCartSummary } =
    useContext(cartContext);

  const isAdded: number = cartProducts.filter(
    ({ id }) => id === data.id
  ).length;

  const linkProductHendler = (id: number) => () => {
    navigate(`product/${id}`);
  };

  const addToCardHendler = (data: IProduct) => (e: React.MouseEvent) => {
    e.stopPropagation();
    updateCartSummary({
      productsCount: cartSummary.productsCount + 1,
      totalCoast: cartSummary.totalCoast + data.price,
    });
    updateCart([
      ...cartProducts,
      { id: data.id, count: 1, price: data.price, data },
    ]);
  };

  const dropFromCardHendler = (data: IProduct) => (e: React.MouseEvent) => {
    e.stopPropagation();
    const newCartProducts = cartProducts.filter(({ id }) => id !== data.id);
    updateCartSummary({
      totalCoast: cartSummary.totalCoast - data.price,
      productsCount: cartSummary.productsCount - 1,
    });
    updateCart(newCartProducts);
  };

  return (
    <section className='product' onClick={linkProductHendler(data.id)}>
      <h3>Category: {data.category}</h3>
      <h3>{data.title}</h3>
      <span>Price: ${data.price}</span>
      <p>{data.description}</p>
      <span>Stok: {data.stock}</span>
      <img className='product__img' src={data.images[0]} alt={data.title} />
      {isAdded ? (
        <button className='removeBtn' onClick={dropFromCardHendler(data)}>
          Drop from cart
        </button>
      ) : (
        <button className='addBtn' onClick={addToCardHendler(data)}>
          Add to cart
        </button>
      )}
    </section>
  );
};

export default Product;
