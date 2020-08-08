<template>
  <v-app>
    <v-main>
      <AppBar />
      <NavigationDrawer />
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  components: {
    AppBar: () =>
      import(
        /* webpackChunkName: "AppBarComponent" */ "./components/Menu/AppBar"
      ),
      NavigationDrawer: () => import(/* webpackChunkName: "NavigationDrawerComponent" */"./components/Menu/NavigationDrawer")
  },

  data: () => ({
    //
  }),
};
</script>
