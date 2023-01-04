import React from 'react';
import { useParams } from 'react-router-dom';
import Product from '../components/Product/Product';
import data from '../data/data.json';
import { IProduct } from '../types';

const ProductPage = () => {
  const params = useParams();
  const productId = Number(params.id);
  console.log('data', data);
  const renderProduct = (data: IProduct[]) =>
    data
      .filter((item) => item.id === productId)
      .map((item) => <Product key={item.id} {...item} />);

  return (
    <div>
      <h2>Product</h2>
      <section className='product'>{renderProduct(data.products)}</section>
    </div>
  );
};

export default ProductPage;
