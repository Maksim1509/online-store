import Product from '../components/Product/Product';
import data from '../data/data.json';
import { IProduct } from '../types';

const MainPage = () => {
  const renderProducts = (data: IProduct[]) =>
    data.map((item) => <Product key={item.id} {...item} />);

  return (
    <>
      <h1>Main</h1>
      <section className='main__products'>
        {renderProducts(data.products)}
      </section>
    </>
  );
};

export default MainPage;
