import React, { useLayoutEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/products';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState([]);

  useLayoutEffect(() => {
    // 1. Temporarily disable CSS smooth scrolling
    document.documentElement.style.scrollBehavior = 'auto';
    
    // 2. Instantly jump to the top
    window.scrollTo(0, 0);
    
    // 3. Restore CSS smooth scrolling for normal page usage
    document.documentElement.style.scrollBehavior = '';

    // Prevent stale hashes from previous section/category jumps affecting next render.
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, [currentPage]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="app-wrapper">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      {/* The key={currentPage} forces React to mount a fresh div on every page switch.
        This automatically retriggers the CSS animation we will add next. 
      */}
      <div key={currentPage} className="page-transition">
        {currentPage === 'home' ? (
          <Home setCurrentPage={setCurrentPage} />
        ) : (
          <Products addToCart={addToCart} />
        )}
      </div>
      
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}