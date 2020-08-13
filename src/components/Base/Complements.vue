<template>
  <v-dialog v-model="showComplements" persistent max-width="800">
    <v-card>
      <v-toolbar dense flat color="rojoSupizza" dark class="mb-5">
        <v-toolbar-title class="font-weight-medium">Complementos</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="4" v-for="item in complements" :key="item._id">
            <v-card @click="selected(item)">
              <v-img :src="item.urlImg.very_small" height="120"></v-img>
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
import Complement from "../../services/Complement";

export default {
  name: "ComplementsComponent",
  components: {
    moneyFormat: () =>
      import(/* webpackChunkName: "moneyFormat" */ "vue-money-format"),
  },
  props: {
    showComplements: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    overlay: false,
    complements: [],
  }),
  methods: {
    async init() {
      this.overlay = true;
      await this.getComplements();
      this.overlay = false;
    },
    cancel() {
      this.$emit("cancel");
    },
    async getComplements() {
      let token = localStorage.token;

      try {
        const response = await Complement.getAll(token);
        if ((response.status = 200)) this.complements = response.data;
      } catch (error) {
        console.warn(error.data);
      }
    },
    selected(item) {
      item.tipo = "complemento";
      item.cantidad = 1;
      this.$emit("itemSelected", item);
    },
  },
  watch: {
    showComplements: function () {
      if (this.showComplements && this.complements.length <= 0) {
        this.init();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>