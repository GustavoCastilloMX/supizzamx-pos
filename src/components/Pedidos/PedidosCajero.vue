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
          <template v-if="items.length > 0" v-slot:item.folio="{ item }">{{getFolio(item._id)}}</template>

          <!-- TEMPLATE FECHA -->
          <template v-slot:item.fecha="{ item }">{{getFecha(item.fecha)}}</template>

          <!-- TEMPLATE PAGADO -->
          <template v-slot:item.pagado="{ item }">
            <v-chip label :color="item.pagado ? 'green' : 'red'" dark>{{item.pagado ? 'Sí' : 'No'}}</v-chip>
          </template>

          <!-- TEMPLATE TOTAL -->
          <template v-slot:item.total="{ item }">
            <moneyFormat :value="item.total" locale="es-MX" currency-code="MXN"></moneyFormat>
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

    <detallePedido :showDetail="showDetail" :pedido="pedido" @cancel="showDetail = false" />
  </v-row>
</template>

<script>
import jsPDF from "jspdf";
import moment from "moment";
import Sale from "../../services/Sale";
import image from "../../services/logo";

export default {
  name: "pedidosCajeroComponent",
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
    getFolio(id) {
      if (id != undefined) {
        return id.slice(-6);
      }
    },
    getFecha(fecha) {
      let newLocale = "es";
      let newDate = new Date(fecha);
      moment.locale(newLocale);
      return moment(newDate).format("lll");
    },
    getFechaTicket(fecha) {
      let newLocale = "es";
      let newDate = new Date(fecha);
      moment.locale(newLocale);
      return moment(newDate).format("LLLL");
    },
    customSort(items, index, isDesc) {
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
    verDetallePedido(pedido) {
      this.pedido = Object.assign({}, pedido);
      this.showDetail = true;
    },
    async imprimirTicket(item) {
      // Formato de ticket 80mm
      let doc = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: [1, 2],
      });

      let font = doc.getFont().fontName;

      // Alto 74% de ancho
      doc.addImage(await image.logoBase64, "png", 15, 3, 50, 37);
      let altura = 50;

      // Dirección
      doc.setFontSize(10);
      doc.setFont(font, "bold");
      doc.text("Av. Quinceo 387 Granjas del Maestro", 40, altura, {
        align: "center",
        maxWidth: 70,
      });
      altura += 5;

      // Ciudad
      doc.text("Morelia, Mich", 40, altura, {
        align: "center",
        maxWidth: 70,
      });
      altura += 7;

      // Fecha
      doc.setFontSize(8);
      doc.text(`${this.getFechaTicket(item.fecha).toUpperCase()}`, 40, altura, {
        align: "center",
        maxWidth: 70,
      });
      altura += 10;

      // Folio
      doc.setFontSize(14);
      doc.text(`SU ORDEN - ${this.getFolio(item._id)}`, 40, altura, {
        align: "center",
        maxWidth: 70,
      });
      altura += 2;

      // Divisor
      // doc.setLineDashPattern([7, 3, 1, 3], 10);
      doc.setLineWidth(0.5);
      doc.line(5, altura, 75, altura);
      altura += 9;

      // let altoInicial = 40;
      doc.setFont(font, "normal");
      doc.setFontSize(10);
      let pedido = [];
      let pizzas = [];

      if (item.pizzas.length > 0) {
        altura = this.imprimirPizzas(doc, altura, item.pizzas, font);
      }

      if (item.promos.length > 0) {
        altura = this.imprimirPromos(doc, altura, item.promos, font);
      }

      if (item.bebidas.length > 0) {
        altura = this.imprimirBebidasComplementos(
          doc,
          altura,
          item.bebidas,
          font
        );
        // pedido = await this.agregarPedido(pedido, item.bebidas, false);
      }
      if (item.complementos.length > 0) {
        altura = this.imprimirBebidasComplementos(
          doc,
          altura,
          item.complementos,
          font
        );
      }

      altura -= 3;
      doc.setLineDashPattern([], 10);
      doc.setLineWidth(0.5);
      doc.line(5, altura, 75, altura);
      altura += 9;

      doc.setFont(font, "bold");
      doc.setFontSize(16);
      doc.text(
        `TOTAL ${new Intl.NumberFormat("es-MX", {
          style: "currency",
          currency: "MXN",
        }).format(item.total)}`,
        40,
        altura,
        { maxWidth: 70, align: "center" }
      );

      altura += doc.getTextDimensions("T").h - 1;
      doc.line(5, altura, 75, altura);
      altura += 8;

      doc.setFontSize(13);
      let tipoPago = item.forma_pago;
      let mensaje = item.pagado
        ? `*Pago en ${tipoPago.toLowerCase()}`
        : item.forma_pago == "Cortesia empleado"
        ? `*Cortesia empleado`
        : `*Pendiente de pago`;

      doc.text(`${mensaje}`, 40, altura, {
        maxWidth: 70,
        align: "center",
      });
      altura += doc.getTextDimensions("P").h + 2;

      doc.text(`*Le atendio: ${item.cajero.nombres}`, 40, altura, {
        maxWidth: 70,
        align: "center",
      });
      altura += doc.getTextDimensions("P").h + 4;

      doc.setFont(font, "normal");
      doc.text(
        "supizza agradece su compra, vuelva pronto, visita",
        40,
        altura,
        {
          maxWidth: 70,
          align: "center",
        }
      );
      altura +=
        doc.getTextDimensions(
          "supizza agradece su compra, vuelva pronto, visita",
          {
            fontSize: 13,
            maxWidth: 70,
          }
        ).h + 1;

      doc.setFont(font, "bold");
      doc.setFontSize(14);
      doc.text("supizza.mx", 40, altura, { maxWidth: 70, align: "center" });
      altura += 5;

      doc.addImage(await image.qrBase64, "jpg", 15, altura, 50, 50);
      altura += 55;

      doc.setLineDashPattern([2, 2, 1, 2], 1);
      doc.setLineWidth(0.2);
      doc.line(5, altura, 75, altura);
      altura += 7;

      doc.setFontSize(16);
      doc.text(item.cliente.telefono.toString(), 5, altura);
      altura += 6;

      doc.setFontSize(12);
      doc.setFont(font, "bold");

      let direccion = `${item.direccion.calle} Int. ${item.direccion.numero_ext} Ext. ${item.direccion.numero_int}`;
      doc.text(`${item.direccion.calle}`, 5, altura, {
        maxWidth: 70,
        align: "left",
      });
      altura += doc.getTextDimensions(`${item.direccion.calle}`).h + 0.5;

      doc.text(`Ext. ${item.direccion.numero_ext}`, 5, altura, {
        maxWidth: 70,
        align: "left",
      });
      altura += doc.getTextDimensions(`I`).h + 0.5;

      doc.text(`Int. ${item.direccion.numero_int}`, 5, altura, {
        maxWidth: 70,
        align: "left",
      });
      altura += doc.getTextDimensions(`I`).h + 0.5;

      doc.setFontSize(11);
      doc.setFont(font, "normal");
      doc.text(`${item.direccion.referencia}`, 5, altura, {
        maxWidth: 70,
        align: "left",
      });
      altura += doc.getTextDimensions(`${item.direccion.referencia}`, {
        maxWidth: 70,
      }).h;

      doc.setLineDashPattern([], 10);
      doc.setLineWidth(0.5);
      doc.line(5, altura, 75, altura);
      altura += 5;

      doc.setFont(font, "bold");
      doc.text("Nota:", 5, altura);
      altura += 5;
      doc.setFont(font, "normal");

      doc.text(item.nota, 5, altura, {
        maxWidth: 70,
        align: "left",
      });

      altura += doc.getTextDimensions(item.nota, { maxWidth: 70 }).h;

      let altoFinal = altura * -1 - 10;
      doc.internal.pageSize.width = 80;
      doc.internal.pageSize.height = altoFinal;

      doc.autoPrint();
      doc.output("dataurlnewwindow", {
        filename: `pedido-${this.getFolio(item._id)}.pdf`,
      });
    },
    obtenerIngredientes(ingredientes) {
      let message = "";
      let maximo = ingredientes.length - 1;

      ingredientes.forEach((e, index) => {
        if (index < maximo) message += e.nombre + ", ";
        if (index == maximo) message += e.nombre;
      });
      return message;
    },
    imprimirBebidasComplementos(doc, altura, items, font) {
      items.forEach((e) => {
        doc.setLineDashPattern([2, 2, 1, 2], 1);
        doc.setLineWidth(0.2);
        doc.line(12, altura, 75, altura);
        altura += 6;

        doc.setFont(font, "bold");
        doc.setFontSize(11);
        doc.text(`${e.cantidad}`, 5, altura);

        doc.text(`${e.nombre.toUpperCase()}`, 12, altura);
        altura += doc.getTextDimensions(`${e.nombre}`).h - 0.5;

        doc.setLineDashPattern([2, 2, 1, 2], 1);
        doc.setLineWidth(0.2);
        doc.line(12, altura, 75, altura);
        altura += 8;

        let total = e.precio * e.cantidad;

        doc.setFontSize(12);
        doc.text(
          `${new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
          }).format(total)}`,
          75,
          altura,
          { maxWidth: 70, align: "right" }
        );
        altura += 10;
      });
      return altura;
    },
    imprimirPizzas(doc, altura, items, font) {
      items.forEach((e) => {
        doc.setLineDashPattern([2, 2, 1, 2], 1);
        doc.setLineWidth(0.2);
        doc.line(12, altura, 75, altura);
        altura += 6;

        doc.setFont(font, "bold");
        doc.setFontSize(11);
        doc.text(`${e.cantidad}`, 5, altura);

        let tamano =
          e.tamanos[0].nombre == "Extra Grande"
            ? "EX"
            : e.tamanos[0].nombre == "Chica"
            ? "CH"
            : e.tamanos[0].nombre.charAt(0);

        doc.text(`${e.nombre.toUpperCase()}`, 12, altura);
        doc.text(tamano, 70, altura, { maxWidth: 70, align: "right" });
        altura += doc.getTextDimensions(`${e.nombre}`).h - 0.5;

        doc.setLineDashPattern([2, 2, 1, 2], 1);
        doc.setLineWidth(0.2);
        doc.line(12, altura, 75, altura);
        altura += 7;

        doc.setFont(font, "normal");
        let ingredientes = this.obtenerIngredientes(e.ingredientes);
        doc.text(ingredientes, 12, altura, {
          maxWidth: 63,
        });
        altura += doc.getTextDimensions(ingredientes, {
          maxWidth: 63,
          fontSize: 12,
        }).h;

        doc.setLineDashPattern([2, 2, 1, 2], 1);
        doc.setLineWidth(0.2);
        doc.line(12, altura, 75, altura);
        altura += 8;

        let total = e.precio * e.cantidad;
        doc.setFont(font, "bold");
        doc.setFontSize(12);
        doc.text(
          `${new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
          }).format(total)}`,
          75,
          altura,
          { maxWidth: 70, align: "right" }
        );
        altura += 10;
      });
      return altura;
    },
    imprimirPizzasPromo(doc, altura, pizzas, font) {
      pizzas.forEach((e) => {
        let tamano =
          e.tamanos[0].nombre == "Extra Grande"
            ? "EX"
            : e.tamanos[0].nombre == "Chica"
            ? "CH"
            : e.tamanos[0].nombre.charAt(0);

        doc.setFont(font, "normal");
        doc.text(`${e.nombre}`, 12, altura);
        doc.setFont(font, "bold");
        doc.text(tamano, 70, altura, { maxWidth: 70, align: "right" });
        altura += doc.getTextDimensions(`${e.nombre}`).h + 2;
      });
      return altura;
    },
    imprimirBebidasComplementosPromo(doc, altura, items, font) {
      doc.setFont(font, "normal");
      items.forEach((e) => {
        doc.text(`${e.nombre}`, 12, altura);
        altura += doc.getTextDimensions(`${e.nombre}`).h + 2;
      });
      return altura;
    },
    imprimirPromos(doc, altura, items, font) {
      items.forEach((e) => {
        doc.setLineDashPattern([2, 2, 1, 2], 1);
        doc.setLineWidth(0.2);
        doc.line(12, altura, 75, altura);
        altura += 6;

        doc.setFont(font, "bold");
        doc.setFontSize(11);
        doc.text(`${e.cantidad}`, 5, altura);

        doc.text(`${e.nombre.toUpperCase()}`, 12, altura);
        altura += doc.getTextDimensions(`${e.nombre}`).h - 0.5;

        doc.setLineDashPattern([2, 2, 1, 2], 1);
        doc.setLineWidth(0.2);
        doc.line(12, altura, 75, altura);
        altura += 7;

        if (e.pizzas.length > 0)
          altura = this.imprimirPizzasPromo(doc, altura, e.pizzas, font);

        if (e.complementos.length > 0)
          altura = this.imprimirBebidasComplementosPromo(
            doc,
            altura,
            e.complementos,
            font
          );

        if (e.bebidas.length > 0)
          altura = this.imprimirBebidasComplementosPromo(
            doc,
            altura,
            e.bebidas,
            font
          );

        doc.setLineDashPattern([2, 2, 1, 2], 1);
        doc.setLineWidth(0.2);
        doc.line(12, altura, 75, altura);
        altura += 8;

        let total = e.precio * e.cantidad;
        doc.setFont(font, "bold");
        doc.setFontSize(12);
        doc.text(
          `${new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
          }).format(total)}`,
          75,
          altura,
          { maxWidth: 70, align: "right" }
        );
        altura += 10;
      });
      return altura;
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