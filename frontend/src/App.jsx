import React, { useLayoutEffect, useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import AdminRoot from './pages/Admin/AdminRoot'; 

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/') {
      setCurrentPage('home');
    }else if (path === '/admin') {
      setCurrentPage('admin');
    } else {
      setCurrentPage('home');
    }

    const handlePopState = () => {
      const currentPath = window.location.pathname;
      if (currentPath === '/admin') setCurrentPage('admin');
      else if (currentPath === '/products') setCurrentPage('products');
      else setCurrentPage('home');
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
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

  const isAdmin = currentPage === 'admin';

  return (
    <div className={`app-wrapper ${isAdmin ? 'admin-mode' : ''}`}>
      {!isAdmin && <Header currentPage={currentPage} setCurrentPage={setCurrentPage} cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} />}
      
      {isAdmin ? (
        <AdminRoot />
      ) : (
        <div key={currentPage} className="page-transition">
          {currentPage === 'home' ? (
            <Home setCurrentPage={setCurrentPage} />
          ) : (
            <Products addToCart={addToCart} />
          )}
        </div>
      )}
      
      {!isAdmin && <Footer setCurrentPage={setCurrentPage} />}
    </div>
  );
}