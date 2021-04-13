import Vuetify from '@/plugins/vuetify';

export default {
  // App.vue main toast
  showToast: (state, toast) => {
    const { color, timeout, message } = toast;

    state.toast = {
      message,
      color,
      timeout,
      show: true,
    };
  },
  hideToast: state => {
    state.toast.show = false;
  },
  resetToast: state => {
    state.toast = {
      show: false,
      color: 'black',
      message: '',
      timeout: 3000,
    };
  },

  // themes and layout configurations
  setGlobalTheme: (state, theme) => {
    Vuetify.framework.theme.dark = theme === 'dark';
    state.globalTheme = theme;
  },
  setRTL: (state, isRTL) => {
    Vuetify.framework.rtl = isRTL;
    state.isRTL = isRTL;
  },
  setContentBoxed: (state, isBoxed) => {
    state.isContentBoxed = isBoxed;
  },
  setMenuTheme: (state, theme) => {
    state.menuTheme = theme;
  },
  setToolbarTheme: (state, theme) => {
    state.toolbarTheme = theme;
  },
  setTimeZone: (state, zone) => {
    state.time.zone = zone;
  },
  setTimeFormat: (state, format) => {
    state.time.format = format;
  },
  setCurrency: (state, currency) => {
    state.currency = currency;
  },
  setToolbarDetached: (state, isDetached) => {
    state.isToolbarDetached = isDetached;
  },

  // Productive
  setPerson: (state, person) => {
    state.person = person;
  },
  setServices: (state, services) => {
    state.services = services;
  },
  setTimeEntries: (state, timeEntries) => {
    state.timeEntries = timeEntries;
  },
};
