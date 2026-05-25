import React, { useLayoutEffect, useState, useEffect } from "react";
import Header from "./components/common/Header/Header";
import Footer from "./components/common/Footer/Footer";
import Home from "./pages/Public/HomePage/HomePage";
import Products from "./pages/Public/ProductsPage/ProductsPage";
import AuthPage from "./pages/Public/AuthPage/AuthPage";
import AdminRoot from "./pages/Admin/Components/AdminLayout/AdminLayout";
import { useCart } from "./hooks/useCart";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const { addToCart, cartCount } = useCart();

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
      {!isAdmin && currentPage !== "auth" && (
        <Header
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          cartCount={cartCount}
        />
      )}
      {isAdmin ? (
        <AdminRoot />
      ) : currentPage === "auth" ? (
        <AuthPage setCurrentPage={setCurrentPage} />
      ) : (
        <div key={currentPage} className="page-transition">
          {currentPage === "home" ? (
            <Home setCurrentPage={setCurrentPage} />
          ) : (
            <Products addToCart={addToCart} />
          )}
        </div>
      )}

      {!isAdmin && currentPage !== "auth" && <Footer setCurrentPage={setCurrentPage} />}
    </div>
  );
}
