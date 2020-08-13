<template>
  <v-dialog v-model="showSizePizzas" persistent width="1200">
    <v-card>
      <v-toolbar dense flat color="rojoSupizza" dark class="mb-5">
        <v-toolbar-title class="font-weight-medium">Edición Pizza</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-btn color="rojoSupizza" depressed @click="cancel">Cancelar</v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row class="d-flex justify-center">
          <!-- Tamaños -->
          <v-col cols="2" v-for="item in item.tamanos" :key="item._id">
            <v-card
              height="150"
              class="d-flex align-center"
              color="teal darken-1"
              dark
              @click="pizzaSelected(item)"
            >
              <v-row>
                <v-col cols="12" class="text-center">
                  <h2>{{item.nombre}}</h2>
                  <moneyFormat
                    class="font-weight-medium"
                    style="display: inline"
                    :value="item.precio"
                    locale="es-MX"
                    currency-code="MXN"
                  ></moneyFormat>
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <v-col cols="2">
            <v-card
              height="150"
              class="d-flex align-center"
              color="teal darken-1"
              dark
              @click="editPizza"
            >
              <v-row>
                <v-col cols="12">
                  <h2 class="text-center">Editar</h2>
                  <h4
                    class="pr-3 pl-3 font-weight-regular font-italic"
                  >Editar pizza a gusto de cliente.</h4>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "SizePizzaComponent",
  components: {
    moneyFormat: () =>
      import(/* webpackChunkName: "moneyFormat" */ "vue-money-format"),
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    showSizePizzas: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    pizza: "",
  }),
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    pizzaSelected(size) {
      this.pizza.tamanos.push(size);
      this.$emit("pizzaSelected", this.pizza);
    },
    editPizza() {
        let data = "";
        data = Object.assign({}, this.item);
        this.$emit("editPizza", data);
    }
  },
  watch: {
    showSizePizzas: function () {
      if (this.showSizePizzas) {
        this.pizza = Object.assign({}, this.item);
        this.pizza.tamanos = [];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>