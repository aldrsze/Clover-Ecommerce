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
import AuthPromptModal from "./components/common/AuthPrompt/AuthPromptModal";
import { useCart } from "./hooks/useCart";
import { Toaster } from "react-hot-toast";

/* ── Device Guard ────────────────────────────────────────────────────────────
   Blocks mobile / tablet users with a full-screen lock screen.
   Checks both viewport width (< 1024px) and user-agent strings.
   ───────────────────────────────────────────────────────────────────────── */
function useDeviceGuard() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 1024 || isMobileAgent();
  });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024 || isMobileAgent());
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}

function isMobileAgent() {
  if (typeof navigator === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(
    navigator.userAgent
  );
}

/* ── Lock Screen Component ──────────────────────────────────────────────── */
function MobileLockScreen() {
  const [debugInfo, setDebugInfo] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    ua: typeof navigator !== "undefined" ? navigator.userAgent : "",
    widthTriggered: typeof window !== "undefined" ? window.innerWidth < 1024 : false,
    agentTriggered: isMobileAgent(),
  });

  useEffect(() => {
    const handleResize = () => {
      setDebugInfo({
        width: window.innerWidth,
        ua: navigator.userAgent,
        widthTriggered: window.innerWidth < 1024,
        agentTriggered: isMobileAgent(),
      });
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // run once on mount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isLocal = typeof window !== "undefined" && (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.startsWith("192.168.")
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
        color: "#fff",
        textAlign: "center",
        padding: "40px 32px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", system-ui, sans-serif',
      }}
    >
      {/* Brand logo */}
      <img
        src="/images/brand/clover-logo.png"
        alt="Clover"
        style={{
          width: 64,
          height: 64,
          objectFit: "contain",
          filter: "brightness(0) invert(1)",
          marginBottom: 32,
          opacity: 0.9,
        }}
      />

      {/* Brand name */}
      <h1
        style={{
          fontSize: 18,
          fontWeight: 900,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          margin: "0 0 40px 0",
          opacity: 0.85,
        }}
      >
        CLOVER
      </h1>

      {/* Icon — monitor illustration using CSS */}
      <div
        style={{
          width: 80,
          height: 56,
          border: "2px solid rgba(255,255,255,0.25)",
          borderRadius: 6,
          position: "relative",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: -14,
            left: "50%",
            transform: "translateX(-50%)",
            width: 24,
            height: 14,
            borderLeft: "2px solid rgba(255,255,255,0.25)",
            borderRight: "2px solid rgba(255,255,255,0.25)",
            borderBottom: "2px solid rgba(255,255,255,0.25)",
            borderRadius: "0 0 4px 4px",
          }}
        />
      </div>

      <div style={{ height: 24 }} />

      {/* Main message */}
      <h2
        style={{
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          margin: "0 0 16px 0",
          lineHeight: 1.3,
          maxWidth: 380,
        }}
      >
        Desktop Experience Only
      </h2>

      <p
        style={{
          fontSize: 14,
          fontWeight: 400,
          color: "rgba(255,255,255,0.55)",
          lineHeight: 1.7,
          maxWidth: 340,
          margin: 0,
        }}
      >
        This experience is optimized for desktop and laptop screens. Please
        visit us on a larger device.
      </p>

      {/* Diagnostics block for local development */}
      {isLocal && (
        <div
          style={{
            marginTop: 40,
            padding: "12px 16px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            fontSize: "12px",
            maxWidth: "400px",
            color: "rgba(255, 255, 255, 0.7)",
            fontFamily: "monospace",
            textAlign: "left",
            lineHeight: "1.5",
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: "6px", color: "#10b981" }}>
            🔧 Dev Diagnostics:
          </div>
          <div>
            • Detected Viewport:{" "}
            <span style={{ color: debugInfo.widthTriggered ? "#f87171" : "#34d399" }}>
              {debugInfo.width}px
            </span>{" "}
            {debugInfo.widthTriggered ? "(Under 1024px limit)" : "(Valid)"}
          </div>
          <div>
            • Mobile/Tablet UA:{" "}
            <span style={{ color: debugInfo.agentTriggered ? "#f87171" : "#34d399" }}>
              {debugInfo.agentTriggered ? "YES" : "NO"}
            </span>
          </div>
          <div style={{ marginTop: "6px", fontSize: "10px", color: "rgba(255,255,255,0.4)", wordBreak: "break-all" }}>
            UA: {debugInfo.ua}
          </div>
        </div>
      )}

      {/* Subtle footer */}
      <span
        style={{
          position: "absolute",
          bottom: 32,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.2)",
        }}
      >
        Minimum 1024px viewport required
      </span>
    </div>
  );
}

export default function App() {
  const isBlocked = useDeviceGuard();

  const [currentPage, setCurrentPage] = useState("home");
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);
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

    const handleRequireAuth = () => {
      setIsAuthPromptOpen(true);
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("require-auth", handleRequireAuth);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("require-auth", handleRequireAuth);
    };
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

  /* ── Mobile block — render lock screen instead of the app ── */
  if (isBlocked) {
    return <MobileLockScreen />;
  }

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
          clearCart={clearCart}
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

      <AuthPromptModal 
        isOpen={isAuthPromptOpen} 
        onClose={() => setIsAuthPromptOpen(false)} 
        setCurrentPage={setCurrentPage} 
      />
    </div>
  );
}
