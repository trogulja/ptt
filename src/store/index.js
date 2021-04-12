import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import configs from '@/configs';
import actions from './actions';
import mutations from './mutations';

const { product, theme } = configs;
const { globalTheme, menuTheme, toolbarTheme, isToolbarDetached, isContentBoxed, isRTL } = theme;

const store = new Vuex.Store({
  state: {
    product,

    // themes and layout configurations
    globalTheme,
    menuTheme,
    toolbarTheme,
    isToolbarDetached,
    isContentBoxed,
    isRTL,

    // App.vue main toast
    toast: {
      show: false,
      color: 'black',
      message: '',
      timeout: 3000,
    },
  },
  actions,
  mutations,
});

export default store;
