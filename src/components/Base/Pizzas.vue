<template>
  <v-dialog v-model="showPizzas" persistent width="1200">
    <v-card>
      <v-toolbar dense flat color="rojoSupizza" dark class="mb-5">
        <v-toolbar-title class="font-weight-medium">Pizzas</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-btn color="rojoSupizza" depressed @click="cancel">Cancelar</v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="2" v-for="item in items" :key="item._id">
            <v-card color="indigo darken-4" dark @click="setPizza(item)">
              <v-img
                :src="item.urlImg.very_small"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,0), rgba(0,0,0,.7)"
                height="120"
              >
                <h2 class="pa-2 font-weight-medium text-subtitle-2">{{item.nombre}}</h2>
              </v-img>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- CARGA -->
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <!-- Size Pizza -->
    <sizePizza
      :showSizePizzas="showSizePizzas"
      :item="item"
      @pizzaSelected="selected"
      @editPizza="editPizza"
      @cancel="showSizePizzas = false"
    />

    <editIngredients
      :showIngredientsEdit="showIngredientsEdit"
      :item="pizza"
      @itemSelected="selectedEdited"
      @cancel="cancelEditIngredient"
    />
  </v-dialog>
</template>

<script>
import Pizza from "../../services/Pizza";

export default {
  name: "PizzasComponent",
  components: {
    sizePizza: () => import("./SizePizza"),
    editIngredients: () => import("./IngredientsEdit"),
  },
  props: {
    showPizzas: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    overlay: false,
    showSizePizzas: false,
    showIngredientsEdit: false,
    items: [],
    item: {},
    pizza: {},
    prueba: "",
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
        const response = await Pizza.getAll(token);
        if ((response.status = 200)) this.items = response.data;
      } catch (error) {
        console.warn(error.data);
      }
    },
    selected(item) {
      item.tipo = "pizza";
      item.cantidad = 1;
      item.precio = item.tamanos[0].precio;
      this.$emit("itemSelected", item);
    },
    selectedEdited(item) {
      this.showIngredientsEdit = false;
      this.$emit("itemSelected", item);
    },
    setPizza(item) {
      this.item = Object.assign({}, item);
      this.showSizePizzas = true;
    },
    editPizza(pizza) {
      this.pizza = Object.assign({}, pizza);
      this.showSizePizzas = false;
      this.showIngredientsEdit = true;
    },
    cancelEditIngredient() {
      this.pizza = {};
      console.log(this.pizza);
      this.showIngredientsEdit = false;
    },
  },
  watch: {
    showPizzas: function () {
      this.showSizePizzas = false;
      if (this.showPizzas && this.items.length <= 0) {
        this.init();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>