<template>
  <v-container>
    <h2 class="text-center mb-3">
      <v-icon color="rojoSupizza" class="pr-2">mdi-point-of-sale</v-icon>Caja
    </h2>
    <v-row cols="12">
      <v-col cols="6">
        <v-row>
          <v-col cols="12" class="pt-0 justify-center">
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

          <v-col
            class="pr-0 pt-1 pb-1"
            v-for="item in opciones"
            :key="item.nombre"
            :cols="item.nombre == 'Pagar' ? '12' : '6'"
          >
            <v-card
              :disabled="item.disabled"
              color="rojoSupizza"
              class="white--text"
              @click="click(item.click)"
            >
              <v-row>
                <v-col cols="8" class="d-flex justify-center align-center">
                  <h3 class="text-center font-weight-medium">
                    {{ item.nombre }}
                  </h3>
                </v-col>
                <v-col cols="4">
                  <v-avatar tile size="60">
                    <v-img :src="item.img"></v-img>
                  </v-avatar>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6" class="mt-8">
        <p class="mb-2 d-flex flex-row justify-end" style="margin-top: -30px; font-size: 30px">
          <span>Total:</span>
          <moneyFormat
            class="font-weight-medium"
            style="display: inline"
            :value="data.total"
            locale="es-MX"
            currency-code="MXN"
          ></moneyFormat>
        </p>

        <v-card v-if="cliente != ''" style="margin-top: 20px; padding: 0px 15px">
          <v-row>
            <v-col cols="12" >
              <v-card-title class="pb-3">
                {{ cliente.nombres }} {{ cliente.apellidos }}
              </v-card-title>
              <v-card-subtitle class="mb-0 pb-0"
                >Teléfono {{ cliente.telefono }}</v-card-subtitle
              >
            </v-col>
            <v-col cols="8" pt-0 mt-0>
              <v-card-text class="mb-0 pb-3">
                <div>{{ cliente.direccion.calle }}</div>
                <div>
                  Exterior: {{ cliente.direccion.numero_ext }} Interior:
                  {{ cliente.direccion.numero_int }}
                </div>
                <div>Colonia {{ cliente.direccion.colonia }}</div>
              </v-card-text>
            </v-col>
            <v-col
              cols="4"
              class="d-flex justify-end align-center pr-5 pt-0 mt-0"
            >
              <v-btn icon color="green" large @click="changeAddress">
                <v-icon>mdi-reload</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>

        <v-row class="mb-3">
          <v-col cols="12" v-if="pedido.length != 0">
            <v-card class="prueba" elevation="7">
              <v-list two-line subheader color="grey lighten-5">
                <div v-for="(item, index) in pedido" :key="item._id">
                  <v-list-item
                    :class="
                      index % 2 != 0 ? 'grey lighten-5' : 'grey lighten-4'
                    "
                  >
                    <v-list-item-avatar size="30" width="150" tile>
                      <v-btn
                        @click="itemMinus(index)"
                        class="ma-2"
                        :class="
                          item.tipo == 'pizza' ? 'grey darken-1' : 'secondary'
                        "
                        tile
                        dark
                        large
                        icon
                        :disabled="
                          item.tipo == 'pizza' || item.tipo == 'promocion'
                            ? true
                            : false
                        "
                      >
                        <v-icon small>mdi-minus</v-icon>
                      </v-btn>
                      <span class="text-center">{{ item.cantidad }}</span>

                      <v-btn
                        @click="itemPlus(index)"
                        class="ma-2"
                        :class="
                          item.tipo == 'pizza' ? 'grey darken-1' : 'secondary'
                        "
                        tile
                        dark
                        large
                        icon
                        :disabled="
                          item.tipo == 'pizza' || item.tipo == 'promocion'
                            ? true
                            : false
                        "
                      >
                        <v-icon small>mdi-plus</v-icon>
                      </v-btn>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>{{ item.nombre }}</v-list-item-title>
                      <v-list-item-subtitle v-if="item.tipo == 'pizza'"
                        >{{ item.tamanos[0].nombre }} -
                        {{
                          getIngredients(item.ingredientes)
                        }}</v-list-item-subtitle
                      >
                      <v-list-item-subtitle>
                        <moneyFormat
                          class="font-weight-medium"
                          style="display: inline"
                          :value="item.precio"
                          locale="es-MX"
                          currency-code="MXN"
                        ></moneyFormat>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action
                      v-if="item.tipo == 'promocion' && item.bebidas.length > 0"
                    >
                      <v-btn icon @click="sodaChange(index)">
                        <v-icon color="green">mdi-playlist-edit</v-icon>
                      </v-btn>
                    </v-list-item-action>
                    <v-list-item-action>
                      <v-btn icon @click="removeItem(index)">
                        <v-icon color="red2">mdi-delete</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </div>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
        <h4 v-if="data.nota != ''" class="text-body-2 font-weight-medium">
          Nota:
        </h4>
        <p v-if="data.nota != ''" class="text-body-2">{{ data.nota }}</p>
      </v-col>
    </v-row>

    <client
      :showClient="showClient"
      @cancel="showClient = false"
      @clientSelected="clientSelected"
    />

    <complements
      :showComplements="showComplements"
      @itemSelected="itemSelected"
      @cancel="showComplements = false"
    />

    <sodas
      :showSodas="showSodas"
      @itemSelected="itemSelected"
      @cancel="showSodas = false"
    />

    <editSoda
      :showSodasEdit="showSodasEdit"
      :data="sodaData"
      @sodaChanged="sodaChanged"
      @cancel="showSodasEdit = false"
    />

    <promotions
      :showPromotions="showPromotions"
      @itemSelected="itemSelected"
      @cancel="showPromotions = false"
    />

    <pizzas
      :showPizzas="showPizzas"
      @itemSelected="itemSelected"
      @cancel="showPizzas = false"
    />

    <note
      :showNote="showNote"
      :note="note"
      @saveNote="saveNote"
      @cancel="showNote = false"
    />

    <wayToPay
      :showToPay="showToPay"
      @cancel="showToPay = false"
      @pagar="pagar"
      @cortesia="cortesia"
    />

    <repartidores
      :showRepartidores="showRepartidores"
      :data="repartidores"
      @envioDomicilio="envioDomicilio"
      @cancel="showRepartidores = false"
    />

    <selectAddress
      :showAddressClient="showAddressClient"
      :client="cliente"
      @cancel="showAddressClient = false"
      @addressSelect="addressSelect"
    />

    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import Client from "../services/Client";
import Sale from "../services/Sale";
import DeliveryMen from "../services/DeliveryMen";

export default {
  name: "InicioView",
  components: {
    moneyFormat: () =>
      import(/* webpackChunkName: "moneyFormat" */ "vue-money-format"),
    client: () => import("../components/Base/Client"),
    complements: () => import("../components/Base/Complements"),
    sodas: () => import("../components/Base/Sodas"),
    note: () => import("../components/Base/Note"),
    pizzas: () => import("../components/Base/Pizzas"),
    promotions: () => import("../components/Base/Promotion"),
    editSoda: () => import("../components/Base/SodasEdit"),
    wayToPay: () => import("../components/Base/WayToPay"),
    repartidores: () => import("../components/Base/Repartidores"),
    selectAddress: () => import("../components/Base/selectAddress"),
  },
  data: () => ({
    overlay: false,
    showClient: false,
    showComplements: false,
    showSodas: false,
    showNote: false,
    showPizzas: false,
    showPromotions: false,
    showSodasEdit: false,
    showToPay: false,
    showRepartidores: false,
    showAddressClient: false,
    sodaData: {},
    cliente: "",
    opciones: [
      {
        nombre: "Cliente",
        img:
          "https://firebasestorage.googleapis.com/v0/b/su-pizza-mx.appspot.com/o/imagenes-administrativas%2Fclientes.svg?alt=media&token=6030af0c-3bb7-4e99-81d0-e38054abccc5",
        disabled: false,
        click: "cliente",
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
    pedido: [],
    note: "",
    repartidores: [],
  }),
  methods: {
    itemMinus(index) {
      if (this.pedido[index].cantidad <= 1) return true;
      this.pedido[index].cantidad--;
      this.sumarArticulos();
    },
    itemPlus(index) {
      this.pedido[index].cantidad++;
      this.sumarArticulos();
    },
    click(item) {
      if (item == "cliente") this.addClient();
      if (item == "complemento") this.showComplements = true;
      if (item == "bebida") this.showSodas = true;
      if (item == "nota") this.noteView();
      if (item == "pizza") this.showPizzas = true;
      if (item == "promocion") this.showPromotions = true;
      if (item == "pagar") this.pay();
      return true;
    },
    hideModal(modal) {
      switch (modal) {
        case "complemento":
          this.showComplements = false;
          break;
        case "bebida":
          this.showSodas = false;
          break;
        case "pizza":
          this.showPizzas = false;
          break;
        case "promocion":
          this.showPromotions = false;
          break;
      }
    },
    sumarArticulos() {
      let aux = 0;
      this.pedido.forEach((e) => {
        aux += e.precio * e.cantidad;
      });
      this.data.total = aux;
    },
    removeItem(index) {
      this.pedido.splice(index, 1);
      this.sumarArticulos();
    },
    async addClient() {
      this.showClient = true;
    },
    async getClients() {
      let token = localStorage.token;

      try {
        const response = await Client.getAll(token);
        if (response.status == 200) this.clients = response.data;
      } catch (error) {
        console.warn(error.response);
      }
    },
    clientSelected(client) {
      this.cliente = client;
      this.showClient = false;
    },
    showOptions() {
      this.opciones.forEach((e) => {
        e.disabled = false;
      });
    },
    hideOptions() {
      this.data.entrega = "Sucursal";
      this.opciones.forEach((e) => {
        if (e.nombre != "Cliente") e.disabled = true;
      });
    },
    noteView() {
      this.note = this.data.nota;
      this.showNote = true;
    },
    itemSelected(item) {
      let data = Object.assign({}, item);
      let id = data._id;
      let existe = false;

      console.log(data);
      if (data.tipo != "pizza" && data.tipo != "promocion") {
        console.log("entreee");
        this.pedido.forEach((e) => {
          if (e._id == id) {
            e.cantidad++;
            existe = true;
          }
        });
      }

      if (existe == false) this.pedido.unshift(data);
      this.sumarArticulos();
      this.hideModal(item.tipo);
    },
    saveNote(note) {
      this.data.nota = note;
      this.showNote = false;
    },
    getIngredients(ingredients) {
      let data = "";
      let limit = ingredients.length - 1;
      ingredients.forEach((e, index) => {
        data += e.nombre;
        if (index < limit) {
          data += ", ";
        }
      });
      return data;
    },
    sodaChange(index) {
      this.sodaData = {
        index,
        price: this.pedido[index].bebidas[0].precio,
        limit: this.pedido[index].bebidas.length,
      };
      this.showSodasEdit = true;
    },
    sodaChanged(data) {
      this.pedido[data.index].bebidas = data.sodas;
      this.showSodasEdit = false;
    },
    async pay() {
      if (this.data.entrega == "Domicilio") {
        await this.getRepartidores();
        this.showRepartidores = true;

        return true;
      }

      if (this.pedido.length <= 0) {
        this.mesajeError();
        return;
      }

      this.showToPay = true;
    },
    async getRepartidores() {
      this.overlay = true;
      let token = localStorage.token;

      try {
        const response = await DeliveryMen.getAll(token);
        if (response.status == 200) this.repartidores = response.data;
      } catch (error) {
        console.warn(error.response);
      } finally {
        this.overlay = false;
      }
    },
    async envioDomicilio(id) {
      this.overlay = true;
      this.showRepartidores = false;
      let data = await this.recuperarPedido("En ruta", id, "Efectivo", false);

      // Rellenar el pedido
      this.pedido.forEach((e) => {
        if (e.tipo == "pizza") data.pizzas.push(e);
        if (e.tipo == "promocion") data.promos.push(e);
        if (e.tipo == "bebida") data.bebidas.push(e);
        if (e.tipo == "complemento") data.complementos.push(e);
      });

      this.enviarPago(data);
    },
    recuperarPedido(status, repartidor, formaDePago, pagado) {
      return {
        tipo: "Panel",
        status: status,
        entrega: this.data.entrega,
        fecha: new Date(),
        cliente: this.cliente._id,
        repartidor: repartidor,
        pizzas: [],
        promos: [],
        bebidas: [],
        complementos: [],
        direccion: this.cliente.direccion._id,
        forma_pago: formaDePago,
        total: this.data.total,
        pagado: pagado,
        nota: this.data.nota,
      };
    },
    mesajeError() {
      this.$swal({
        icon: "error",
        title: `<h2 style="font-family: 'Open Sans', sans-serif;">Oops...</h2>`,
        html: `<span style="font-family: 'Open Sans', sans-serif;">Selecciona al menos un producto para poder generar la venta.</span>`,
        confirmButtonText: `<span style="font-family: 'Open Sans', sans-serif;">Ok!</span>`,
      });
    },
    async pagar(tipo) {
      this.overlay = true;
      this.showToPay = false;
      let data;

      if (tipo == "Pago pendiente") {
        data = await this.recuperarPedido(tipo, null, tipo, false);
      }

      if (tipo != "Pago pendiente") {
        data = await this.recuperarPedido("Completado", null, tipo, true);
      }

      // Rellenar el pedido
      this.pedido.forEach((e) => {
        if (e.tipo == "pizza") data.pizzas.push(e);
        if (e.tipo == "promocion") data.promos.push(e);
        if (e.tipo == "bebida") data.bebidas.push(e);
        if (e.tipo == "complemento") data.complementos.push(e);
      });

      this.enviarPago(data);
    },
    async enviarPago(pedido) {
      let token = localStorage.token;
      try {
        const response = await Sale.setSale(token, pedido);
        if (response.status == 200) {
          this.$swal({
            icon: "success",
            title: `<h2 style="font-family: 'Open Sans'">Compra finalizada</h2>`,
            showConfirmButton: false,
            timer: 1500,
          });

          this.cliente = "";
          this.total = 0;
          this.pedido = [];
          this.note = "";
          this.data.total = 0;
          this.data.nota = "";
          this.cliente = "";
        }
        console.log(response);
      } catch (error) {
        console.warn(error.response);
      } finally {
        this.overlay = false;
      }
    },
    async cortesia(data) {
      this.overlay = true;
      this.showToPay = false;
      let tipo;

      console.log(data);
      if (data.empleado == "") tipo = "Cortesia";
      if (data.empleado != "") tipo = "Cortesia empleado";

      let pedido = await this.recuperarPedido("Completado", null, tipo, false);

      // Rellenar el pedido
      this.pedido.forEach((e) => {
        if (e.tipo == "pizza") pedido.pizzas.push(e);
        if (e.tipo == "promocion") pedido.promos.push(e);
        if (e.tipo == "bebida") pedido.bebidas.push(e);
        if (e.tipo == "complemento") pedido.complementos.push(e);
      });

      console.warn(pedido);
      pedido.empleado = data.empleado;
      pedido.supervisor = data.supervisor;

      await this.enviarPago(pedido);
    },
    changeAddress() {
      this.showAddressClient = true;
    },
    addressSelect(item) {
      this.cliente = item;
      this.showAddressClient = false;
    },
  },
  watch: {
    cliente: function () {
      if (this.cliente != "") this.showOptions();
      if (this.cliente == "") this.hideOptions();
    },
  },
};
</script>

<style lang="scss" scoped>
.prueba {
  max-height: 53vh;
  overflow-y: auto;
}
</style>
