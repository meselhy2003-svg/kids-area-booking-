import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, getTranslations } from '../data/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children, initialLang = 'ar' }) {
  const [lang, setLangState] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kids_area_lang');
      if (stored === 'ar' || stored === 'en') return stored;
    }
    return initialLang;
  });

  const setLang = (newLang) => {
    const validLang = newLang === 'en' ? 'en' : 'ar';
    setLangState(validLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kids_area_lang', validLang);
      document.documentElement.dir = validLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = validLang;
      document.title = validLang === 'ar'
        ? 'أمريكان دريم - منطقة الأطفال والمرح بالإسماعيلية'
        : 'American Dream Ismailia - Family Entertainment';
    }
  };

  const toggleLanguage = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
      document.title = lang === 'ar'
        ? 'أمريكان دريم - منطقة الأطفال والمرح بالإسماعيلية'
        : 'American Dream Ismailia - Family Entertainment';
    }
  }, [lang]);

  const t = getTranslations(lang);

  const value = {
    lang,
    setLang,
    toggleLanguage,
    t,
    isArabic: lang === 'ar',
    isEnglish: lang === 'en'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside LanguageProvider
    return {
      lang: 'ar',
      setLang: () => {},
      toggleLanguage: () => {},
      t: translations.ar,
      isArabic: true,
      isEnglish: false
    };
  }
  return context;
}
