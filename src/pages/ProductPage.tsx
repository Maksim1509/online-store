import { useParams } from 'react-router-dom';
import ProductWithImgs from '../components/Product/ProductWithImgs';
import data from '../data/data.json';
import { IProduct } from '../types';

const ProductPage = () => {
  const params = useParams();
  const productId = Number(params.id);
  const renderProduct = (data: IProduct[]) =>
    data
      .filter((item) => item.id === productId)
      .map((item) => <ProductWithImgs key={item.id} {...item} />);
  return (
    <div>
      <section className='productPage'>{renderProduct(data.products)}</section>
    </div>
  );
};

export default ProductPage;
