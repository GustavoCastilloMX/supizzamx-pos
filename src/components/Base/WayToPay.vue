<template>
  <v-dialog v-model="showToPay" persistent max-width="600">
    <v-card>
      <v-toolbar dense flat color="rojoSupizza" dark class="mb-5">
        <v-toolbar-title class="font-weight-medium">Formas de pago</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="white" text @click="cancel">Cancelar</v-btn>
      </v-toolbar>
      <v-container>
        <v-row>
          <v-col cols="6">
            <v-card class="pa-5 indigo" @click="pagar('Efectivo')">
              <v-row class="d-flex justify-center align-center">
                <v-col cols="5">
                  <v-avatar tile size="80">
                    <v-img
                      src="https://firebasestorage.googleapis.com/v0/b/su-pizza-mx.appspot.com/o/formas-de-pago%2Fcash.svg?alt=media&token=7b76c7d2-5c75-4dfc-b073-5a2fb00a2cfd"
                    ></v-img>
                  </v-avatar>
                </v-col>
                <v-col cols="7">
                  <span class="font-weight-medium white--text">Efectivo</span>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card class="pa-5 indigo" @click="pagar('Tarjeta')">
              <v-row class="d-flex justify-center align-center">
                <v-col cols="5">
                  <v-avatar tile size="80">
                    <v-img
                      src="https://firebasestorage.googleapis.com/v0/b/su-pizza-mx.appspot.com/o/formas-de-pago%2Ftarjeta-de-credito.svg?alt=media&token=481bdc97-4335-44a5-996d-bae8d13bb0b3"
                    ></v-img>
                  </v-avatar>
                </v-col>
                <v-col cols="7">
                  <span class="font-weight-medium white--text">Tarjeta</span>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <!-- Pendiente de pago -->
          <v-col cols="6">
            <v-card class="pa-5 indigo" @click="pagar('Pago pendiente')">
              <v-row class="d-flex justify-center align-center">
                <v-col cols="5">
                  <v-avatar tile size="80">
                    <v-img
                      src="https://firebasestorage.googleapis.com/v0/b/su-pizza-mx.appspot.com/o/formas-de-pago%2Fpago_pendiente.svg?alt=media&token=34a3a048-27aa-4c17-ab2a-8c84d1493999"
                    ></v-img>
                  </v-avatar>
                </v-col>
                <v-col cols="7">
                  <span class="font-weight-medium white--text">Pago pendiente</span>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card class="pa-5 indigo" @click="pagar('Cortesia Empleado')">
              <v-row class="d-flex justify-center align-center">
                <v-col cols="5">
                  <v-avatar tile size="80">
                    <v-img
                      src="https://firebasestorage.googleapis.com/v0/b/su-pizza-mx.appspot.com/o/formas-de-pago%2Fempleado_pizza2.svg?alt=media&token=4223ab8d-bf7f-464c-adbf-b795f2a246d0"
                    ></v-img>
                  </v-avatar>
                </v-col>
                <v-col cols="7">
                  <span class="font-weight-medium white--text">Cortesía empleado</span>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card class="pa-5 indigo" @click="pagar('Cortesia')">
              <v-row class="d-flex justify-center align-center">
                <v-col cols="5">
                  <v-avatar tile size="80">
                    <v-img
                      src="https://firebasestorage.googleapis.com/v0/b/su-pizza-mx.appspot.com/o/formas-de-pago%2Fcliente.svg?alt=media&token=b3daa402-795b-48e3-9ef5-a314ed376ef0"
                    ></v-img>
                  </v-avatar>
                </v-col>
                <v-col cols="7">
                  <span class="font-weight-medium white--text">Cortesía cliente</span>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <!-- CARGA -->
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <employee
      :showEmployee="showEmployee"
      :data="employees"
      @autorizado="autorizado"
      @cancel="showEmployee = false"
    />

    <aut
      :showAutorization="showAutorization"
      :employee="employee"
      @cancel="showAutorization = false"
      @autorizado="autorizado"
    />
  </v-dialog>
</template>

<script>
import Employee from "../../services/Employee";

export default {
  name: "WayToPayComponent",
  components: {
    employee: () => import("./Employee"),
    aut: () => import("./Autorization"),
  },
  props: {
    showToPay: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    showAutorization: false,
    employee: "",
    showEmployee: false,
    overlay: false,
    complements: [],
    employees: [],
  }),
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    pagar(tipo) {
      if (tipo == "Efectivo" || tipo == "Tarjeta" || tipo == "Pago pendiente") {
        this.$emit("pagar", tipo);
        return true;
      }

      if (tipo == "Cortesia") {
        this.showAutorization = true;
        return true;
      }

      this.getEmployees();
    },
    async getEmployees() {
      let token = localStorage.token;
      this.overlay = true;
      try {
        const response = await Employee.getAll(token);
        if (response.status == 200) {
          this.employees = response.data;
          this.showEmployee = true;
        }
      } catch (error) {
        console.warn(error.response);
      } finally {
        this.overlay = false;
      }
    },
    autorizado(data) {
      console.log(data);
      this.showAutorization = false;
      this.showEmployee = false;
      this.$emit("cortesia", data);
    },
  },
};
</script>

<style lang="css" scoped>
</style>