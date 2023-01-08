import React from 'react';
import cartImg from './cart.png';
import shopImg from './shop.png';
import './header.css';

const Header = () => {
  return (
    <div>
      <>
        <img src={shopImg} alt='shopImg' className='header_imgs' />
      </>
      <span>count:</span>
      <img src={cartImg} alt='cartImg' className='header_imgs' />
    </div>
  );
};

export default Header;
