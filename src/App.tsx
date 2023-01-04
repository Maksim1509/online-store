import { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import ContextState, { Context } from './context/Context';
import CartPage from './pages/CartPage';
import MainPage from './pages/MainPage';
import NoMatchPage from './pages/NoMatchPage';
import ProductPage from './pages/ProductPage';

function App() {
  return (
    <Routes>
      <Route path={'/'} element={<MainPage />} />
      <Route path={'/product/:id'} element={<ProductPage />} />
      <Route path={'/cart'} element={<CartPage />} />
      <Route path={'*'} element={<NoMatchPage />} />
    </Routes>
  );
}

export default App;
