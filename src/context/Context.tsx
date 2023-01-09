import React, { createContext, useState } from 'react';
import { IProduct } from '../types';

type CartSummary = {
  count: number;
  total: number;
};

export interface IContext {
  cart: IProduct[];
  updateCart: (data: IProduct[]) => void;
  cartSummary: CartSummary;
  updateCartSummary: (cartSummary: CartSummary) => void;
}

const localContext: IProduct[] = localStorage.cartData
  ? JSON.parse(localStorage.cartData)
  : [];
const localContextCartSummary: CartSummary = localStorage.cartSummary
  ? JSON.parse(localStorage.cartSummary)
  : { count: 0, total: 0 };

const context: IContext = {
  cart: localContext,
  updateCart: (data: IProduct[]) => {
    console.log(data);
  },
  cartSummary: localContextCartSummary,
  updateCartSummary: (cartSummary: CartSummary) => {
    console.log(cartSummary);
  },
};

export const Context = createContext<IContext>(context);

const ContextState = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState(context.cart);
  const [cartSummary, setCartSummary] = useState(context.cartSummary);
  const updateCart = (data: IProduct[]) => {
    localStorage.cartData = JSON.stringify(data);
    setCart(data);
  };
  const updateCartSummary = (data: CartSummary) => {
    localStorage.cartSummary = JSON.stringify(data);
    setCartSummary(data);
  };

  return (
    <Context.Provider
      value={{
        cart,
        updateCart,
        cartSummary,
        updateCartSummary,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextState;
