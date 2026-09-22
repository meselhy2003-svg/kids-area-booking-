import React, { useState, useEffect } from 'react';
import MobileHeader from './components/MobileHeader';
import MobileBottomNav from './components/MobileBottomNav';
import MobileHomePage from './components/MobileHomePage';
import KidsAreaPage from './components/KidsAreaPage';
import MobileFunParkPage from './components/MobileFunParkPage';
import MobileChallengePage from './components/MobileChallengePage';
import MobileAdventurePage from './components/MobileAdventurePage';
import MobilePackagePage from './components/MobilePackagePage';
import MobileModals from './components/MobileModals';
import './components/MobilePlayZone.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'kids-area' | 'fun-park' | 'challenge' | 'adventure' | 'package'
  const [lang, setLang] = useState('en');
  const [modal, setModal] = useState({ isOpen: false, type: null, data: null });

  // Update HTML title & RTL
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.title = lang === 'ar' 
      ? 'بلاي زون أمريكان دريم - منطقة الأطفال والمرح' 
      : 'PLAY ZONE - American Dream Ismailia';
  }, [lang]);

  // Global listener for attraction booking
  useEffect(() => {
    const handleAttrBooking = (e) => {
      const item = e.detail;
      openModal('booking', {
        name: item?.titleEn || 'Attraction Pass',
        price: '50 EGP',
        priceNum: 50,
        discount: 'Zone Entry',
        details: item?.desc || 'General entry to attraction'
      });
    };
    window.addEventListener('open-booking-for', handleAttrBooking);
    return () => window.removeEventListener('open-booking-for', handleAttrBooking);
  }, []);

  const openModal = (type, data = null) => {
    setModal({ isOpen: true, type, data });
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: null, data: null });
  };

  return (
    <div className="mobile-app-shell">
      {/* Top Mobile Header */}
      <MobileHeader 
        setActiveTab={setActiveTab}
        onOpenMenu={() => openModal('menu-drawer')}
        onOpenProfile={() => openModal('profile')}
        lang={lang}
      />

      {/* Main Page Views */}
      <main style={{ flex: 1 }}>
        {(activeTab === 'home' || activeTab === 'lobby') && (
          <MobileHomePage 
            setActiveTab={setActiveTab}
            openModal={openModal}
            lang={lang}
          />
        )}

        {activeTab === 'kids-area' && (
          <KidsAreaPage 
            setActiveTab={setActiveTab}
            openModal={openModal}
            lang={lang}
          />
        )}

        {activeTab === 'fun-park' && (
          <MobileFunParkPage 
            setActiveTab={setActiveTab}
            openModal={openModal}
            lang={lang}
          />
        )}

        {activeTab === 'challenge' && (
          <MobileChallengePage 
            setActiveTab={setActiveTab}
            openModal={openModal}
            lang={lang}
          />
        )}

        {activeTab === 'adventure' && (
          <MobileAdventurePage 
            setActiveTab={setActiveTab}
            openModal={openModal}
            lang={lang}
          />
        )}

        {activeTab === 'package' && (
          <MobilePackagePage 
            setActiveTab={setActiveTab}
            openModal={openModal}
            lang={lang}
          />
        )}
      </main>

      {/* Fixed Curved Dock Bottom Navigation */}
      <MobileBottomNav 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openModal={openModal}
      />

      {/* Global Interactive Modals & Drawers */}
      {modal.isOpen && (
        <MobileModals 
          modalType={modal.type}
          modalData={modal.data}
          closeModal={closeModal}
          setActiveTab={setActiveTab}
          lang={lang}
          setLang={setLang}
        />
      )}
    </div>
  );
}
