import React from 'react';
import { useParams } from 'react-router-dom';
import Product from '../components/Product/Product';
import data from '../data/data.json';
import { IProduct } from '../types';

const ProductPage = () => {
  const params = useParams();
  const renderProduct = (data: IProduct[]) =>
    data.map((item) => <Product key={item.id} {...item} />);

  console.log('111', renderProduct);

  return (
    <div>
      <h2>Product</h2>
      <section className='product'>{renderProduct(data.products)}</section>
    </div>
  );
};

export default ProductPage;
