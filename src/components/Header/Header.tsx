import React from 'react';
import cartImg from './cart.png';
import shopImg from './shop.png';
import './header.css';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className='header'>
      <>
        <Link to={'/'}>
          <img src={shopImg} alt='shopImg' className='header_imgs' />
          <span>ONLINE SHOP</span>
        </Link>
      </>
      <span>Cart total:</span>
      <>
        <Link to={'/cart'}>
          <img src={cartImg} alt='cartImg' className='header_imgs' />
          <span>count</span>
        </Link>
      </>
    </div>
  );
};

export default Header;
