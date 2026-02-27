// src/localization/LanguageContext.js
import React, {createContext, useEffect, useState} from 'react';
import strings, {setLanguage as setLangInStorage, loadLanguage} from './index';

export const LanguageContext = createContext();

export const LanguageProvider = ({children}) => {
  const [language, setLanguageState] = useState(strings.getLanguage());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initLang = async () => {
      await loadLanguage();z
      setLanguageState(strings.getLanguage());
      setLoading(false);
    };
    initLang();
  }, []);

  const changeLanguage = async lang => {
    await setLangInStorage(lang);
    setLanguageState(lang); // force re-render
  };

  // if (loading) {
  //   return null; 
  // }

  return (
    <LanguageContext.Provider value={{language, changeLanguage, strings}}>
      {children}
    </LanguageContext.Provider>
  );
};
