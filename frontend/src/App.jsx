import React, { useLayoutEffect, useState, useEffect } from "react";
import Header from "./components/common/Header/Header";
import Footer from "./components/common/Footer/Footer";
import Home from "./pages/Public/HomePage/HomePage";
import Products from "./pages/Public/ProductsPage/ProductsPage";
import AuthPage from "./pages/Public/AuthPage/AuthPage";
import AdminRoot from "./pages/Admin/Components/AdminLayout/AdminLayout";
import FloatingCart from "./components/common/FloatingCart/FloatingCart";
import MyOrdersModal from "./components/common/MyOrders/MyOrdersModal";
import ProfileModal from "./components/common/Profile/ProfileModal";
import { useCart } from "./hooks/useCart";
import { Toaster } from "react-hot-toast";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount } = useCart();

  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/") {
      setCurrentPage("home");
    } else if (path === "/admin") {
      setCurrentPage("admin");
    } else if (path === "/auth") {
      setCurrentPage("auth");
    } else {
      setCurrentPage("home");
    }

    const handlePopState = () => {
      const currentPath = window.location.pathname;
      if (currentPath === "/admin") setCurrentPage("admin");
      else if (currentPath === "/auth") setCurrentPage("auth");
      else if (currentPath === "/products") setCurrentPage("products");
      else setCurrentPage("home");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    if (currentPage === "home") {
      document.body.classList.add("has-snap-scroll");
    } else {
      document.body.classList.remove("has-snap-scroll");
    }

    if (currentPage === "admin") {
      document.body.classList.add("admin-mode-active");
    } else {
      document.body.classList.remove("admin-mode-active");
    }

    return () => {
      document.body.classList.remove("has-snap-scroll");
      document.body.classList.remove("admin-mode-active");
    };
  }, [currentPage]);

  const isAdmin = currentPage === "admin";

  return (
    <div className={`app-wrapper ${isAdmin ? "admin-mode" : ""}`}>
      <Toaster position="top-center" />
      {!isAdmin && currentPage !== "auth" && (
        <Header
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          cartCount={cartCount}
          user={user}
          setUser={setUser}
          setIsCartOpen={setIsCartOpen}
          setIsOrdersModalOpen={setIsOrdersModalOpen}
          setIsProfileModalOpen={setIsProfileModalOpen}
        />
      )}
      {isAdmin ? (
        <AdminRoot />
      ) : currentPage === "auth" ? (
        <AuthPage setCurrentPage={setCurrentPage} setUser={setUser} />
      ) : (
        <div key={currentPage} className="page-transition">
          {currentPage === "home" ? (
            <Home setCurrentPage={setCurrentPage} />
          ) : (
            <Products addToCart={addToCart} setIsCartOpen={setIsCartOpen} />
          )}
        </div>
      )}

      {!isAdmin && currentPage !== "auth" && <Footer setCurrentPage={setCurrentPage} />}

      {currentPage === "products" && (
        <FloatingCart 
          cart={cart}
          cartCount={cartCount}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          clearCart={clearCart}
          isCartOpen={isCartOpen}
          setIsCartOpen={setIsCartOpen}
        />
      )}

      {user && (
        <MyOrdersModal
          isOpen={isOrdersModalOpen}
          onClose={() => setIsOrdersModalOpen(false)}
          user={user}
        />
      )}

      {user && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={user}
          setUser={setUser}
        />
      )}
    </div>
  );
}
