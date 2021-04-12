import en from '../translations/en';
import hr from '../translations/hr';

const supported = ['en', 'hr'];
let locale = 'en';

// Get browser default language
try {
  const { 0: browserLang } = navigator.language.split('-');
  if (supported.includes(browserLang)) locale = browserLang;
} catch (error) {
  console.error(error);
}

export default {
  // current locale
  locale,

  // if translation not available, fallback to this
  fallbackLocale: 'en',

  // user can choose these
  availableLocales: [
    {
      code: 'en',
      flag: 'us',
      label: 'English',
      messages: en,
    },
    {
      code: 'hr',
      flag: 'hr',
      label: 'Hrvatski',
      messages: hr,
    },
  ],
};
