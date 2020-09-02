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
          <template v-slot:item.folio="{ item }">{{getFolio(item._id)}}</template>

          <!-- TEMPLATE FECHA -->
          <template v-slot:item.fecha="{ item }">{{getFecha(item.fecha)}}</template>

          <!-- TEMPLATE PAGADO -->
          <template v-slot:item.pagado="{ item }">
            <v-chip label :color="item.pagado ? 'green' : 'red'" dark>{{item.pagado ? 'Sí' : 'No'}}</v-chip>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import moment from "moment";
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
      return id.slice(-6);
    },
    getFecha(fecha) {
      let newLocale = "es";
      let newDate = new Date(fecha);
      moment.locale(newLocale);
      return moment(newDate).format("L");
    },
    customSort(items, index, isDesc) {
      console.log(index);

      if (index[0] == "pagado") {
        if (isDesc[0]) items = this.ordenarAscendente(items, "pagado");
        if (!isDesc[0]) items = this.ordenarDescendente(items, "pagado");
      }

      if (index[0] == "total") {
        if (isDesc[0]) items = this.ordenarAscendente(items, "total");
        if (!isDesc[0]) items = this.ordenarDescendente(items, "total");
      }

      if (index[0] == "forma_pago") {
        if (isDesc[0])
          items = this.ordenarAscendenteString(items, "forma_pago");
        if (!isDesc[0])
          items = this.ordenarDescendenteString(items, "forma_pago");
      }

      if (index[0] == "entrega") {
        if (isDesc[0]) items = this.ordenarAscendenteString(items, "entrega");
        if (!isDesc[0]) items = this.ordenarDescendenteString(items, "entrega");
      }

      if (index[0] == "status") {
        if (isDesc[0]) items = this.ordenarAscendenteString(items, "status");
        if (!isDesc[0]) items = this.ordenarDescendenteString(items, "status");
      }

      if (index[0] == "fecha") {
        if (isDesc[0]) items = this.ordenarAscendenteFecha(items, "fecha");
        if (!isDesc[0]) items = this.ordenarDescendenteFecha(items, "fecha");
      }

      // if (isDesc[0]) {
      //   items.sort(function (a, b) {
      //     var c = new Date(a.fecha);
      //     var d = new Date(b.fecha);
      //     return c - d;
      //   });
      // }

      // if (!isDesc[0]) {
      //   items.sort(function (a, b) {
      //     var c = new Date(a.fecha);
      //     var d = new Date(b.fecha);
      //     return d - c;
      //   });
      // }

      return items;
    },
    ordenarAscendenteFecha(items, key) {
      return items.sort((a, b) => {
        let c = new Date(a.fecha);
        let d = new Date(b.fecha);
        return d - c;
      });
    },
    ordenarDescendenteFecha(items, key) {
      return items.sort((a, b) => {
        let c = new Date(a.fecha);
        let d = new Date(b.fecha);
        return c - d;
      });
    },
    ordenarAscendente(items, key) {
      return items.sort((a, b) => a[key] - b[key]);
    },
    ordenarDescendente(items, key) {
      return items.sort((a, b) => b[key] - a[key]);
    },
    ordenarAscendenteString(items, key) {
      return items.sort((a, b) =>
        a[key].toLowerCase() < b[key].toLowerCase()
          ? 1
          : a[key].toLowerCase() > b[key].toLowerCase()
          ? -1
          : 0
      );
    },
    ordenarDescendenteString(items, key) {
      return items.sort((a, b) =>
        a[key].toLowerCase() > b[key].toLowerCase()
          ? 1
          : a[key].toLowerCase() < b[key].toLowerCase()
          ? -1
          : 0
      );
    },
  },
};
</script>

<style lang="scss" scoped>
</style>