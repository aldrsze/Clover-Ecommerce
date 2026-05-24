import React, { useLayoutEffect, useState, useEffect } from 'react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Public/HomePage/HomePage';
import Products from './pages/Public/ProductsPage/ProductsPage';
import AdminRoot from './pages/Admin/AdminRoot'; 
import { useCart } from './hooks/useCart';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const { addToCart, cartCount } = useCart();

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

  useEffect(() => {
    if (currentPage === 'home') {
      document.body.classList.add('has-snap-scroll');
    } else {
      document.body.classList.remove('has-snap-scroll');
    }

    if (currentPage === 'admin') {
      document.body.classList.add('admin-mode-active');
    } else {
      document.body.classList.remove('admin-mode-active');
    }

    return () => {
      document.body.classList.remove('has-snap-scroll');
      document.body.classList.remove('admin-mode-active');
    };
  }, [currentPage]);

  const isAdmin = currentPage === 'admin';

  return (
    <div className={`app-wrapper ${isAdmin ? 'admin-mode' : ''}`}>
      {!isAdmin && <Header currentPage={currentPage} setCurrentPage={setCurrentPage} cartCount={cartCount} />}
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