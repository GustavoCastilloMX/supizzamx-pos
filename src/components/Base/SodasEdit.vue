<template>
  <v-dialog v-model="showSodasEdit" persistent width="1200">
    <v-card>
      <v-toolbar dense flat color="rojoSupizza" dark class="mb-5">
        <v-toolbar-title class="font-weight-medium">Modificar bebidas</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="8">Límite de bebidas: {{data.limit}}</v-col>
          <v-col cols="4">
            <v-btn color="green" @click="selected" dark depressed block>Agregar bebidas</v-btn>
          </v-col>
          <v-col cols="12">
            <h3>Bebidas seleccionadas:</h3>
            <v-chip-group column>
              <v-chip
                close
                v-for="(item, index) in sodasSelected.sodas"
                :key="item._id"
                @click:close="sodasSelected.sodas.splice(index,1)"
              >{{ item.nombre }}</v-chip>
            </v-chip-group>
          </v-col>
          <v-col cols="3" v-for="item in items" :key="item._id">
            <v-card @click="addSoda(item)">
              <v-img :src="item.urlImg.very_small" height="150"></v-img>
              <h2 class="text-h6 font-weight-medium mt-2 ml-2">{{item.nombre}}</h2>
              <h2 class="text-h6 font-weight-medium ml-2">
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
  name: "SodasEditComponent",
  components: {
    moneyFormat: () =>
      import(/* webpackChunkName: "moneyFormat" */ "vue-money-format"),
  },
  props: {
    showSodasEdit: {
      type: Boolean,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    overlay: false,
    items: [],
    sodasSelected: {
      index: "",
      sodas: [],
    },
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
      let price = this.data.price;

      try {
        const response = await Soda.getByPrice(token, price);
        console.log(response);
        if ((response.status = 200)) this.items = response.data;
      } catch (error) {
        console.warn(error.data);
      }
    },
    selected() {
      this.sodasSelected.index = this.data.index;
      console.log(this.sodasSelected);
      this.$emit("sodaChanged", this.sodasSelected);
    },
    addSoda(soda) {
      if (this.sodasSelected.sodas.length < this.data.limit) {
        this.sodasSelected.sodas.push(soda);
      } else {
        alert("Refrescos máximos: " + this.data.limit);
      }
    },
  },
  watch: {
    showSodasEdit: function () {
      if (this.showSodasEdit) {
        this.init();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>