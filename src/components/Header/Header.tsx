import { useContext } from 'react';
import cartImg from './cart.png';
import shopImg from './shop.png';
import './header.css';
import { Link } from 'react-router-dom';
import { Context } from '../../context/Context';

const Header = () => {
  const {
    cartSummary: { total, count },
  } = useContext(Context);

  return (
    <div className='header'>
      <Link to={'/'} className='header__link'>
        <img src={shopImg} alt='shopImg' className='header_imgs' />
        <span>ONLINE STORE</span>
      </Link>
      <span>Cart total: ${total}</span>
      <Link to={'/cart'} className='header__link-cart'>
        <span className='header__count'>{count}</span>
        <img src={cartImg} alt='cartImg' className='header_imgs' />
      </Link>
    </div>
  );
};

export default Header;
