import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';

// Preference label map for display chips
const PREF_LABELS = {
  sweet:   'Sweet Treats',
  savory:  'Savory Meals',
  seafood: 'Seafood',
  meat:    'Contains Meat',
};

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
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveCategory(e.target.id); }),
      { rootMargin: '-10% 0px -60% 0px', threshold: 0 }
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

  // ── CATEGORIES ──────────────────────────────────────────────────────────
  const categories = ['cold-beverages', 'breakfast', 'sandwiches', 'pastries'];
  const categoryTitles = {
    'cold-beverages': 'Cold Beverages & Frappes',
    'breakfast':      'Breakfast Plates & Omelettes',
    'sandwiches':     'Sandwiches & Flatbreads',
    'pastries':       'Pastries, Cookies & Cakes',
  };

  const totalVisible = filteredProducts.length;

  // ── LOADING STATE ────────────────────────────────────────────────────────
  if (loading) return (
    <div className="container" style={{ minHeight: '100vh', paddingTop: '100px' }}>
      <div className="products-loading">
        <div className="loader-ring" />
        <p>Loading Clover Menu</p>
      </div>
    </div>
  );

  return (
    <div className="container" style={{ marginTop: '30px', width: '100%', maxWidth: '1100px' }}>
      <div className="product-page-layout">

        {/* ── SIDEBAR ──────────────────────────────────────────────────── */}
        <aside className="sidebar">

          {/* Category nav */}
          <section className="filter-group">
            <ul>
              {categories.map(cat => {
                // Keep counts relative to what the DB returned
                const count = products.filter(p => p.category === cat).length;
                return (
                  <li key={cat}>
                    <a
                      href={`#${cat}`}
                      className={activeCategory === cat ? 'is-active' : ''}
                      onClick={e => handleScrollToSection(e, cat)}
                    >
                      <span>{categoryTitles[cat]}</span>
                      <span className="nav-count">{count}</span>
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
              {Object.entries(PREF_LABELS).map(([key, label]) => (
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

          {/* Results + active filter chips */}
          <div className="catalog-summary-bar">
            <p className="result-count" style={{ margin: 0 }}>
              <span>{totalVisible}</span> item{totalVisible !== 1 ? 's' : ''} available
            </p>

            {selectedPrefs.length > 0 && (
              <div className="active-filters">
                {selectedPrefs.map(p => (
                  <button key={p} className="filter-chip" onClick={() => removePref(p)}>
                    {PREF_LABELS[p]}
                    <span className="chip-x" aria-hidden="true">×</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category sections */}
          {totalVisible > 0 ? (
            categories.map(category => {
              const items = filteredProducts.filter(p => p.category === category);
              if (items.length === 0) return null;

              return (
                <section key={category} id={category} className="product-category">
                  <div className="category-header">
                    <h2>{categoryTitles[category]}</h2>
                    <span className="category-count">{items.length} items</span>
                  </div>
                  <div className="product-grid">
                    {items.map(product => {
                      const isAdded = !!addedCards[product.id];
                      const tags = (product.preferences || []).slice(0, 2);
                      return (
                        <article key={product.id} className="product-card">
                          <div className="card-img-wrap">
                            <img src={`/${product.image}`} alt={product.name} />
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
                                    {PREF_LABELS[t] || t}
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
  );
}