import en from '../dictionaries/en.json';
import ge from '../dictionaries/ge.json';
import ru from '../dictionaries/ru.json';

export type Locale = 'en' | 'ge' | 'ru';

const dictionaries: Record<Locale, any> = {
  en,
  ge,
  ru,
};

export const getDictionarySync = (locale: Locale) => {
  return dictionaries[locale] || dictionaries.en;
};

export const getDictionary = async (locale: Locale) => {
  return getDictionarySync(locale);
};

