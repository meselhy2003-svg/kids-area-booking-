import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Utensils, ShoppingBag, Star, Plus, Minus, Trash2, CheckCircle2 } from 'lucide-react';
import { translations, menuItems } from '../data/content';

export default function MenuSection({ lang }) {
  const t = translations[lang].menuSection;
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const filteredItems = activeCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    setOrderPlaced(true);
    setTimeout(() => {
      setCart([]);
      setOrderPlaced(false);
    }, 4000);
  };

  return (
    <div className="page-section">
      <div className="section-header">
        <h2 className="section-title">
          <Utensils style={{ color: '#ffd15c' }} />
          <span>{t.title}</span>
        </h2>
        <p className="section-subtitle">{t.subtitle}</p>
      </div>

      {/* Category Selector Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        {[
          { key: 'all', label: t.all },
          { key: 'meals', label: t.meals },
          { key: 'drinks', label: t.drinks },
          { key: 'sweets', label: t.sweets }
        ].map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            style={{
              background: activeCategory === cat.key ? 'linear-gradient(135deg, #0c6177, #1693b3)' : 'rgba(255,255,255,0.08)',
              color: 'white',
              border: activeCategory === cat.key ? 'none' : '1px solid rgba(255,255,255,0.15)',
              padding: '0.6rem 1.4rem',
              borderRadius: '30px',
              fontWeight: '700',
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Layout Grid: Menu Items & Cart Drawer */}
      <div style={{ display: 'grid', gridTemplateColumns: cart.length > 0 ? '1fr 340px' : '1fr', gap: '2rem' }}>
        {/* Menu Items Grid */}
        <div className="cards-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="card">
              <div style={{ position: 'relative', width: '100%', height: '180px', borderRadius: '14px', overflow: 'hidden', marginBottom: '1rem' }}>
                <img 
                  src={item.image} 
                  alt={lang === 'en' ? item.nameEn : item.nameAr}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: '4px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px', color: '#ffd15c', fontSize: '0.85rem', fontWeight: '700' }}>
                  <Star size={14} fill="#ffd15c" />
                  <span>{item.rating}</span>
                </div>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.35rem', color: '#ffffff' }}>
                {lang === 'en' ? item.nameEn : item.nameAr}
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '1.25rem', flexGrow: 1 }}>
                {lang === 'en' ? item.descEn : item.descAr}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                <span style={{ fontSize: '1.3rem', fontWeight: '900', color: '#ffd15c' }}>
                  {item.price} <span style={{ fontSize: '0.85rem' }}>EGP</span>
                </span>
                <button className="btn-primary" onClick={() => addToCart(item)}>
                  <Plus size={16} />
                  <span>{t.addToCart}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Cart Panel */}
        {cart.length > 0 && (
          <div style={{ background: '#1e293b', borderRadius: '24px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.15)', height: 'fit-content', sticky: 'top', top: '90px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <ShoppingBag style={{ color: '#1693b3' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>{t.cartTitle}</h3>
            </div>

            {orderPlaced ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#2ecc71' }}>
                <CheckCircle2 size={48} style={{ margin: '0 auto 1rem auto' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Order Submitted!</h4>
                <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Please present your wristband code at the Reception Snack Counter.</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '320px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.04)', padding: '0.75rem', borderRadius: '12px' }}>
                      <div style={{ flexGrow: 1 }}>
                        <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>
                          {lang === 'en' ? item.nameEn : item.nameAr}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#ffd15c', fontWeight: '700' }}>
                          {item.price * item.qty} EGP
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button onClick={() => updateQty(item.id, -1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '24px', height: '24px', borderRadius: '6px', cursor: 'pointer' }}>-</button>
                        <span style={{ fontWeight: '800', fontSize: '0.9rem' }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '24px', height: '24px', borderRadius: '6px', cursor: 'pointer' }}>+</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '900', marginBottom: '1.25rem' }}>
                    <span>Total:</span>
                    <span style={{ color: '#ffd15c' }}>{calculateTotal()} EGP</span>
                  </div>

                  <button className="btn-accent" style={{ width: '100%', justifyContent: 'center' }} onClick={handleCheckout}>
                    {t.checkout}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
