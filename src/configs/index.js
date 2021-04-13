import locales from './locales';
import theme from './theme';
import navigation from './navigation';
import toolbar from './toolbar';
import productive from './productive';

export default {
  product: {
    shortname: process.env.VUE_APP_SHORTNAME,
    name: process.env.VUE_APP_TITLE,
    version: process.env.VUE_APP_VERSION.toString(),
  },
  locales,
  theme,
  navigation,
  toolbar,
  productive,
};
