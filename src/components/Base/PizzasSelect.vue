<template>
  <v-dialog v-model="showPizzasSelect" persistent width="1200">
    <v-card>
      <v-toolbar dense flat color="rojoSupizza" dark class="mb-5">
        <v-toolbar-title class="font-weight-medium">Selector de pizzas</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-btn color="rojoSupizza" depressed @click="cancel">Cancelar</v-btn>
        <v-btn color="rojoSupizza" depressed @click="finalizarPedido">Finalizar pedido</v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6" v-for="(pizza, index) in pizzasPromo.pizzas" :key="pizza._id">
            <v-card>
              <v-row>
                <v-col cols="8">
                  <v-card-title>Pizza: {{index+1}}</v-card-title>
                  <v-card-text class="pb-0">
                    Pizza seleccionada:
                    <strong>{{pizza.nombre}}</strong>
                  </v-card-text>
                  <v-card-text class="ma-0 pt-0">
                    Tamaño:
                    <strong>{{pizza.tamanos[0].nombre}}</strong>
                  </v-card-text>
                </v-col>
                <v-col cols="4" class="d-flex justify-center">
                  <v-avatar size="90">
                    <v-img :src="pizza.urlImg.very_small">
                      <template v-slot:placeholder>
                        <v-row class="fill-height ma-0" align="center" justify="center">
                          <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                  </v-avatar>
                </v-col>
              </v-row>
              <v-card-text>
                <v-chip-group column active-class="light-green black--text">
                  <v-chip
                    dark
                    @click="changePizza(item, index)"
                    label
                    color="green"
                    v-for="item in pizzas"
                    :key="item._id"
                  >{{ item.nombre }}</v-chip>
                </v-chip-group>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- CARGA -->
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-dialog>
</template>

<script>
import Pizza from "../../services/Pizza";

export default {
  name: "PizzasComponent",
  props: {
    showPizzasSelect: {
      type: Boolean,
      required: true,
    },
    pizzasPromo: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    overlay: false,
    pizzas: [],
  }),
  methods: {
    async init() {
      this.overlay = true;
      await this.getPizzas();
      this.overlay = false;
    },
    cancel() {
      this.$emit("cancel");
    },
    async getPizzas() {
      let token = localStorage.token;

      try {
        const { data, status } = await Pizza.getAll(token);

        if (status == 200) this.pizzas = data;
      } catch (error) {
        console.log(error);
      }
    },
    changePizza(item, index) {
      this.pizzasPromo.pizzas[index].descripcion = item.descripcion;
      this.pizzasPromo.pizzas[index].ingredientes = item.ingredientes;
      this.pizzasPromo.pizzas[index].limite_ingr = item.limite_ingr;
      this.pizzasPromo.pizzas[index].nombre = item.nombre;
      this.pizzasPromo.pizzas[index].urlImg = item.urlImg;
    },
    finalizarPedido() {
      this.$emit("finalizarPedido", this.pizzasPromo);
    },
  },
  watch: {
    showPizzasSelect: function () {
      if (this.showPizzasSelect) this.init();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>