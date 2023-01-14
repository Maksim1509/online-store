import { useState } from 'react';
import Product from '../../components/Product/Product';
import data from '../../data/data.json';
import { IProduct } from '../../types';
import Filter from './components/Filter';
import './mainPage.css';

const productsData = data.products;

const MainPage = () => {
  const [products, setProducts] = useState(productsData);
  const renderProducts = (data: IProduct[]) =>
    data.map((item) => <Product key={item.id} {...item} />);

  return (
    <section className='main'>
      <section className='main__products'>{renderProducts(products)}</section>
      <aside className='main__filters'>
        <Filter
          {...{
            products,
            setProducts,
            productsData,
          }}
        />
      </aside>
    </section>
  );
};

export default MainPage;
