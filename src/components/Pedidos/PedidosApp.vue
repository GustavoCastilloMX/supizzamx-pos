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
          :items="pedidosApp"
          :search="search"
          :custom-sort="customSort"
        >
          <!-- TEMPLATE FOLIO -->
          <template v-slot:item.folio="{ item }">{{
            getFolio(item._id)
          }}</template>

          <!-- TEMPLATE FECHA -->
          <template v-slot:item.fecha="{ item }">{{
            getFecha(item.fecha)
          }}</template>

          <!-- TEMPLATE PAGADO -->
          <template v-slot:item.pagado="{ item }">
            <v-chip label :color="item.pagado ? 'green' : 'red'" dark>{{
              item.pagado ? "Sí" : "No"
            }}</v-chip>
          </template>

          <!-- TEMPLATE TOTAL -->
          <template v-slot:item.total="{ item }">
            <moneyFormat
              :value="item.total"
              locale="es-MX"
              currency-code="MXN"
            ></moneyFormat>
          </template>

          <!-- TEMPLATE TOTAL -->
          <template v-slot:item.options="{ item }">
            <v-btn icon color="cyan" @click="verDetallePedido(item)">
              <v-icon>mdi-file-table</v-icon>
            </v-btn>
            <v-btn icon color="red" @click="aceptarPedido(item)">
              <v-icon>mdi-checkbox-marked</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-col>

    <detallePedido
      v-if="showDetail"
      :showDetail="showDetail"
      :pedido="pedido"
      @cancel="showDetail = false"
    />

    <v-overlay :value="overlay" z-index="99">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-row>
</template>

<script>
import { mapState } from "vuex";

//Mixins
import { formatoTabla } from "../../mixins/formatoTabla";

//Servicios
import SaleApp from "../../services/SaleApp";

export default {
  name: "pedidosAppComponent",
  mixins: [formatoTabla],
  components: {
    moneyFormat: () =>
      import(/* webpackChunkName: "moneyFormat" */ "vue-money-format"),
    detallePedido: () => import("./DetallePedidos"),
  },
  data: () => ({
    pedido: {},
    overlay: false,
    showDetail: false,
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
      { text: "", value: "options" },
    ],
    items: [],
  }),
  methods: {
    async aceptarPedido({ _id }) {
      const token = localStorage.token;
      this.overlay = true;
      try {
        const response = await SaleApp.toAccept(token, _id);
        console.log(response);
      } catch (error) {
        console.warn(error.response);
      } finally {
        this.overlay = false;
      }
    },
  },
  computed: {
    ...mapState(["pedidosApp"]),
  },
};
</script>

<style lang="scss" scoped>
</style>