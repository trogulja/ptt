<template>
  <div class="d-flex text-center flex-column flex-md-row flex-grow-1">
    <v-sheet class="layout-side mx-auto mx-md-0 d-none d-md-flex flex-md-column justify-space-between px-2">
      <div class="mt-3 mt-md-10 pa-2">
        <div class="display-2 font-weight-bold grey--text text--lighten-4">
          {{ product.shortname | uppercase }}
        </div>
        <div class="my-2">{{ $t('login.subtitle') }}</div>

        <v-btn>
          <toolbar-language show-arrow />
        </v-btn>
      </div>
      <img :src="require('@/assets/super-corgi.svg')" alt="">
    </v-sheet>

    <div class="pa-2 pa-md-4 flex-grow-1 align-center justify-center d-flex flex-column">
      <div class="layout-content ma-auto w-full">
        <slot />
      </div>
      <div class="overline mt-4">{{ product.name }} - {{ product.version }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ToolbarLanguage from '../components/toolbar/ToolbarLanguage';

export default {
  components: {
    ToolbarLanguage,
  },

  computed: {
    ...mapState(['product']),
  },
};
</script>

<style scoped>
.layout-side {
  background-color: #00aeef;
  width: 420px;
}

.layout-content {
  max-width: 480px;
}
</style>
