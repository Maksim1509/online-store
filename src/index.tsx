import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { HashRouter } from 'react-router-dom';
import ContextState from './context/CartState';
import Header from './components/Header/Header';
import ModalState from './context/ModalState';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <HashRouter>
      <ModalState>
        <ContextState>
          <Header />
          <App />
        </ContextState>
      </ModalState>
    </HashRouter>
  </React.StrictMode>
);
