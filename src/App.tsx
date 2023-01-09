import { Route, Routes } from 'react-router-dom';
import CartPage from './pages/CartPage/CartPage';
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
