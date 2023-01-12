import React, { createContext, useState } from 'react';
import { IProduct } from '../types';

type CartSummary = {
  productsCount: number;
  totalCoast: number;
};

export interface ICartState {
  id: number;
  data: IProduct;
  count: number;
  price: number;
}

export interface IContext {
  cartProducts: ICartState[];
  updateCart: (data: ICartState[]) => void;
  cartSummary: CartSummary;
  updateCartSummary: (cartSummary: CartSummary) => void;
}

const localContext: ICartState[] = localStorage.cartProducts
  ? JSON.parse(localStorage.cartProducts)
  : [];
const localcartSummaryContext: CartSummary = localStorage.cartSummary
  ? JSON.parse(localStorage.cartSummary)
  : { productsCount: 0, totalCoast: 0 };

const context: IContext = {
  cartProducts: localContext,
  updateCart: () => {
    return;
  },
  cartSummary: localcartSummaryContext,
  updateCartSummary: () => {
    return;
  },
};

export const Context = createContext<IContext>(context);

const ContextState = ({ children }: { children: React.ReactNode }) => {
  const [cartProducts, setCartProducts] = useState(context.cartProducts);
  const [cartSummary, setCartSummary] = useState(context.cartSummary);
  const updateCart = (data: ICartState[]) => {
    localStorage.cartProducts = JSON.stringify(data);
    setCartProducts(data);
  };
  const updateCartSummary = (data: CartSummary) => {
    localStorage.cartSummary = JSON.stringify(data);
    setCartSummary(data);
  };

  return (
    <Context.Provider
      value={{
        cartProducts,
        cartSummary,
        updateCart,
        updateCartSummary,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextState;
