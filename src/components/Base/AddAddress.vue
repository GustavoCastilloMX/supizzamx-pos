<template>
  <v-dialog v-model="showAddAddress" persistent max-width="600">
    <v-card :loading="loading">
      <template slot="progress">
        <v-progress-linear color="red" indeterminate></v-progress-linear>
      </template>
      <v-toolbar color="rojoSupizza" flat dense>
        <h2 class="white--text font-weight-bold text-h5">Agregar dirección</h2>
      </v-toolbar>
      <v-card-text class="pb-0">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-container>
            <v-row class="mt-6">
              <v-col cols="12" class="pt-0 pb-0">
                <v-text-field
                  label="Alias de dirección (casa, trabajo, etc)"
                  color="green"
                  v-model="address.nombre"
                  @input="upperCase($event, address, 'nombre')"
                  dense
                  outlined
                  required
                  class="mt-3"
                  :rules="name"
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="pt-0 pb-0">
                <v-text-field
                  label="Calle"
                  color="green"
                  v-model="address.calle"
                  @input="upperCase($event, address, 'calle')"
                  dense
                  outlined
                  required
                  class="mt-3"
                  :rules="name"
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="pt-0 pb-0">
                <v-text-field
                  label="Colonia"
                  color="green"
                  v-model="address.colonia"
                  @input="upperCase($event, address, 'colonia')"
                  dense
                  outlined
                  required
                  class="mt-3"
                  :rules="name"
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="pt-0 pb-0">
                <v-text-field
                  label="Número exterior"
                  color="green"
                  v-model="address.numero_ext"
                  dense
                  outlined
                  required
                  class="mt-3"
                  @keydown="validarNumero"
                  :rules="name"
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="pt-0 pb-0">
                <v-text-field
                  label="Número interior"
                  color="green"
                  v-model="address.numero_int"
                  @input="upperCase($event, address, 'numero_int')"
                  dense
                  outlined
                  required
                  class="mt-3"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pt-0 pb-0">
                <v-textarea
                  label="Referencia del domicilio"
                  color="green"
                  v-model="address.referencia"
                  @input="upperCase($event, address, 'referencia')"
                  dense
                  outlined
                  required
                  class="mt-3"
                  auto-grow
                  height="100"
                  :rules="name"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-btn color="red" text @click="cancel">Cancelar</v-btn>
        <v-btn
          color="green darken-1"
          depressed
          class="white--text"
          @click="save"
          :loading="loading"
        >Guardar</v-btn>
      </v-card-actions>
    </v-card>

    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-dialog>
</template>

<script>
import { rulesFormMixin } from "../../mixins/rulesForm";
import Address from "../../services/Address";

export default {
  name: "AddDirectionComponent",
  mixins: [rulesFormMixin],
  props: {
    showAddAddress: {
      type: Boolean,
      required: true,
    },
    idClient: {
      type: String,
      required: true,
    },
    isEdit: {
      type: Boolean,
      required: true,
    },
    addressEdit: {
      type: Object,
      required: false,
    },
  },
  data: () => ({
    loading: false,
    valid: true,
    address: {
      nombre: "",
      calle: "",
      numero_ext: "",
      numero_int: "",
      colonia: "",
      referencia: "",
      cliente: "",
    },
  }),
  methods: {
    async save() {
      if (!this.$refs.form.validate()) return true;

      this.loading = true;
      if (this.isEdit) await this.editAddress();
      if (!this.isEdit) await this.saveAddress();
      this.loadingFalse = false;
    },
    async saveAddress() {
      let token = localStorage.token;
      this.address.cliente = await this.idClient;

      try {
        const response = await Address.create(token, this.address);
        if (response.status == 200) this.saved();
        if (response.status == 202) this.showMessageError(response.data);
      } catch (error) {
        console.warn(error.response);
      } finally {
        this.loading = false;
      }
    },
    async editAddress() {
      let token = localStorage.token;
      let idAddress = this.address._id;
      this.address.cliente = await this.idClient;

      try {
        const response = await Address.edit(token, idAddress, this.address);
        if (response.status == 200) this.saved();
        if (response.status == 202) this.showMessageError(response.data);
      } catch (error) {
        console.warn(error.response);
      } finally {
        this.loading = false;
      }
    },
    cancel() {
      this.$refs.form.reset();
      this.$emit("cancel");
    },
    saved() {
      this.loading = false;
      this.$refs.form.reset();
      this.$emit("saved");
    },
    validarNumero(e) {
      if (
        !(e.keyCode >= 96 && e.keyCode <= 105) &&
        !(e.keyCode >= 48 && e.keyCode <= 57) &&
        !(e.keyCode == 8 || e.keyCode == 46) &&
        !(e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 9)
      ) {
        e.preventDefault();
      }
    },
    async showMessageError(message) {
      this.loading = false;
      await this.$swal({
        icon: "error",
        title: `<span style="font-family: 'Open Sans'">${message}</span>`,
        confirmButtonText: `<span style="font-family: 'Open Sans'">Ok</span>`,
        showConfirmButton: true,
      });
    },
  },
  watch: {
    addressEdit: function () {
      this.address = Object.assign({}, this.addressEdit);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>