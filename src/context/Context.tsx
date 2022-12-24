import React, { createContext, useState } from 'react';
import { IProduct } from '../types';

export interface IContext {
  cart: IProduct[];
  add: (data: IProduct) => void;
}

const localContext: IProduct[] = localStorage.cartData
  ? JSON.parse(localStorage.cartData)
  : [];

const context: IContext = {
  cart: localContext,
  add: (data: IProduct) => {
    console.log(data);
  },
};

export const Context = createContext<IContext>(context);

const ContextState = ({ children }: { children: React.ReactNode }) => {
  const [cart, addToCart] = useState(context.cart);
  const add = (data: IProduct) => {
    localStorage.cartData = JSON.stringify([...cart, data]);
    addToCart([...cart, data]);
  };

  return <Context.Provider value={{ cart, add }}>{children}</Context.Provider>;
};

export default ContextState;
