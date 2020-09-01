<template>
  <v-container>
    <v-row>
      <h1>Pedidos</h1>
      <v-col cols="12">
        <cajeroPedidos/>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "PedidosView",
  components: {
    cajeroPedidos: () =>
      import("../components/Pedidos/PedidosCajero"),
  }
};
</script>

<style lang="scss" scoped>
</style>