<template>
  <v-dialog v-model="showAddressClient" persistent max-width="600">
    <v-card>
      <v-toolbar dense flat color="rojoSupizza" dark class="mb-5">
        <v-toolbar-title class="font-weight-medium">Selecciona la dirección</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="7">
            <h2>{{client.nombres}} {{client.apellidos}}</h2>
            <h3>Teléfono {{client.telefono}}</h3>
          </v-col>
          <v-col cols="5" class="d-flex justify-center align-end">
            <v-btn small depressed color="green" dark @click="createAddress">Agregar dirección</v-btn>
          </v-col>
          <v-col cols="12" v-for="item in address" :key="item._id">
            <v-card class="pl-3 pr-3 pt-3">
              <h2 class="mb-2 grey--text text--darken-2">{{ item.nombre }}</h2>
              <v-row class="mt-3">
                <v-col cols="6" class="pb-0">
                  <span class="font-weight-bold grey--text text--darken-2 mr-2">Calle:</span>
                  <span class="grey--text text--darken-2 font-italic">{{item.calle}}</span>
                </v-col>
                <v-col cols="6" class="pb-0">
                  <span class="font-weight-bold grey--text text--darken-2 mr-2">Número exterior:</span>
                  <span class="mb-2 grey--text text--darken-2 font-italic">{{item.numero_ext}}</span>
                </v-col>
                <v-col cols="6" class="pb-0">
                  <span class="font-weight-bold grey--text text--darken-2 mr-2">Número interior:</span>
                  <span class="mb-2 grey--text text--darken-2 font-italic">{{item.numero_int}}</span>
                </v-col>
                <v-col cols="6" class="pb-0">
                  <span class="font-weight-bold grey--text text--darken-2 mr-2">Colonia:</span>
                  <span class="mb-2 grey--text text--darken-2 font-italic">{{item.colonia}}</span>
                </v-col>
                <v-col cols="6" class="pb-0">
                  <span class="mt-3 font-weight-bold grey--text text--darken-2">Referencias:</span>
                  <p class="grey--text text--darken-2 font-italic">{{item.referencia}}</p>
                </v-col>
              </v-row>
              <v-card-actions class="d-flex justify-end">
                <!-- <v-btn depressed color="red" dark @click="eliminarDireccion(item._id)">
                      <v-icon left>mdi-delete</v-icon>Eliminar
                </v-btn>-->
                <v-btn depressed color="blue darken-2" dark @click="directionEdit(item)">
                  <v-icon left>mdi-file-document-edit</v-icon>Editar
                </v-btn>
                <v-btn depressed color="green" dark @click="addressSelect(item)">
                  <v-icon left>mdi-check</v-icon>Seleccionar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text @click="cancel">Cancelar</v-btn>
      </v-card-actions>
    </v-card>

    <addAddress
      :showAddAddress="showAddAddress"
      :idClient="idClient"
      :isEdit="isEdit"
      :addressEdit="addressEdit"
      @saved="init"
      @cancel="showAddAddress = false"
    />

    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-dialog>
</template>

<script>
import Address from "../../services/Address";

export default {
  name: "NoteComponent",
  components: {
    addAddress: () => import("./AddAddress"),
  },
  props: {
    showAddressClient: {
      type: Boolean,
      required: true,
    },
    client: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    overlay: false,
    newNote: "",
    showAddAddress: false,
    idClient: "",
    address: "",
    isEdit: false,
    addressEdit: {},
  }),
  methods: {
    async init() {
      this.overlay = true;
      await this.getAddressClient(this.client._id);
      this.overlay = false;
      this.showAddAddress = false;
    },
    cancel() {
      this.$emit("cancel");
    },
    addressSelect(item) {
      let data = this.client;
      data.direccion = item;
      this.$emit("addressSelect", data);
    },
    createAddress() {
      this.isEdit = false;
      this.idClient = this.client._id;
      this.showAddAddress = true;
    },
    async getAddressClient(idClient) {
      let token = localStorage.token;

      try {
        const { data, status } = await Address.get(token, idClient);
        if (status == 200) this.address = data;
      } catch (error) {
        console.log(error);
      }
    },
    directionEdit(item) {
      this.isEdit = true;
      this.addressEdit = item;
      this.idClient = this.client._id;
      this.showAddAddress = true;
    },
  },
  watch: {
    showAddressClient: function () {
      if (this.showAddressClient) this.init();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>