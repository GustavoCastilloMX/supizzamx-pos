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
            <v-btn icon color="blue" @click="imprimirTicket(item)">
              <v-icon>mdi-printer</v-icon>
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
  </v-row>
</template>

<script>
import moment from "moment";
import Sale from "../../services/Sale";

//Mixins
import { ticketManager } from "../../mixins/ticketManager";
import { formatoTabla } from "../../mixins/formatoTabla";

export default {
  name: "pedidosCajeroComponent",
  mixins: [ticketManager, formatoTabla],
  mounted() {
    this.init();
  },
  components: {
    moneyFormat: () =>
      import(/* webpackChunkName: "moneyFormat" */ "vue-money-format"),
    detallePedido: () => import("./DetallePedidos"),
  },
  data: () => ({
    pedido: {},
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
    agregarPedido(pedido, items, isPizza) {
      let item = {};
      items.forEach((e) => {
        item.cantidad = e.cantidad;
        item.precio = e.precio;
        item.nombre = e.nombre.toUpperCase();
        if (isPizza) item.nombre = `${item.nombre} - ${e.tamanos[0].nombre}`;
        if (isPizza) console.log(item);

        pedido.push(item);
      });

      return pedido;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>