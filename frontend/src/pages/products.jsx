import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { MENU_CATEGORIES, MENU_PREFERENCES, PREF_LABEL } from '../constants/menuConstants';

// Tag colors per preference (using CSS variables from main.css)
const TAG_STYLES = {
  sweet:   { background: '#fff8f0', border: '#f0d9b5', color: '#8a5a00' },
  savory:  { background: '#f0f5ff', border: '#c5d5f5', color: '#2a45a0' },
  seafood: { background: '#f0fbf7', border: '#b5e5d5', color: '#0a6045' },
  meat:    { background: '#fff0f0', border: '#f5c5c5', color: '#a02020' },
};

export default function Products({ addToCart }) {
  const [products, setProducts]           = useState([]);
  const [selectedPrefs, setSelectedPrefs] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [addedCards, setAddedCards]       = useState({});

  useLayoutEffect(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    const scrollTimeout = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.style.scrollBehavior = '';
    }, 50);

    return () => clearTimeout(scrollTimeout);
  }, []);

  // ── FETCH LOGIC ─────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    
    // Dynamically build the query string if checkboxes are ticked
    const queryString = selectedPrefs.length > 0 ? `?preferences=${selectedPrefs.join(',')}` : '';
    
    fetch(`http://localhost:5000/api/products${queryString}`)
      .then(res => res.json())
      .then(data => { 
        // Normalize PostgreSQL column names to match the React UI requirements
        const normalizedData = data.map(item => ({
            ...item,
            id: item.product_id || item.id,
            image: item.image_path || item.image
        }));
        
        setProducts(normalizedData); 
        setLoading(false); 

        // Set first category as active if none set
        if (normalizedData.length > 0) {
          const firstCat = MENU_CATEGORIES.find(catObj => 
            normalizedData.some(p => p.category?.toLowerCase() === catObj.value.toLowerCase())
          );
          if (firstCat) setActiveCategory(firstCat.value);
        }
      })
      .catch(err => { 
        console.error('Error connecting to backend database API:', err); 
        setLoading(false); 
      });
  }, [selectedPrefs]); 

  // ── SCROLL-SPY ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(
      entries => {
        // Find the first intersecting entry (top-most in our case as we observe in order)
        // Or better, use a narrow trigger zone at the top
        entries.forEach(e => { 
          if (e.isIntersecting) {
            setActiveCategory(e.target.id); 
          }
        });
      },
      { 
        // rootMargin: Top Right Bottom Left
        // -96px top to account for sticky header
        // -70% bottom to create a trigger zone in the top 30% of the viewport
        rootMargin: '-96px 0px -70% 0px', 
        threshold: 0 
      }
    );
    document.querySelectorAll('.product-category').forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, [loading, selectedPrefs]);

  // ── SMOOTH SCROLL ───────────────────────────────────────────────────────
  const slowScrollTo = useCallback((targetY, duration = 300) => {
    const startY = window.scrollY;
    const distance = targetY - startY;
    let startTime = null;
    const ease = t => t < 0.5 ? 8*t*t*t*t : 1 - Math.pow(-2*t+2, 4)/2;
    const step = ts => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      window.scrollTo(0, startY + distance * ease(p));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);

  const handleScrollToSection = useCallback((e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      slowScrollTo(el.getBoundingClientRect().top + window.scrollY - 96);
      window.history.pushState(null, '', `#${id}`);
      setActiveCategory(id);
    }
  }, [slowScrollTo]);

  // ── FILTERS ─────────────────────────────────────────────────────────────
  const togglePref = pref =>
    setSelectedPrefs(p => p.includes(pref) ? p.filter(x => x !== pref) : [...p, pref]);

  const removePref = pref => setSelectedPrefs(p => p.filter(x => x !== pref));

  // The backend already filtered the data using PostgreSQL! 
  // We just pass it straight through now.
  const filteredProducts = products;

  // ── ADD TO CART WITH FEEDBACK ────────────────────────────────────────────
  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedCards(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAddedCards(prev => { const n = { ...prev }; delete n[product.id]; return n; }), 1200);
  };

  const totalVisible = filteredProducts.length;

  return (
    <>
      {/* High-end Panel Loader (Initial only) */}
      {loading && products.length === 0 && (
        <div className="products-panel-loader">
          <div className="loader-bar-wrap">
            <div className="loader-bar-fill" />
          </div>
          <p>Loading the Collection</p>
        </div>
      )}

      <div 
        className={`container products-entrance-container ${!loading ? 'is-loaded' : ''}`} 
        style={{ marginTop: '30px', width: '100%', maxWidth: 'var(--container)' }}
      >
        <div className="product-page-layout">

        {/* ── SIDEBAR ──────────────────────────────────────────────────── */}
        <aside className="sidebar">

          {/* Category nav */}
          <section className="filter-group">
            <h3>Categories</h3>
            <ul>
              {MENU_CATEGORIES.map(catObj => {
                const cat = catObj.value;
                // Keep counts relative to what the DB returned
                const count = products.filter(p => p.category === cat).length;
                return (
                  <li key={cat}>
                    <a
                      href={`#${cat}`}
                      className={activeCategory === cat ? 'is-active' : ''}
                      onClick={e => handleScrollToSection(e, cat)}
                    >
                      <span>{catObj.label}</span>
                      <span className="nav-count">{loading ? '...' : count}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Preference filters */}
          <section className="filter-group">
            <h3>Filter by Preference</h3>
            <form onSubmit={e => e.preventDefault()}>
              {MENU_PREFERENCES.map(({ value: key, label }) => (
                <div key={key}>
                  <input
                    type="checkbox"
                    id={key}
                    checked={selectedPrefs.includes(key)}
                    onChange={() => togglePref(key)}
                  />
                  <label htmlFor={key}>{label}</label>
                </div>
              ))}
            </form>
          </section>

          {/* Promo banner */}
          <div className="promo-banner">
            <div className="promo-badge">Specials</div>
            <div className="promo-img-wrap">
              <img
                src="/images/Torched-Classic-Cheesecake-3-600x600.jpg"
                alt="Torched Classic Cheesecake"
              />
            </div>
            
            <div className="promo-content">
              <h4>Featured Dessert</h4>
              <p className="promo-title">Torched Classic Cheesecake</p>
              <p className="promo-desc">Rich, creamy, and torched to perfection.</p>
              <button 
                className="btn-secondary promo-btn"
                onClick={e => handleScrollToSection(e, 'pastries')}
              >
                View in Pastries
              </button>
            </div>
            
          </div>

        </aside>

        {/* ── CATALOG ──────────────────────────────────────────────────── */}
        <main className="main-product-catalog">

          {/* Main Content Header / Premium Catalog Hero */}
          <header className="catalog-header-main">
            <div className="catalog-hero-strip">
              <div className="hero-text-content">
                <span className="catalog-eyebrow">The Collection</span>
                <h1>Artisan Excellence <br /><span>Globally Sourced</span></h1>
                <p className="catalog-description">
                  A curated selection of the world's finest coffee beans, premium pastries, 
                  and savory creations, meticulously crafted for those who appreciate the art of fine flavors.
                </p>
              </div>
              <div className="hero-visual-accent">
                <div className="hero-gallery-mosaic">
                  <div className="mosaic-item item-1 animate-entrance" style={{ animationDelay: '0s' }}>
                    <img src="/images/BIG-BREAKFAST-3.jpg" alt="Artisan Breakfast" loading="eager" />
                    <div className="mosaic-overlay"></div>
                  </div>
                  <div className="mosaic-item item-2 animate-entrance" style={{ animationDelay: '0.1s' }}>
                    <img src="/images/Margherita-Flatbread-600x600-removebg.png" alt="Savory Flatbread" loading="eager" />
                  </div>
                  <div className="mosaic-item item-3 animate-entrance" style={{ animationDelay: '0.15s' }}>
                    <img src="/images/Nutella-Croissant-600x600.jpg" alt="Handcrafted Pastries" loading="eager" />
                  </div>
                  <div className="mosaic-item item-4 animate-entrance" style={{ animationDelay: '0.2s' }}>
                    <img src="/images/QUATTRO-removebg.png" alt="Premium Selections" loading="eager" />
                  </div>
                </div>
              </div>
            </div>

            <div className="catalog-controls">
              <div className="catalog-info-area">
                <p className="result-count">
                  {loading ? 'Discovering flavors...' : (
                    <>Showing <span>{totalVisible}</span> curated items</>
                  )}
                </p>
              </div>

              {selectedPrefs.length > 0 && (
                <div className="active-filters">
                  <span className="filter-label">Refined by:</span>
                  <div className="filter-chips-wrap">
                    {selectedPrefs.map(p => (
                      <button key={p} className="filter-chip" onClick={() => removePref(p)}>
                        {PREF_LABEL[p] || p}
                        <span className="chip-x" aria-hidden="true">×</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </header>

          {/* Category sections or Loading Spinner */}
          {loading ? (
            <div className="products-loading-inline">
              <div className="loader-ring" />
              <p>Refreshing Menu</p>
            </div>
          ) : totalVisible > 0 ? (
            MENU_CATEGORIES.map(catObj => {
              const category = catObj.value;
              const items = filteredProducts.filter(p => 
                p.category?.toLowerCase() === category.toLowerCase()
              );
              if (items.length === 0) return null;

              return (
                <section key={category} id={category} className="product-category">
                  <div className="category-header">
                    <h2>{catObj.label}</h2>
                    <span className="category-count">{items.length} items</span>
                  </div>
                  <div className="product-grid">
                    {items.map(product => {
                      const isAdded = !!addedCards[product.id];
                      const tags = (product.preferences || []).slice(0, 2);
                      return (
                        <article key={product.id} className="product-card">
                          <div className="card-img-wrap">
                            <img 
                              src={product.image?.startsWith('uploads/') ? `http://localhost:5000/${product.image}` : `/${product.image}`} 
                              alt={product.name} 
                            />
                            <button
                              className="quick-add-overlay"
                              onClick={() => handleAddToCart(product)}
                              aria-label={`Quick add ${product.name} to cart`}
                            >
                              {isAdded ? '✓ Added' : '+ Quick Add'}
                            </button>
                          </div>
                          <div className="card-body">
                            {tags.length > 0 && (
                              <div className="card-tags">
                                {tags.map(t => (
                                  <span
                                    key={t}
                                    className="tag"
                                    style={TAG_STYLES[t] ? {
                                      background:  TAG_STYLES[t].background,
                                      borderColor: TAG_STYLES[t].border,
                                      color:       TAG_STYLES[t].color,
                                    } : undefined}
                                  >
                                    {PREF_LABEL[t] || t}
                                  </span>
                                ))}
                              </div>
                            )}
                            <h3>{product.name}</h3>
                            {product.description && (
                              <p className="description">{product.description}</p>
                            )}
                            <div className="card-footer">
                              {/* Safely handle the numeric type parsing */}
                              <span className="price">₱{Number(product.price).toFixed(2)}</span>
                              <button
                                className="add-btn"
                                onClick={() => handleAddToCart(product)}
                                aria-label={`Add ${product.name} to cart`}
                                title="Add to cart"
                              >
                                {isAdded ? '✓' : '+'}
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })
          ) : (
            <div className="empty-catalog">
              <h3>No products found</h3>
              <p>Try adjusting your filters or check back later.</p>
            </div>
          )}

        </main>
      </div>
    </div>
    </>
  );
}