<template>
  <v-dialog v-model="showClient" persistent max-width="800">
    <v-card>
      <v-toolbar dense flat color="rojoSupizza" dark class="mb-5">
        <v-toolbar-title class="font-weight-medium">Clientes</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="8">
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

          <v-col cols="4">
            <v-btn block depressed color="green" dark @click="showAdd = true">Agregar cliente</v-btn>
          </v-col>
        </v-row>
        <v-data-table :headers="headers" :items="clients" :search="search" class="elevation-5">
          <template v-slot:item.seleccionar="{ item }">
            <v-btn depressed color="green" @click="seleccionar(item)" dark>Seleccionar</v-btn>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="cancel">Cancelar</v-btn>
      </v-card-actions>
    </v-card>

    <addClient :showAdd="showAdd" @cancel="showAdd = false" @saved="getAllClients" />

    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-dialog>
</template>

<script>
import Address from "../../services/Address";
import Client from "../../services/Client";

export default {
  name: "ClientComponent",
  components: {
    addClient: () => import("./AddClient"),
  },
  props: {
    showClient: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    overlay: false,
    headers: [
      {
        text: "Nombre(s)",
        value: "nombres",
      },
      { text: "Apellidos", value: "apellidos" },
      { text: "Teléfono", value: "telefono" },
      { text: "Email", value: "mail" },
      { text: "Seleccionar", value: "seleccionar", sortable: false },
    ],
    search: "",
    showAdd: false,
    clients: [],
  }),
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    async seleccionar(client) {
      let data = client;
      let direccionAux = await this.getAddress(client._id);
      data.direccion = direccionAux[0];
      this.$emit("clientSelected", data);
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
  },
  watch: {
    showClient: function () {
      console.log("ENTRE");
      if (this.showClient) this.getAllClients();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>