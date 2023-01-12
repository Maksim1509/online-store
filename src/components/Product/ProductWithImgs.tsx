import { useContext } from 'react';
import { Context } from '../../context/Context';
import { IProduct } from '../../types';
import { useState } from 'react';
import './productWithImgs.css';

const ProductWithImgs = (data: IProduct) => {
  const { cartProducts, updateCart, cartSummary, updateCartSummary } =
    useContext(Context);
  const [selectedImage, setSelectedImage] = useState(data.images[0]);

  const isAdded: number = cartProducts.filter(
    ({ id }) => id === data.id
  ).length;

  const addToCardHendler = (data: IProduct) => () => {
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

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  return (
    <section className='productPage'>
      <h3>{`STORE  >>  ${data.category}  >>  ${data.brand}  >>  ${data.title}`}</h3>
      <h3>{data.title}</h3>
      <span>Price: {data.price}</span>
      <p>{data.description}</p>
      <span>Stok: {data.stock}</span>
      <div className='selected-image'>
        <img src={selectedImage} alt={data.title} />
      </div>
      <div className='slider-container'>
        {data.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={data.title}
            onClick={() => handleImageClick(image)}
            className={image === selectedImage ? 'selected' : ''}
          />
        ))}
      </div>
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

export default ProductWithImgs;
