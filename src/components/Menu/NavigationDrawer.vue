<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    mini-variant
    touchless
    right
    permanent
    color="rojoSupizza"
  >
    <v-list-item class="px-2">
      <v-list-item-avatar>
        <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
      </v-list-item-avatar>

      <v-list-item-title>John Leider</v-list-item-title>

      <v-btn icon @click.stop="mini = !mini">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense>
      <v-list-item link to="/pedidos" active-class="white--text red2">
        <v-list-item-content>
          <v-icon color="white">mdi-message-bulleted</v-icon>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link to="/pedidos-app" active-class="white--text red2">
        <v-list-item-content v-if="pedidosApp.length == 0">
          <v-icon color="white">mdi-truck-fast</v-icon>
        </v-list-item-content>
        <v-badge
          v-if="pedidosApp.length > 0"
          color="orange"
          :content="pedidosApp.length"
          left
          bottom
          offset-x="8"
          offset-y="23"
        >
          <v-list-item-content>
            <v-icon color="white">mdi-truck-fast</v-icon>
          </v-list-item-content>
        </v-badge>
      </v-list-item>
      <v-list-item
        v-for="item in items"
        :key="item.title"
        link
        :to="item.to"
        active-class="white--text red2"
      >
        <v-list-item-content>
          <v-icon color="white">{{ item.icon }}</v-icon>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "NavigationDrawerComponent",
  data: () => ({
    drawer: true,
    items: [
      { icon: "mdi-point-of-sale", to: "/" },
      { icon: "mdi-account-arrow-right", to: "/login" },
    ],
  }),
  computed: {
    ...mapState(["pedidosApp"]),
  },
};
</script>

<style lang="scss" scoped>
</style>