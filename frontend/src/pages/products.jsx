import React, { useState, useEffect } from 'react';

export default function Products({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [selectedPrefs, setSelectedPrefs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error connecting to backend database API:", err);
        setLoading(false);
      });
  }, []);

  const handleCheckboxChange = (pref) => {
    if (selectedPrefs.includes(pref)) {
      setSelectedPrefs(selectedPrefs.filter(p => p !== pref));
    } else {
      setSelectedPrefs([...selectedPrefs, pref]);
    }
  };

  const filteredProducts = products.filter(product => {
    if (selectedPrefs.length === 0) return true;
    return selectedPrefs.every(pref => product.preferences.includes(pref));
  });

  // Strict hardcoded categories to ensure order match
  const categories = ['cold-beverages', 'breakfast', 'sandwiches', 'pastries'];
  const categoryTitles = {
    'cold-beverages': 'Cold Beverages & Frappes',
    'breakfast': 'Breakfast Plates & Omelettes',
    'sandwiches': 'Sandwiches & Flatbreads',
    'pastries': 'Pastries, Cookies & Cakes'
  };

  if (loading) return <div className="container"><p style={{ padding: '100px 0', textAlign: 'center' }}>Loading Clover Menu...</p></div>;

  return (
    <div className="container" style={{ marginTop: '30px' }}>
      <div className="product-page-layout">
        
        {/* SIDEBAR — Restored Menu Jump Links & Promo Card */}
        <aside className="sidebar">
          <section className="filter-group">
            <ul>
              {categories.map(cat => (
                <li key={cat}>
                  <a href={`#${cat}`} onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(cat)?.scrollIntoView({ behavior: 'smooth' });
                  }}>{categoryTitles[cat]}</a>
                </li>
              ))}
            </ul>
          </section>

          <section className="filter-group">
            <h3>Filter by Preference</h3>
            <form onSubmit={e => e.preventDefault()}>
              <div>
                <input type="checkbox" id="sweet" checked={selectedPrefs.includes('sweet')} onChange={() => handleCheckboxChange('sweet')} />
                <label htmlFor="sweet" style={{ marginLeft: '6px' }}>Sweet Treats</label>
              </div>
              <div>
                <input type="checkbox" id="savory" checked={selectedPrefs.includes('savory')} onChange={() => handleCheckboxChange('savory')} />
                <label htmlFor="savory" style={{ marginLeft: '6px' }}>Savory Meals</label>
              </div>
              <div>
                <input type="checkbox" id="seafood" checked={selectedPrefs.includes('seafood')} onChange={() => handleCheckboxChange('seafood')} />
                <label htmlFor="seafood" style={{ marginLeft: '6px' }}>Seafood (Salmon / Tuna)</label>
              </div>
              <div>
                <input type="checkbox" id="meat" checked={selectedPrefs.includes('meat')} onChange={() => handleCheckboxChange('meat')} />
                <label htmlFor="meat" style={{ marginLeft: '6px' }}>Contains Meat (Bacon / Sausage / Ham)</label>
              </div>
            </form>
          </section>

          <div className="promo-banner">
            <h4>Featured Dessert</h4>
            <img src="/images/Torched-Classic-Cheesecake-3-600x600.jpg" alt="Torched Classic Cheesecake" />
            <p>Try our new Torched Classic Cheesecake!</p>
            <a href="#pastries" onClick={(e) => {
              e.preventDefault();
              document.getElementById('pastries')?.scrollIntoView({ behavior: 'smooth' });
            }}>Order Now</a>
          </div>
        </aside>

        {/* CATALOG GRID */}
        <main className="product-catalog">
          {categories.map(category => {
            const categoryProducts = filteredProducts.filter(p => p.category === category);
            if (categoryProducts.length === 0) return null;

            return (
              <section key={category} id={category} className="product-category">
                <h2>{categoryTitles[category]}</h2>
                <div className="product-grid">
                  {categoryProducts.map(product => (
                    <article key={product.id} className="product-card">
                      <img src={`/${product.image}`} alt={product.name} />
                      <h3>{product.name}</h3>
                      <p className="price">₱{product.price.toFixed(2)}</p>
                      <button onClick={() => addToCart(product)}>Add to Cart</button>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </main>

      </div>
    </div>
  );
}