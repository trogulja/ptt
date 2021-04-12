import locales from './locales';
import theme from './theme';

export default {
  product: {
    shortname: process.env.VUE_APP_SHORTNAME,
    name: process.env.VUE_APP_TITLE,
    version: process.env.VUE_APP_VERSION.toString(),
  },
  locales,
  theme,
};
