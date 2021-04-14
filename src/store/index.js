import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import configs from '@/configs';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';

const { product, theme } = configs;
const { globalTheme, menuTheme, toolbarTheme, isToolbarDetached, isContentBoxed, isRTL } = theme;
const { token, organizationID } = configs.productive;

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

    // Hardcoded access information
    token,
    organizationID,

    // API data
    person: {
      person_id: 0,
      user_id: 0,
      avatar_url: '',
      email: '',
      first_name: '',
      last_name: '',
    },
    timeEntries: [],
    services: [],
    filterStart: null,
    filterEnd: null,
    timeEntriesUpdated_at: new Date().getTime(),
  },
  actions,
  mutations,
  getters,
});

export default store;
