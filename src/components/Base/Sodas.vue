<template>
  <v-dialog v-model="showSodas" persistent width="1200">
    <v-card>
      <v-toolbar dense flat color="rojoSupizza" dark class="mb-5">
        <v-toolbar-title class="font-weight-medium">Bebidas</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-row class="justify-center">
          <v-col cols="3" v-for="item in items" :key="item._id">
            <v-card @click="selected(item)" style="padding: 10px" >
              <v-img :src="item.urlImg.very_small" height="150"></v-img>

<h3 class="text-h6 font-weight-regular mt-2 ml-2" style=" text-align: center;">{{item.nombre}}</h3>
              <h2 class="text-h5 font-weight-medium ml-2" style="padding-bottom: 15px; text-align: center;">

              <!-- <h3 class="text-h6 font-weight-regular text-uppercase  mt-2 ml-2">{{item.nombre}}</h3>
              <h2 class="text-h6 font-weight-medium ml-2"> -->
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

    <!-- CARGA -->
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-dialog>
</template>

<script>
import Soda from "../../services/Soda";

export default {
  name: "SodasComponent",
  components: {
    moneyFormat: () =>
      import(/* webpackChunkName: "moneyFormat" */ "vue-money-format"),
  },
  props: {
    showSodas: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    overlay: false,
    items: [],
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

      try {
        const response = await Soda.getAll(token);
        if ((response.status = 200)) this.items = response.data;
      } catch (error) {
        console.warn(error.data);
      }
    },
    selected(item) {
      item.tipo = "bebida";
      item.cantidad = 1;
      this.$emit("itemSelected", item);
    },
  },
  watch: {
    showSodas: function () {
      if (this.showSodas && this.items.length <= 0) {
        this.init();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>