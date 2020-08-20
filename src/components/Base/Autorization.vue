<template>
  <v-dialog v-model="showAutorization" persistent max-width="600">
    <v-card>
      <v-toolbar dense flat color="rojoSupizza" dark class="mb-5">
        <v-toolbar-title class="font-weight-medium">Autorizacion de supervisor</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="white" text @click="cancel">Cancelar</v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="psw"
            type="password"
            outlined
            label="Contraseña supervisor"
            placeholder="Ingresa la contraseña de autorización"
            :rules="rule"
          ></v-text-field>
        </v-form>
        <v-btn block depressed color="green" dark :loading="loading" @click="autorizacion">Aceptar</v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import Aut from "../../services/Auth";
export default {
  props: {
    showAutorization: {
      type: Boolean,
      required: true,
    },
    employee: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    valid: true,
    loading: false,
    psw: "",
    rule: [(v) => !!v || "El campo es requerido"],
  }),
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    async autorizacion() {
      if (!this.$refs.form.validate()) return true;

      let token = localStorage.token;
      let clave = {
        claveEncargado: this.psw,
      };
      this.loading = true;

      try {
        const response = await Aut.obtenerAutorizacionCortesia(token, clave);
        if (!response.data.autorizado) {
          this.$swal({
            icon: "error",
            title: `<h3 style="font-family: 'Open Sans'">No autorizado</h3>`,
            confirmButtonText: `<span style="font-family: 'Open Sans'">Ok</span>`,
          });
        }

        if (response.data.autorizado) {
          let empleado = this.employee;
          if (this.employee == "") empleado = null;
          let data = {
            empleado: empleado,
            supervisor: response.data.supervisor,
          };

          this.$emit("autorizado", data);

          this.$swal({
            icon: "success",
            title: `<h2 style="font-family: 'Open Sans'">Autorizado</h2>`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (error) {
        console.warn(error.response);
      } finally {
        this.$refs.form.reset();
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>