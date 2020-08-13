<template>
  <v-dialog v-model="showIngredientsEdit" persistent width="1200">
    <v-card>
      <v-toolbar dense flat color="rojoSupizza" dark class="mb-5">
        <v-toolbar-title class="font-weight-medium">Ingredientes</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-btn color="rojoSupizza" depressed @click="cancel">Cancelar</v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-row>
                <v-col cols="6">
                  <v-card-title>{{pizza.nombre}}</v-card-title>
                  <v-card-text v-if="size >= 0" class="pb-0">
                    {{sizes[size].nombre}}
                    <moneyFormat
                      class="font-weight-medium pa-2 mt-0 pt-0"
                      style="display: inline"
                      :value="sizes[size].precio"
                      locale="es-MX"
                      currency-code="MXN"
                    ></moneyFormat>
                  </v-card-text>
                  <v-card-text v-if="size >= 0" class="pt-0 pb-0">
                    Total extras:
                    <moneyFormat
                      class="font-weight-medium pa-2 mt-0 pt-0"
                      style="display: inline"
                      :value="totalExtras"
                      locale="es-MX"
                      currency-code="MXN"
                    ></moneyFormat>
                  </v-card-text>
                  <v-card-text v-if="size >= 0" class="pt-0">
                    Total pizza:
                    <moneyFormat
                      class="font-weight-medium pa-2 mt-0 pt-0"
                      style="display: inline"
                      :value="itemsCost"
                      locale="es-MX"
                      currency-code="MXN"
                    ></moneyFormat>
                  </v-card-text>
                </v-col>
                <v-col cols="6" class="d-flex align-center">
                  <v-row>
                    <v-col cols="12">
                      <span class="mr-3 font-weight-medium">Tamaño:</span>
                      <v-chip-group v-model="size" filter column>
                        <v-chip filter v-for="size in sizes" :key="size._id">{{size.nombre}}</v-chip>
                      </v-chip-group>
                    </v-col>
                    <v-col cols="12">
                      <v-btn
                        :disabled="size < 0 || ingredients.length < 1"
                        block
                        depressed
                        color="green"
                        :dark="size >= 0 && ingredients.length >= 1"
                        large
                        @click="selected"
                      >Agregar pizza</v-btn>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col class="pr-5 pl-5">
                  <v-chip-group column>
                    <v-chip
                      v-for="(item, index) in ingredients"
                      :key="item._id"
                      close
                      @click:close="removeIngredient(index)"
                    >{{ item.nombre }}</v-chip>
                  </v-chip-group>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-if="size == -1">
          <v-col cols="12" style="height: 300px" class="d-flex justify-center align-center">
            <h2>Favor de seleccionar el tamaño para ver los ingredientes.</h2>
          </v-col>
        </v-row>
        <v-row class="scroll--active" v-if="size >= 0">
          <v-col cols="2" v-for="item in items" :key="item._id">
            <v-card color="indigo darken-4" dark @click="addIngredient(item)">
              <v-img
                :src="item.urlImg.very_small"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,0), rgba(0,0,0,.9)"
                height="120"
              >
                <h2 class="pa-2 pb-0 mb-0 font-weight-medium text-subtitle-2">{{item.nombre}}</h2>
                <moneyFormat
                  class="font-weight-medium pa-2 mt-0 pt-0"
                  style="display: inline"
                  :value="item.precio"
                  locale="es-MX"
                  currency-code="MXN"
                ></moneyFormat>
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
  </v-dialog>
</template>

<script>
import Ingredient from "../../services/Ingredient";

export default {
  name: "IngredientsEditComponent",
  components: {
    moneyFormat: () =>
      import(/* webpackChunkName: "moneyFormat" */ "vue-money-format"),
  },
  props: {
    showIngredientsEdit: {
      type: Boolean,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    overlay: false,
    items: [],
    sizes: [],
    size: -1,
    ingredients: [],
    totalExtras: 0,
    itemsCost: 0,
    pizza: {},
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
        const response = await Ingredient.getAll(token);
        if ((response.status = 200)) this.items = response.data;
      } catch (error) {
        console.warn(error.data);
      }
    },
    selected() {
      let data = {
        tipo: "pizza",
        cantidad: 1,
        precio: this.itemsCost,
        tamanos: [],
        ingredientes: this.ingredients,
        urlImg: this.pizza.urlImg,
        _id: this.pizza._id,
        descripcion: this.pizza.descripcion,
        limite_ingr: this.pizza.limite_ingr,
        nombre: this.pizza.nombre,
      };

      data.tamanos.push(this.sizes[this.size]);
      data.tamanos[0].precio = this.itemsCost;

      console.log(data);
      this.$emit("itemSelected", data);
    },
    sizeSelected(size) {
      this.size[0] = size;
      console.log(this.size);
    },
    removeIngredient(index) {
      this.ingredients.splice(index, 1);
      this.sumarExtras();
    },
    addIngredient(ingredient) {
      if (!this.ingredientExist(ingredient)) this.ingredients.push(ingredient);

      this.sumarExtras();
    },
    ingredientExist(ingredient) {
      let exist = false;
      this.ingredients.forEach((e) => {
        if (ingredient._id == e._id) exist = true;
      });

      return exist;
    },
    sumarExtras() {
      let total = 0;
      this.ingredients.forEach((e, index) => {
        if (index > 3) total += e.precio;
      });
      this.totalExtras = total;
      this.sumarTotal();
    },
    sumarTotal() {
      this.itemsCost = this.totalExtras + this.sizes[this.size].precio;
    },
  },
  watch: {
    size: function () {
      if (this.size >= 0) this.sumarTotal();
    },
    showIngredientsEdit: function () {
      this.size = -1;
      this.sizes = this.item.tamanos;

      if (this.showIngredientsEdit) {
        this.pizza = Object.assign({}, this.item);
        this.ingredients = this.pizza.ingredientes.map((e) => e);
        this.init();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.scroll--active {
  max-height: 53vh;
  overflow-y: auto;
}
</style>