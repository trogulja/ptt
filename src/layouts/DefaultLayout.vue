<template>
  <div class="d-flex flex-grow-1">
    <!-- Navigation -->
    <v-navigation-drawer v-model="drawer" app floating class="elevation-1" :right="$vuetify.rtl" :light="menuTheme === 'light'" :dark="menuTheme === 'dark'">
      <!-- Navigation menu info -->
      <template v-slot:prepend>
        <div class="pa-2">
          <div class="title font-weight-bold text-uppercase primary--text">{{ product.name }}</div>
          <div class="overline grey--text">{{ product.version }}</div>
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
          <!-- search input mobile -->
          <v-text-field
            v-if="showSearch"
            append-icon="mdi-close"
            placeholder="Search"
            prepend-inner-icon="mdi-magnify"
            hide-details
            solo
            flat
            autofocus
            @click:append="showSearch = false"
          ></v-text-field>

          <div v-else class="d-flex flex-grow-1 align-center">
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

            <v-spacer class="d-none d-lg-block"></v-spacer>

            <!-- search input desktop -->
            <v-text-field
              ref="search"
              class="mx-1 hidden-xs-only"
              :placeholder="$t('menu.search')"
              prepend-inner-icon="mdi-magnify"
              hide-details
              filled
              rounded
              dense
            ></v-text-field>

            <v-spacer class="d-block d-sm-none"></v-spacer>

            <v-btn class="d-block d-sm-none" icon @click="showSearch = true">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>

            <toolbar-language />

            <div :class="[$vuetify.rtl ? 'ml-1' : 'mr-1']">
              <toolbar-notifications />
            </div>

            <toolbar-user />
          </div>
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
        <div class="overline"><v-icon class="mr-1" small color="pink">$marvinIcon</v-icon> ai powered</div>
      </v-footer>
    </v-main>
  </div>
</template>