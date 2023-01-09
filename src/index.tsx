import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { HashRouter } from 'react-router-dom';
import ContextState from './context/Context';
import Header from './components/Header/Header';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <HashRouter>
      <ContextState>
        <Header />
        <App />
      </ContextState>
    </HashRouter>
  </React.StrictMode>
);
