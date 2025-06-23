import { useContext } from 'react';
import { TranslationContext } from '../context';
import type { ILanguageOption, TLanguage } from '../types';

export type TTranslationStore = {
  t: (key: string, params?: Record<string, any>) => string;
  currentLocale: TLanguage;
  changeLanguage: (lng: TLanguage) => void;
  languages: ILanguageOption[];
};

export function useTranslation(): TTranslationStore {
  const store = useContext(TranslationContext);

  if (!store) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }

  return {
    t: store.t.bind(store),
    currentLocale: store.currentLocale,
    changeLanguage: (lng: TLanguage) => store.setLanguage(lng),
    languages: store.availableLanguages,
  };
}

