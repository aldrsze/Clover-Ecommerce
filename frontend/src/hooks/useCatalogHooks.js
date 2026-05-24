import { useState, useEffect, useCallback, useLayoutEffect } from "react";

// ── SCROLL RESET ────────────────────────────────────────────────────────
export const useScrollReset = () => {
  useLayoutEffect(() => {
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }

    const scrollTimeout = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.style.scrollBehavior = "";
    }, 50);

    return () => clearTimeout(scrollTimeout);
  }, []);
};

// ── CATALOG SCROLL SPY ──────────────────────────────────────────────────
export const useCatalogScrollSpy = (loading, dependencies = []) => {
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActiveCategory(e.target.id);
          }
        });
      },
      {
        rootMargin: "-96px 0px -70% 0px",
        threshold: 0,
      },
    );
    document
      .querySelectorAll(".product-category")
      .forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, ...dependencies]);

  const handleScrollToSection = useCallback((e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `#${id}`);
      setActiveCategory(id);
    }
  }, []);

  return { activeCategory, handleScrollToSection };
};

// ── PRODUCT FILTERS ─────────────────────────────────────────────────────
export const useProductFilters = () => {
  const [selectedPrefs, setSelectedPrefs] = useState([]);

  const togglePref = (pref) =>
    setSelectedPrefs((p) =>
      p.includes(pref) ? p.filter((x) => x !== pref) : [...p, pref],
    );

  const removePref = (pref) =>
    setSelectedPrefs((p) => p.filter((x) => x !== pref));

  return { selectedPrefs, togglePref, removePref };
};

// ── CART FEEDBACK ───────────────────────────────────────────────────────
export const useCartFeedback = (addToCart) => {
  const [addedCards, setAddedCards] = useState({});

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedCards((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(
      () =>
        setAddedCards((prev) => {
          const n = { ...prev };
          delete n[product.id];
          return n;
        }),
      1200,
    );
  };

  return { addedCards, handleAddToCart };
};
