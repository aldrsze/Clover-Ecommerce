import { useState, useEffect } from "react";

export const useCart = () => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("clover_cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("clover_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product_id === product.product_id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product_id === product.product_id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.product_id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prevCart => prevCart.map(item => 
      item.product_id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount };
};
