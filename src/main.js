import Vue from 'vue';
import App from './App.vue';

// VUEX - https://vuex.vuejs.org/
import store from './store';

// VUE-ROUTER - https://router.vuejs.org/
import router from './router';

// PLUGINS
import vuetify from './plugins/vuetify';
import i18n from './plugins/vue-i18n';

// FILTERS
import './filters/uppercase'

// STYLINGS
import './assets/scss/theme.scss';

// Set this to false to prevent the production tip on Vue startup.
Vue.config.productionTip = false;

export default new Vue({
  i18n,
  vuetify,
  router,
  store,
  render: h => h(App),
}).$mount('#app');
