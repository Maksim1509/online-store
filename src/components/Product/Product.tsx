import { IProduct } from '../../types';
import './product.css';

const Product = (data: IProduct) => {
  return (
    <section className='product'>
      <h3>Category: {data.category}</h3>
      <h3>{data.title}</h3>
      <span>Price: {data.price}</span>
      <p>{data.description}</p>
      <span>Stok: {data.stock}</span>
      <img className='product__img' src={data.images[0]} alt={data.title} />
    </section>
  );
};

export default Product;
