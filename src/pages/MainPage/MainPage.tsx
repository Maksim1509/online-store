import Product from '../../components/Product/Product';
import data from '../../data/data.json';
import { IProduct } from '../../types';
import './mainPage.css';

const MainPage = () => {
  const renderProducts = (data: IProduct[]) =>
    data.map((item) => <Product key={item.id} {...item} />);

  return (
    <section className='main__products'>
      <h1 className='main__title'>Main</h1>
      {renderProducts(data.products)}
    </section>
  );
};

export default MainPage;
