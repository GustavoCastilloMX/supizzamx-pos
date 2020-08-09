<template>
  <v-dialog v-model="showClient" persistent max-width="800">
    <v-card>
      <v-toolbar dense flat color="rojoSupizza" dark>
        <v-toolbar-title class="font-weight-medium">Clientes</v-toolbar-title>
      </v-toolbar>
      <v-card-title class="headline">Use Google's location service?</v-card-title>
      <v-card-text>Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="cancel">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ClientComponent",
  props: {
    showClient: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>