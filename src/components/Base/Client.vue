<template>
  <v-dialog v-model="showClient" persistent max-width="800">
    <v-card>
      <v-toolbar dense flat color="rojoSupizza" dark class="mb-5">
        <v-toolbar-title class="font-weight-medium">Clientes</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-data-table :headers="headers" :items="clients" class="elevation-1">
          <template v-slot:item.seleccionar="{ item }">
            <v-btn depressed color="green" @click="seleccionar(item)" dark>Seleccionar</v-btn>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">Reset</v-btn>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="cancel">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

import Address from "../../services/Address";

export default {
  name: "ClientComponent",
  props: {
    showClient: {
      type: Boolean,
      required: true,
    },
    clients: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    headers: [
      {
        text: "Nombre(s)",
        value: "nombres",
      },
      { text: "Apellidos", value: "apellidos" },
      { text: "Teléfono", value: "telefono" },
      { text: "Email", value: "mail" },
      { text: "Actions", value: "actions", sortable: false },
      { text: "Seleccionar", value: "seleccionar", sortable: false },
    ],
  }),
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    async seleccionar(client) {
        let data = client;
        let direccionAux = await this.getAddress(client._id);
        data.direccion = direccionAux[0];
        this.$emit('clientSelected', data);
    },
    async getAddress(clientId) {
        let token = localStorage.token;

        try {
            const response = await Address.get(token, clientId);
            return response.data;
        } catch (error) {
            console.warn(error.data);
        }
    }
  },
};
</script>

<style lang="scss" scoped>
</style>