<template>
  <v-app>
    <v-main class="grey lighten-4">
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
    NavigationDrawer: () =>
      import(
        /* webpackChunkName: "NavigationDrawerComponent" */ "./components/Menu/NavigationDrawer"
      ),
  },

  data: () => ({
    //
  }),
};
</script>




Llamada a la  base de datos de todos tus puntos 


localizacionCamion 10s

snapShot(coordenadas) {
  function moverMarcador
  function calcularTiempo
}

socket(coordenadas) {
  function moverMarcador
  function calcularTiempo
}


localizacion



function drawMarkers() {
  getAllPoints().forEach(e => {
    L.marker([e.latidud, e.longitud],
  })
}
