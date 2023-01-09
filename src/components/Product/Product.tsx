import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../../context/Context';
import { IProduct } from '../../types';
import './product.css';

const Product = (data: IProduct) => {
  const { cart, updateCart, cartSummary, updateCartSummary } =
    useContext(Context);
  const addToCardHendler =
    (data: IProduct) => (event: { preventDefault: () => void }) => {
      event.preventDefault();
      const isAdded = cart.filter(({ id }) => id === data.id).length;
      if (isAdded) {
        console.log('Product already added to the Cart');
        return;
      }
      updateCartSummary({
        total: cartSummary.total + data.price,
        count: cartSummary.count + 1,
      });
      updateCart([...cart, data]);
    };

  return (
    <Link to={`/product/${data.id}`} target='_blank'>
      <section className='product'>
        <h3>Category: {data.category}</h3>
        <h3>{data.title}</h3>
        <span>Price: {data.price}</span>
        <p>{data.description}</p>
        <span>Stok: {data.stock}</span>
        <img className='product__img' src={data.images[0]} alt={data.title} />
        <button className='addBtn' onClick={addToCardHendler(data)}>
          Add to cart
        </button>
      </section>
    </Link>
  );
};

export default Product;
