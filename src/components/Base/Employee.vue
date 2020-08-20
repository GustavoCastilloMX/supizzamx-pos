<template>
  <v-dialog v-model="showEmployee" persistent max-width="600">
    <v-card>
      <v-toolbar dense flat color="rojoSupizza" dark class="mb-5">
        <v-toolbar-title class="font-weight-medium">Cortesías empleados</v-toolbar-title>
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
            <v-btn @click="setEmpleado(item._id)" color="green" depressed dark>Seleccionar</v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <aut
      :showAutorization="showAutorization"
      :employee="employee"
      @cancel="showAutorization = false"
      @autorizado="autorizado"
    />
  </v-dialog>
</template>

<script>
export default {
  components: {
    aut: () => import("./Autorization"),
  },
  props: {
    showEmployee: {
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
    employee: "",
  }),
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    setEmpleado(id) {
      this.employee = id;
      this.showAutorization = true;
    },
    autorizado(data) {
      this.$emit("autorizado", data);
      this.showAutorization = false;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>