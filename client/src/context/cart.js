// CartContext.js
import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Load cart items from local storage on component mount
    const savedCartItems = localStorage.getItem('cartItems');
    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems));
    }
  }, []);

  useEffect(() => {
    // Save cart items to local storage whenever cartItems change
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    const existingItem = cartItems.find((item) => item._id === product._id);
    if (existingItem) {
      const updatedCartItems = cartItems.map((item) =>
        item._id === product._id ? { ...item, itemCounts: item.itemCounts + 1 } : item
      );
      setCartItems(updatedCartItems);
    } else {
      setCartItems([...cartItems, { ...product, itemCounts: 1 }]);
    }
  };

  const changeQuantity = (productId, itemCounts) => {
    const updatedCartItems = cartItems.map((item) =>
      item._id === productId ? { ...item, itemCounts } : item
    );
    setCartItems(updatedCartItems);
  };

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.itemCounts,
    0
  );

  const totalItems = cartItems.reduce(
    (total, item) => total + item.itemCounts,
    0
  );

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addToCart, changeQuantity, totalAmount, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};
