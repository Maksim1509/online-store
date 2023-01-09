import React, { createContext, useState } from 'react';
import { IProduct } from '../types';

export interface IContext {
  cart: IProduct[];
  updateCart: (data: IProduct[]) => void;
}

const localContext: IProduct[] = localStorage.cartData
  ? JSON.parse(localStorage.cartData)
  : [];

const context: IContext = {
  cart: localContext,
  updateCart: (data: IProduct[]) => {
    console.log(data);
  },
};

export const Context = createContext<IContext>(context);

const ContextState = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState(context.cart);
  const updateCart = (data: IProduct[]) => {
    localStorage.cartData = JSON.stringify(data);
    setCart(data);
  };

  return (
    <Context.Provider value={{ cart, updateCart }}>{children}</Context.Provider>
  );
};

export default ContextState;
