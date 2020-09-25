<template>
  <v-dialog v-model="showPromotions" persistent max-width="800">
    <v-card>
      <v-toolbar dense flat color="rojoSupizza" dark class="mb-5">
        <v-toolbar-title class="font-weight-medium">Promociones</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="4" v-for="item in items" :key="item._id">
            <v-card @click="selected(item)" >
              <v-img :src="item.urlImg.very_small" height="120"></v-img>
              <h3 class="text-h6 font-weight-regular mt-2 ml-2" style=" text-align: center;">{{item.nombre}}</h3>
              <h2 class="text-h5 font-weight-medium ml-2" style="padding-bottom: 15px; text-align: center;">
                <moneyFormat
                  class="font-weight-medium"
                  style="display: inline"
                  :value="item.precio"
                  locale="es-MX"
                  currency-code="MXN"
                ></moneyFormat>
              </h2>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="cancel">Cancelar</v-btn>
      </v-card-actions>
    </v-card>

    <pizzasSelect
      :showPizzasSelect="showPizzasSelect"
      :pizzasPromo="pizzasPromo"
      @finalizarPedido="finalizarPedido"
      @cancel="showPizzasSelect = false"
    />

    <!-- CARGA -->
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-dialog>
</template>

<script>
import Promotion from "../../services/Promotion";

export default {
  name: "SodasComponent",
  components: {
    pizzasSelect: () => import("./PizzasSelect"),
    moneyFormat: () =>
      import(/* webpackChunkName: "moneyFormat" */ "vue-money-format"),
  },
  props: {
    showPromotions: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    showPizzasSelect: false,
    overlay: false,
    days: [
      "Domingo",
      "Lunes",
      "Martes",
      "Miercoles",
      "Jueves",
      "Viernes",
      "Sabado",
    ],
    items: [],
    pizzasPromo: {},
  }),
  methods: {
    async init() {
      this.overlay = true;
      await this.getItems();
      this.overlay = false;
    },
    cancel() {
      this.$emit("cancel");
    },
    async getItems() {
      let token = localStorage.token;
      let day = new Date().getDay();

      try {
        const response = await Promotion.get(token, this.days[day]);
        if ((response.status = 200)) this.items = response.data;
      } catch (error) {
        console.warn(error.data);
      }
    },
    selected(item) {
      if (!item.modificar) {
        this.enviarPedido(item);
        return true;
      }
      this.pizzasPromo = item;
      this.showPizzasSelect = true;
    },
    enviarPedido(item) {
      item.cantidad = 1;
      item.tipo = "promocion";
      this.$emit("itemSelected", item);
    },
    finalizarPedido(item) {
      this.showPizzasSelect = false;
      this.enviarPedido(item);
    },
  },
  watch: {
    showPromotions: function () {
      if (this.showPromotions) {
        this.init();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>