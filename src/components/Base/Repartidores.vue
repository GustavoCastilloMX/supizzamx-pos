<template>
  <v-dialog v-model="showRepartidores" persistent max-width="600">
    <v-card>
      <v-toolbar dense flat color="rojoSupizza" dark class="mb-5">
        <v-toolbar-title class="font-weight-medium">Repartidores</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="white" text @click="cancel">Cancelar</v-btn>
      </v-toolbar>
      <v-card-text>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Buscar"
          outlined
          dense
          single-line
          hide-details
        ></v-text-field>
        <v-data-table :headers="headers" :items="data" :search="search">
          <template v-slot:item.seleccionar="{ item }">
            <v-btn @click="setRepartidor(item._id)" color="green" depressed dark>Seleccionar</v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    showRepartidores: {
      type: Boolean,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    showAutorization: false,
    headers: [
      {
        text: "Nombre(s)",
        value: "nombres",
      },
      {
        text: "Apellidos",
        value: "apellidos",
      },
      {
        text: "Seleccionar",
        value: "seleccionar",
      },
    ],
    search: "",
  }),
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    setRepartidor(id) {
      this.$emit("envioDomicilio", id);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>