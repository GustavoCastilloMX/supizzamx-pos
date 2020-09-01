<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title>
          Pedidos por cajero
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar"
            dense
            outlined
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :loading="loading"
          loading-text="Cargando pedidos..."
          :headers="headers"
          :items="items"
          :search="search"
        ></v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import Sale from "../../services/Sale";

export default {
  name: "pedidosCajeroComponent",
  mounted() {
    this.init();
  },
  data: () => ({
    loading: false,
    search: "",
    headers: [
      {
        text: "Folio",
        align: "start",
        sortable: false,
        value: "folio",
      },
      { text: "Fecha", value: "fecha" },
      { text: "Pagado", value: "pagado" },
      { text: "Total", value: "total" },
      { text: "Forma de pago", value: "forma_pago" },
      { text: "Entrega", value: "entrega" },
      { text: "Status", value: "status" },
    ],
    items: [],
  }),
  methods: {
    async init() {
      this.loading = true;
      await this.getPedidos();
      this.loading = false;
    },
    async getPedidos() {
      let token = localStorage.token;

      try {
        const { data, status } = await Sale.getSales(token);
        if (status == 200) this.items = data;
      } catch (error) {
        this.loading = false;
        console.warn(error.response);
      }
    },
    getFolio(id) {
      
    }
  },
};
</script>

<style lang="scss" scoped>
</style>