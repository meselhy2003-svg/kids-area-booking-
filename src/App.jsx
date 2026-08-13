import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LobbyHero from './components/LobbyHero';
import MenuSection from './components/MenuSection';
import PlaySection from './components/PlaySection';
import EventsSection from './components/EventsSection';
import Footer from './components/Footer';
import Modals from './components/Modals';

export default function App() {
  const [activeTab, setActiveTab] = useState('lobby');
  const [lang, setLang] = useState('en');
  const [modal, setModal] = useState({ isOpen: false, type: null, data: null });

  // Handle document title & RTL attribute when language changes
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.title = lang === 'ar' ? 'أمريكان دريم الإسماعيلية - مدينة ألعاب الأطفال' : 'American Dream Ismailia - Kids Area & Fun Park';
  }, [lang]);

  const openModal = (type, data = null) => {
    setModal({ isOpen: true, type, data });
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: null, data: null });
  };

  return (
    <div className="app-container">
      {/* Top Header Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        lang={lang} 
        setLang={setLang}
        openNotifications={() => openModal('notifications')}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {activeTab === 'lobby' && (
          <LobbyHero 
            lang={lang} 
            openModal={openModal} 
            setActiveTab={setActiveTab} 
          />
        )}

        {activeTab === 'menu' && (
          <MenuSection 
            lang={lang} 
          />
        )}

        {activeTab === 'play' && (
          <PlaySection 
            lang={lang} 
            openModal={openModal} 
          />
        )}

        {activeTab === 'events' && (
          <EventsSection 
            lang={lang} 
            openModal={openModal} 
          />
        )}
      </main>

      {/* Footer matching reference screenshot */}
      <Footer 
        lang={lang} 
        openModal={openModal} 
      />

      {/* Global Interactive Modals */}
      {modal.isOpen && (
        <Modals 
          modalType={modal.type} 
          modalData={modal.data} 
          closeModal={closeModal} 
          lang={lang} 
        />
      )}
    </div>
  );
}
