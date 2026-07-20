const dictionaries = {
  en: () => import('../dictionaries/en.json').then((module) => module.default),
  ge: () => import('../dictionaries/ge.json').then((module) => module.default),
  ru: () => import('../dictionaries/ru.json').then((module) => module.default),
};

export type Locale = 'en' | 'ge' | 'ru';

export const getDictionary = async (locale: Locale) => {
  if (dictionaries[locale]) {
    return dictionaries[locale]();
  }
  return dictionaries['en']();
};
