import { useContext } from 'react';
import { Context } from '../../context/Context';
import { IProduct } from '../../types';
import './productWithImgs.css';
import React, { useState } from 'react';

const ProductWithImgs = (data: IProduct) => {
  const { cart, updateCart } = useContext(Context);
  const [selectedImage, setSelectedImage] = useState(data.images[0]);

  const addToCardHendler = (data: IProduct) => () => {
    const isAdded = cart.filter(({ id }) => id === data.id).length;
    if (isAdded) {
      console.log('Product already added to the Cart');
      return;
    }
    updateCart([...cart, data]);
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
      <button onClick={addToCardHendler(data)}>Add to cart</button>
    </section>
  );
};

export default ProductWithImgs;
