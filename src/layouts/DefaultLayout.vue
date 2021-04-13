<template>
  <div class="d-flex flex-grow-1">
    <!-- Navigation -->
    <v-navigation-drawer v-model="drawer" app floating class="elevation-1" :right="$vuetify.rtl" :light="menuTheme === 'light'" :dark="menuTheme === 'dark'">
      <!-- Navigation menu info -->
      <template v-slot:prepend>
        <div class="pa-2">
          <div class="title font-weight-bold text-uppercase primary--text">{{ product.name }}</div>
          <div class="overline grey--text">v{{ product.version }}</div>
        </div>
      </template>

      <!-- Navigation menu -->
      <main-menu :menu="navigation.menu" />

      <!-- Navigation menu footer -->
      <template v-if="navigation.footer.length" v-slot:append>
        <!-- Footer navigation links -->
        <div class="pa-1 text-center">
          <v-btn v-for="(item, index) in navigation.footer" :key="index" :href="item.href" :target="item.target" small text>
            {{ item.key ? $t(item.key) : item.text }}
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Toolbar -->
    <v-app-bar
      app
      :color="isToolbarDetached ? 'surface' : undefined"
      :flat="isToolbarDetached"
      :light="toolbarTheme === 'light'"
      :dark="toolbarTheme === 'dark'"
    >
      <v-card class="flex-grow-1 d-flex" :class="[isToolbarDetached ? 'pa-1 mt-3 mx-1' : 'pa-0 ma-0']" :flat="!isToolbarDetached">
        <div class="d-flex flex-grow-1 align-center">
          <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
          <v-spacer />
          <div>{{ $t('common.hello') }} {{ person.first_name }}!</div>
          <v-spacer />
          <div class="mr-2">
            <toolbar-language :show-label="false" />
          </div>
          <toolbar-user />
        </div>
      </v-card>
    </v-app-bar>

    <v-main>
      <v-container class="fill-height" :fluid="!isContentBoxed">
        <v-layout>
          <slot></slot>
        </v-layout>
      </v-container>

      <v-footer app inset>
        <v-spacer></v-spacer>
        <div class="overline grey--text text--lighten-1">
          made with hopes of landing new job <v-icon class="grey--text text--lighten-1 ml-1" small>mdi-robot-excited-outline</v-icon>
        </div>
      </v-footer>
    </v-main>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { cloneDeep } from 'lodash';

// navigation menu configurations
import config from '../configs';

import MainMenu from '../components/navigation/MainMenu';
import ToolbarUser from '../components/toolbar/ToolbarUser';
import ToolbarLanguage from '../components/toolbar/ToolbarLanguage';

export default {
  components: {
    MainMenu,
    ToolbarUser,
    ToolbarLanguage,
  },

  data() {
    return {
      drawer: null,
    };
  },

  computed: {
    ...mapState(['product', 'isContentBoxed', 'menuTheme', 'toolbarTheme', 'isToolbarDetached', 'person']),
    navigation() {
      const filterAdmin = arr => arr.filter(el => !el.admin);
      const { isAdmin } = this.$store.getters;
      const navigation = cloneDeep(config.navigation);
      for (const key in navigation) {
        if (navigation[key].length) {
          if (!isAdmin) navigation[key] = filterAdmin(navigation[key]);
          for (const level1 of navigation[key]) {
            if (level1.items) {
              if (!isAdmin) level1.items = filterAdmin(level1.items);
              if (level1.items.length) {
                for (const level2 of level1.items) {
                  if (level2.items) {
                    if (!isAdmin) level2.items = filterAdmin(level2.items);
                    if (level2.items.length) {
                      // don't check level 3, there shouldn't be any
                    } else {
                      delete level2.items;
                    }
                  }
                }
              } else {
                delete level1.items;
              }
            }
          }
        }
      }
      return navigation;
    },
  },

  created() {
    this.fetchOrganizationMembership();
  },

  methods: {
    ...mapActions(['fetchOrganizationMembership']),
  },
};
</script>

<style scoped>
.buy-button {
  box-shadow: 1px 1px 18px #ee44aa;
}
</style>
