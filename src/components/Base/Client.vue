<template>
  <v-dialog v-model="showClient" persistent max-width="950">
    <v-card>
      <v-toolbar dense flat color="rojoSupizza" dark class="mb-6">
        <v-toolbar-title class="font-weight-medium">Clientes</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="9">
            <v-text-field
              class="mb-3"
              outlined
              dense
              v-model="search"
              append-icon="mdi-magnify"
              label="Buscar cliente"
              single-line
              hide-details
            ></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-btn block depressed color="green" dark @click="showAdd = true"
              >Agregar cliente</v-btn
            >
          </v-col>
        </v-row>
        <v-data-table :headers="headers" :items="clients" :search="search">
          <template v-slot:item.seleccionar="{ item }">
            <v-btn depressed color="green" @click="seleccionar(item)" dark
              >Seleccionar</v-btn
            >
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red2 darken-1" text @click="cancel">Cancelar</v-btn>
      </v-card-actions>
    </v-card>

    <addClient
      :showAdd="showAdd"
      @cancel="showAdd = false"
      @saved="getAllClients"
    />

    <selectAddress
      :showAddressClient="showAddressClient"
      :client="client"
      @addressSelect="enviarDireccion"
      @cancel="showAddressClient = false"
    />

    <addAddress
      v-if="showAddAddress"
      :showAddAddress="showAddAddress"
      :idClient="idClient"
      :isEdit="false"
      @saved="direccionGuardada"
      @cancel="showAddAddress = false"
    />

    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-dialog>
</template>

<script>
// Peticiones HTTP
import Address from "../../services/Address";
import Client from "../../services/Client";

// Componentes
import addAddress from "../Base/AddAddress";

export default {
  name: "ClientComponent",
  components: {
    selectAddress: () => import("./selectAddress"),
    addClient: () => import("./AddClient"),
    addAddress,
  },
  props: {
    showClient: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    overlay: false,
    showAddressClient: false,
    showAddAddress: false,
    headers: [
      {
        text: "Nombre(s)",
        value: "nombres",
      },
      { text: "Apellidos", value: "apellidos" },
      { text: "Teléfono", value: "telefono" },
      { text: "Correo", value: "mail" },
      { text: "Seleccionar", value: "seleccionar", sortable: false },
    ],
    search: "",
    showAdd: false,
    clients: [],
    client: {},
    idClient: "",
  }),
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    async seleccionar(client) {
      let data = client;
      let direccionAux = await this.getAddress(client._id);

      if (direccionAux.length < 1) {
        this.idClient = client._id;
        this.showAddAddress = true;
      }

      if (direccionAux.length == 1) {
        data.direccion = direccionAux[0];
        this.enviarDireccion(data);
      }

      if (direccionAux.length > 1) {
        this.client = data;
        this.showAddressClient = true;
      }
    },
    enviarDireccion(client) {
      this.showAddressClient = false;
      this.$emit("clientSelected", client);
    },
    async getAddress(clientId) {
      let token = localStorage.token;

      try {
        const response = await Address.get(token, clientId);
        return response.data;
      } catch (error) {
        console.warn(error.data);
      }
    },
    async getAllClients() {
      this.overlay = true;
      let token = localStorage.token;

      try {
        const { data, status } = await Client.getAll(token);
        if (status == 200) this.clients = data;
      } catch (error) {
        console.warn(error.response);
      } finally {
        this.showAdd = false;
        this.overlay = false;
      }
    },
    direccionGuardada() {
      this.showAddAddress = false;
      const index = this.clients.findIndex(
        (client) => client._id == this.idClient
      );

      const client = this.clients[index];

      this.seleccionar(client);
    },
  },
  watch: {
    showClient: function () {
      if (this.showClient) this.getAllClients();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>