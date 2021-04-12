<template>
  <v-app>
    <component :is="currentLayout" v-if="isRouterLoaded">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </component>

    <v-snackbar v-model="toast.show" :timeout="toast.timeout" :color="toast.color" bottom>
      {{ toast.message }}
      <v-btn v-if="toast.timeout === 0" color="white" text @click="toast.show = false">{{ $t('common.close') }}</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import defaultLayout from './layouts/DefaultLayout';
import authLayout from './layouts/AuthLayout';
import { mapActions, mapState } from 'vuex';

export default {
  components: {
    defaultLayout,
    authLayout,
  },

  computed: {
    ...mapState(['toast']),
    isRouterLoaded: function() {
      if (this.$route.name !== null) return true;
      return false;
    },
    currentLayout: function() {
      const layout = this.$route.meta.layout || 'default';
      return `${layout}Layout`;
    },
  },

  beforeCreate: function() {},

  methods: {},
};
</script>
