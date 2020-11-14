<template>
  <v-dialog v-model="showDetail" persistent max-width="600">
    <v-card>
      <v-toolbar dense color="rojoSupizza" dark class="mb-5">
        <v-toolbar-title>Detalle pedido</v-toolbar-title>
      </v-toolbar>
      <v-card-text class="mb-0 pb-0">
        <v-row>
          <v-col cols="3" class="pt-0 pb-0">
            <v-row class="pa-0 mt-0">
              <v-col cols="12" class="pb-0 mb-0 mt-0">
                <strong>Folio:</strong>
              </v-col>
              <v-col cols="12" class="pt-0">{{getFolio(pedido._id)}}</v-col>
            </v-row>
          </v-col>
          <v-col cols="3" class="pt-0 pb-0">
            <v-row class="pa-0 mt-0">
              <v-col cols="12" class="pb-0 mb-0 mt-0">
                <strong>Fecha:</strong>
              </v-col>
              <v-col cols="12" class="pt-0">{{getFecha(pedido.fecha)}}</v-col>
            </v-row>
          </v-col>
          <v-col cols="3" class="pt-0 pb-0">
            <v-row class="pa-0 mt-0">
              <v-col cols="12" class="pb-0 mb-0 mt-0">
                <strong>Hora:</strong>
              </v-col>
              <v-col cols="12" class="pt-0">{{getHora(pedido.fecha)}}</v-col>
            </v-row>
          </v-col>
          <v-col cols="3" class="pt-0 pb-0">
            <v-row class="pa-0 mt-0">
              <v-col cols="12" class="pb-0 mb-0 mt-0">
                <strong>Total:</strong>
              </v-col>
              <v-col cols="12" class="pt-0">
                <moneyFormat :value="pedido.total" locale="es-MX" currency-code="MXN" class="ml-1"></moneyFormat>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="4" class="pt-0 pb-0">
            <v-row class="pa-0 mt-0">
              <v-col cols="12" class="pb-0 mb-0 mt-0">
                <strong>Forma de pago:</strong>
              </v-col>
              <v-col cols="12" class="pt-0">{{pedido.forma_pago}}</v-col>
            </v-row>
          </v-col>
          <v-col cols="4" class="pt-0 pb-0">
            <v-row class="pa-0 mt-0">
              <v-col cols="12" class="pb-0 mb-0 mt-0">
                <strong>Entrega:</strong>
              </v-col>
              <v-col cols="12" class="pt-0">{{pedido.entrega}}</v-col>
            </v-row>
          </v-col>
          <v-col cols="4" class="pt-0 pb-0">
            <v-row class="pa-0 mt-0">
              <v-col cols="12" class="pb-0 mb-0 mt-0">
                <strong>Status:</strong>
              </v-col>
              <v-col cols="12" class="pt-0">{{pedido.status}}</v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>

      <v-container class="pt-0 mt-0">
        <v-row class="pt-0 mt-0">
          <!-- PIZZAS -->
          <v-col cols="12" class="pl-6 pr-6 pb-0" v-for="pizza in pedido.pizzas" :key="pizza._id">
            <h4
              class="grey--text text--darken-2 text-subtitle-1 font-weight-medium"
            >{{pizza.nombre}}</h4>

            <v-chip label color="#e90840" dark class="font-weight-medium mr-2">
              {{pizza.cantidad}} X
              <moneyFormat :value="pizza.precio" locale="es-MX" currency-code="MXN" class="ml-1"></moneyFormat>
            </v-chip>
            <v-chip
              class="font-weight-medium"
              label
              color="#e90840"
              dark
            >{{pizza.tamanos[0].nombre}}</v-chip>
            <v-chip-group column active-class="white--text rojoSupizza">
              <v-chip
                label
                small
                color="#e90840"
                dark
                v-for="ingrediente in pizza.ingredientes"
                :key="ingrediente"
              >{{ ingrediente.nombre }}</v-chip>
            </v-chip-group>
          </v-col>

          <!-- BEBIDAS -->
          <v-col
            cols="12"
            class="pl-6 pr-6 pb-0"
            v-for="bebida in pedido.bebidas"
            :key="bebida._id"
          >
            <h4
              class="grey--text text--darken-2 text-subtitle-1 font-weight-medium"
            >{{bebida.nombre}}</h4>
            <v-chip label color="#e90840" dark class="font-weight-medium mr-2">
              {{bebida.cantidad}} X
              <moneyFormat :value="bebida.precio" locale="es-MX" currency-code="MXN" class="ml-1"></moneyFormat>
            </v-chip>
            <h4 class="grey--text text--darken-2 text-subtitle-1 font-weight-medium">
              <moneyFormat
                :value="bebida.precio * bebida.cantidad"
                locale="es-MX"
                currency-code="MXN"
                class="ml-1"
              ></moneyFormat>
            </h4>
          </v-col>

          <!-- COMPLEMENTOS -->
          <v-col
            cols="12"
            class="pl-6 pr-6 pb-0"
            v-for="complemento in pedido.complementos"
            :key="complemento._id"
          >
            <h4
              class="grey--text text--darken-2 text-subtitle-1 font-weight-medium"
            >{{complemento.nombre}}</h4>
            <v-chip label color="#e90840" dark class="font-weight-medium mr-2">
              {{complemento.cantidad}} X
              <moneyFormat
                :value="complemento.precio"
                locale="es-MX"
                currency-code="MXN"
                class="ml-1"
              ></moneyFormat>
            </v-chip>
            <h4 class="grey--text text--darken-2 text-subtitle-1 font-weight-medium">
              <moneyFormat
                :value="complemento.precio * complemento.cantidad"
                locale="es-MX"
                currency-code="MXN"
                class="ml-1"
              ></moneyFormat>
            </h4>
          </v-col>

          <!-- PROMOCIONES -->
          <v-col cols="12" class="pl-6 pr-6 pb-0" v-for="promo in pedido.promos" :key="promo._id">
            <h4
              class="grey--text text--darken-2 text-subtitle-1 font-weight-medium"
            >{{promo.nombre}}</h4>
            <v-chip label color="#e90840" dark class="font-weight-medium mr-2">
              {{promo.cantidad}} X
              <moneyFormat :value="promo.precio" locale="es-MX" currency-code="MXN" class="ml-1"></moneyFormat>
            </v-chip>
          </v-col>
        </v-row>
      </v-container>
      <v-card-text></v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="cancel">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from "moment";

export default {
  name: "detallePedido",
  components: {
    moneyFormat: () =>
      import(/* webpackChunkName: "moneyFormat" */ "vue-money-format"),
  },
  props: {
    showDetail: {
      type: Boolean,
      required: true,
    },
    pedido: {
      type: Object,
      required: true,
    },
  },
  methods: {
    cancel() {
      this.$emit("cancel");
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
      return moment(newDate).format("L");
    },
    getHora(fecha) {
      let newLocale = "es";
      let newDate = new Date(fecha);
      moment.locale(newLocale);
      return moment(newDate).format("LTS");
    },
    getIngredientes(ingredientes) {
      let message = "[ ";
      const limite = ingredientes.length - 1;

      ingredientes.forEach((e, index) => {
        if (index < limite) {
          message += `${e.nombre}, `;
        } else {
          message += `${e.nombre} `;
        }
      });

      message += "]";
      return message;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>