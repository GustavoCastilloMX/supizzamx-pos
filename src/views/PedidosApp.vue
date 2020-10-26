<template>
  <v-container>
    <v-row>
      <h1>Pedidos de la App</h1>
      <v-col cols="12">
        <tablaPedidosApp />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import tablaPedidosApp from "../components/Pedidos/PedidosApp";
export default {
  name: "PedidosApp",
  components: {
    tablaPedidosApp,
  },
};
</script>

<style lang="scss" scoped>
</style>