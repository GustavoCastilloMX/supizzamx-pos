<template>
  <v-container>
    <h2 class="text-center mb-5">
      <v-icon color="rojoSupizza" class="pr-2">mdi-point-of-sale</v-icon>Caja
    </h2>
    <v-row>
      <v-col cols="7">
        <h3>Pedido:</h3>
        <p>
          <span>Total:</span>
          <moneyFormat
            class="font-weight-medium"
            style="display: inline"
            :value="data.total"
            locale="es-MX"
            currency-code="MXN"
          ></moneyFormat>
        </p>
      </v-col>
      <v-col cols="5">
        <v-row>
          <v-col cols="12" class="pt-0">
            <v-radio-group
              v-model="data.entrega"
              row
              prepend-icon="mdi-truck-fast"
              label="Entrega:"
              class="mt-0"
            >
              <v-radio label="Sucursal" value="Sucursal"></v-radio>
              <v-radio label="Domicilio" value="Domicilio"></v-radio>
            </v-radio-group>
          </v-col>

          <v-col cols="6" v-for="item in opciones" :key="item.nombre">
            <v-btn
              block
              large
              @click="click(item.click)"
              class="font-weight-medium"
              color="green"
              :disabled="item.disabled"
            >
              <v-avatar size="35" tile class="mr-5">
                <v-img :src="item.img"></v-img>
              </v-avatar>
              {{item.nombre}}
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <client :showClient="showClient" @cancel="showClient = false" />
  </v-container>
</template>

<script>
export default {
  name: "InicioView",
  components: {
    moneyFormat: () =>
      import(/* webpackChunkName: "moneyFormat" */ "vue-money-format"),
    client: () => import("../components/Base/Client"),
  },
  data: () => ({
    showClient: false,
    opciones: [
      {
        nombre: "Cliente",
        img:
          "https://firebasestorage.googleapis.com/v0/b/su-pizza-mx.appspot.com/o/imagenes-administrativas%2Fclientes.svg?alt=media&token=6030af0c-3bb7-4e99-81d0-e38054abccc5",
        disabled: false,
        click: "cliente",
      },
      {
        nombre: "Repartidor",
        img:
          "https://firebasestorage.googleapis.com/v0/b/su-pizza-mx.appspot.com/o/imagenes-administrativas%2Frepartidor.svg?alt=media&token=a254c31c-e7d4-4cdf-b4b2-e0ebc2a52f40",
        disabled: true,
        click: "repartidor",
      },
      {
        nombre: "Pizza",
        img:
          "https://firebasestorage.googleapis.com/v0/b/su-pizza-mx.appspot.com/o/imagenes-administrativas%2Fpizza.svg?alt=media&token=94f8b21a-b9c4-4018-91be-4623f27c42ef",
        disabled: true,
        click: "pizza",
      },
      {
        nombre: "Promoción",
        img:
          "https://firebasestorage.googleapis.com/v0/b/su-pizza-mx.appspot.com/o/imagenes-administrativas%2Fpromocion.svg?alt=media&token=a1b3f5f3-e36a-4621-8c51-13dca0084374",
        disabled: true,
        click: "promocion",
      },
      {
        nombre: "Bebida",
        img:
          "https://firebasestorage.googleapis.com/v0/b/su-pizza-mx.appspot.com/o/imagenes-administrativas%2Fsodas.svg?alt=media&token=1a1de3da-da93-4e3a-adf4-391db6d40a7c",
        disabled: true,
        click: "bebida",
      },
      {
        nombre: "Complemento",
        img:
          "https://firebasestorage.googleapis.com/v0/b/su-pizza-mx.appspot.com/o/imagenes-administrativas%2Fcomplementos.svg?alt=media&token=a9bd7b92-f67b-4bc1-b518-39e9abe0390c",
        disabled: true,
        click: "complemento",
      },
      {
        nombre: "Nota",
        img:
          "https://firebasestorage.googleapis.com/v0/b/su-pizza-mx.appspot.com/o/imagenes-administrativas%2Fnotas.svg?alt=media&token=1d05e5b2-33ff-4bca-8d22-b2822af2ff14",
        disabled: true,
        click: "nota",
      },
      {
        nombre: "Pagar",
        img:
          "https://firebasestorage.googleapis.com/v0/b/su-pizza-mx.appspot.com/o/imagenes-administrativas%2Fpagar.svg?alt=media&token=35a6ea8c-9214-432d-9ade-519521ebc275",
        disabled: true,
        click: "pagar",
      },
    ],
    data: {
      tipo: "Panel",
      status: "",
      entrega: "Sucursal",
      fecha: "",
      cliente: "",
      repartidor: "",
      pizzas: [],
      promos: [],
      bebidas: [],
      complementos: [],
      direccion: "",
      total: 0,
      pagado: false,
      nota: "",
    },
  }),
  methods: {
    click(item) {
      if (item == "cliente") this.addClient();
      return true;
    },
    addClient() {
      this.showClient = true;
    },
  },
};
</script>
