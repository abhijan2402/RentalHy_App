// localization/index.js
import LocalizedStrings from 'react-native-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './en';
import hi from './hi';

const strings = new LocalizedStrings({en, hi});

export const LANGUAGE_KEY = 'APP_LANGUAGE';

// Function to load saved language or use default (en)
export const loadLanguage = async () => {
  try {
    const savedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (savedLang) {
      strings.setLanguage(savedLang);
    } else {
      strings.setLanguage('en');
    }
  } catch (e) {
    console.error('Failed to load language:', e);
    strings.setLanguage('en');
  }
};

// Function to change language
export const setLanguage = async lang => {
  try {
    strings.setLanguage(lang);
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  } catch (e) {
    console.error('Failed to save language:', e);
  }
};

export default strings;
