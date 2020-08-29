<template>
  <v-dialog v-model="showAdd" persistent max-width="600">
    <v-card :loading="loading">
      <template slot="progress">
        <v-progress-linear color="red" indeterminate></v-progress-linear>
      </template>
      <v-toolbar color="green" flat dense>
        <h2 class="white--text font-weight-bold text-h5">AGREGAR CLIENTE</h2>
      </v-toolbar>
      <v-card-text class="pb-0">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-container>
            <v-row>
              <v-col cols="6" class="pt-0 pb-0">
                <v-text-field
                  label="Nombre(s)"
                  color="green"
                  v-model="client.nombres"
                  @input="upperCase($event, client, 'nombres')"
                  dense
                  outlined
                  required
                  class="mt-3"
                  :rules="name"
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="pt-0 pb-0">
                <v-text-field
                  label="Apellidos"
                  color="green"
                  v-model="client.apellidos"
                  @input="upperCase($event, client, 'apellidos')"
                  dense
                  outlined
                  class="mt-3"
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="pt-0 pb-0">
                <v-text-field
                  label="Teléfono"
                  color="green"
                  v-model="client.telefono"
                  dense
                  outlined
                  required
                  class="mt-3"
                  counter="10"
                  @keydown="validarNumero"
                  :rules="isPhone"
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="pt-0 pb-0">
                <v-text-field
                  label="Correo electronico"
                  color="green"
                  v-model="client.mail"
                  @input="upperCase($event, client, 'mail')"
                  dense
                  outlined
                  class="mt-3"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="mt-6">
              <v-col cols="12">
                <span class="text-subtitle-2 font-weight-bold">Dirección</span>
              </v-col>
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
  </v-dialog>
</template>

<script>
import { rulesFormMixin } from "../../mixins/rulesForm";
import Cliente from "../../services/Client";
import Address from "../../services/Address";

export default {
  name: "AddClientComponent",
  mixins: [rulesFormMixin],
  props: {
    showAdd: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    loading: false,
    valid: true,
    client: {
      nombres: "",
      apellidos: "",
      telefono: "",
      mail: "",
      password: null,
      status: null,
    },
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
      await this.saveClient();
      this.loading = false;
    },
    async saveClient() {
      let token = localStorage.token;

      try {
        const response = await Cliente.create(token, this.client);
        if (response.status == 200)
          await this.saveAddress(token, response.data._id);

        if (response.status == 202)
          this.showMessageError(response.data.message);
      } catch (error) {
        console.warn(error.response);
      }
    },
    async saveAddress(token, idClient) {
      this.address.cliente = await idClient;

      try {
        const response = await Address.create(token, this.address);
        if (response.status == 200) this.saved();
        if (response.status == 202)
          this.showMessageError(response.data.message);
      } catch (error) {
        console.warn(error.response);
      }
    },
    cancel() {
      this.$refs.form.reset();
      this.$emit("cancel");
    },
    saved() {
      let message = "Cliente creado correctamente!";
      this.showMessageSuccessful(message);
      this.$refs.form.reset();
      this.$emit("saved");
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
    showMessageSuccessful(message) {
      this.$swal({
        icon: "success",
        title: `<span style="font-family: 'Open Sans'">${message}</span>`,
        showConfirmButton: false,
        timer: 1500,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.my-input input {
  text-transform: uppercase !important;
}
</style>