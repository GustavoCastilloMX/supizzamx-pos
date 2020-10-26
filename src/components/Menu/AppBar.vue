<template>
  <v-app-bar color="rojoSupizza" app dark height="56">
    <v-spacer></v-spacer>

    <v-avatar tile size="50">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/su-pizza-mx.appspot.com/o/imagenes-administrativas%2FsuPizzaSimple.svg?alt=media&token=eba7fe3c-5343-4dc6-8e69-5f18113ec11d"
        alt="John"
      />
    </v-avatar>
    <h1 class="ml-2 font-weight-medium text-h5">Sistema POS</h1>

    <v-spacer></v-spacer>
  </v-app-bar>
</template>

<script>
import Socket from "../../common/socket";

export default {
  name: "AppBarComponent",
  created() {
    console.log("PRUEBA");
    let x = new Socket();
    x.connect();
  },
};
</script>

<style lang="scss" scoped>
</style>