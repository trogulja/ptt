import Vuetify from '@/plugins/vuetify';
import Vue from 'vue';

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
  setFilterStart: (state, start) => {
    state.filterStart = start;
  },
  setFilterEnd: (state, end) => {
    state.filterEnd = end;
  },
  setPerson: (state, person) => {
    state.person = person;
  },
  setServices: (state, services) => {
    state.services = services;
  },
  setTimeEntries: (state, timeEntries) => {
    state.timeEntries = timeEntries;
    state.timeEntriesUpdated_at = new Date().getTime();
  },
  updateTimeEntry: (state, { id, update }) => {
    const entry = state.timeEntries.filter(el => el.id === id);
    const i = state.timeEntries.indexOf(entry[0]);
    console.log({ i });

    for (const key in update) {
      Vue.set(state.timeEntries[i], key, update[key]);
      // state.timeEntries[i][key] = update[key];
    }

    state.timeEntriesUpdated_at = new Date().getTime();
  },
  addTimeEntry: (state, { data }) => {
    const { id } = data;
    const { date, time, started_at, note } = data.attributes;
    const service_id = data.relationships.service.data.id;
    const timeEntry = { id, date, time, started_at, note, service_id };

    state.timeEntries.push(timeEntry);
    state.timeEntriesUpdated_at = new Date().getTime();
  },
};
