<template>
  <v-row class="contenedor">
    <v-col cols="12" class="d-flex justify-center align-center contenedor-card">
      <v-card class="mx-auto" color="#018143" width="400" elevation="24">
        <v-col justify="center" align="center" align-content="center">
          <v-img
            class="d-flex justify-center"
            max-width="200px"
            src="https://firebasestorage.googleapis.com/v0/b/su-pizza-mx.appspot.com/o/imagenes-administrativas%2FsuPizzaCompleto.svg?alt=media&token=4b3304fe-e9ac-4b84-9934-b73204f540b9"
          ></v-img>
        </v-col>

        <h2 class="text-center white--text">Bienvenido</h2>
        <v-container v-if="mostrarError">
          <v-alert prominent type="error" class="alert--content">
            <v-row align="center">
              <v-col class="grow">{{mensajeError}}</v-col>
            </v-row>
          </v-alert>
        </v-container>

        <v-card-text class="text--primary">
          <form>
            <v-col class="contenedor-form">
              <span class="white--text">Usuario</span>
              <v-text-field
                v-model="user.username"
                color="#018143"
                prepend-inner-icon="mdi-account"
                background-color="grey lighten-4"
                placeholder="Ingresa tu usuario"
                dense
                solo
              ></v-text-field>
            </v-col>
            <v-col class="contenedor-form">
              <span class="white--text">Contraseña</span>
              <v-text-field
                v-model="user.password"
                type="password"
                color="#018143"
                prepend-inner-icon="mdi-key"
                background-color="grey lighten-4"
                placeholder="Ingresa tu contraseña"
                dense
                solo
              ></v-text-field>
            </v-col>
          </form>
        </v-card-text>

        <v-card-actions>
          <v-btn
            :loading="loading"
            @click="login"
            class="font-weight-medium"
            color="white"
            block
            text
          >
            <v-icon left>mdi-lock-open</v-icon>Ingresar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapMutations } from "vuex";
import Auth from "../services/Auth";

export default {
  name: "LoginView",
  data: () => ({
    loading: false,
    mensajeError: "",
    mostrarError: false,
    user: {
      username: "admin@mail.com",
      password: "12345678",
    },
  }),
  methods: {
    ...mapMutations(["setModulos"]),
    async login() {
      this.loading = true;
      try {
        const response = await Auth.login(this.user);
        if (response.status == 200) {
          await localStorage.setItem("token", response.data.Token);
          await this.setModulos(response.data.Modulos);
          this.$router.push("/");
        }
        if (response.status == 202) {
          this.mensajeError = response.data;
          this.error();
        }
      } catch (error) {
        console.warn(error.response);
      } finally {
        this.loading = false;
      }
    },
    error() {
      this.mostrarError = true;
      setTimeout(() => {
        this.mostrarError = false;
        this.mensajeError = "";
      }, 2500);
    },
  },
};
</script>

<style lang="scss" scoped>
.contenedor-card {
  height: 100vh;
}
.logo-login {
  padding-top: 0rem;
}
.contenedor {
  background-image: url("https://firebasestorage.googleapis.com/v0/b/su-pizza-mx.appspot.com/o/imagenes-administrativas%2Fmantel.png?alt=media&token=48213658-2c7e-47d3-94ae-ac4cc7258b51");
  background-repeat: repeat;
}
.contenedor-form {
  padding: 0;
  margin: 0;
}
.alert--content {
  margin-bottom: 0;
}
</style>