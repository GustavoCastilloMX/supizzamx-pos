export const rulesFormMixin = {
  data: () => ({
    image: '',
    imageBlob: '',
    name: [(v) => !!v || 'Campo requerido'],
    isEmail: [
      (v) => !!v || 'Campo requerido',
      (v) => /.+@.+\..+/.test(v) || 'Ingresa un email válido',
    ],
    // isPhone: [
    //   (v) => !!v || 'Campo requerido',
    //   (v) => /^[0-9]*$/.test(v) || 'Ingresa un número válido',
    //   (v) => v.length == 10 || 'Debe contener 10 digitos',
    // ],
  }),
  methods: {
    upperCase(e, object, key) {
      if (e != undefined) {
        object[key] = e.toUpperCase();
      }
    },
    async processImage(e) {
      console.log('PROCESS IMAGE');
      console.log(image);

      let image = e.target.files[0];

      if (image == undefined) {
        this.image = '';
        return true;
      }

      if (image.size > 1000000) {
        this.$refs.boton.value = '';
        this.$swal({
          icon: 'error',
          title: `<h3 style="font-family: 'Open Sans'">Oops...</h3>`,
          html: `<span style="font-family: 'Open Sans'">La imagen es demasiado pesada, el tamaño máximo es de 1Mb</span>`,
          confirmButtonText: `<span style="font-family: 'Open Sans'">Ok!</span>`,
        });

        if (!this.image.includes('https://')) this.image = '';
        return true;
      }

      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.image = e.target.result;
      };
    },
    async convertImage(width, height, quality) {
      try {
        let response = await imageCompress(
          [this.imageBlob],
          width,
          height,
          quality
        );
        return response;
      } catch (error) {
        console.log(error);
      }
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
  },
  computed: {
    isInteger: function() {
      return [
        (v) => {
          if (v <= 0 || v == undefined) return 'Campo requerido';
          return true;
        },
        (v) => {
          if (typeof v == 'string') {
            if (v.includes('.')) {
              return 'Tiene que se número entero';
            }
          }

          v = parseInt(v);

          if (v <= 0 || v == undefined) {
            return 'Campo requerido';
          }

          if (!Number.isInteger(v))
            return 'El campo solo puede contener números enteros';
          return true;
        },
      ];
    },
    cost: function() {
      return [
        (v) => {
          if (v == undefined) return 'Campo requerido';
          return true;
        },
        (v) => {
          if (v == 0) return 'Precio debe ser mayor de 0';
          return true;
        },
      ];
    },
    img: function() {
      return [
        (value) => {
          console.log('RULES');
          console.log(value);
          return true;
        },
        (value) =>
          !value ||
          value.size <= 1000000 ||
          'La imagen no puede pesar más de 1 MB!',
        (value) => {
          if (this.image.includes('https://pizza-back.')) return true;

          if (value == undefined) return 'Campo requerido';
          return true;
        },
      ];
    },
    selects: function() {
      return [
        (v) => {
          if (v.length == 0 || v == '') return 'Campo requerido';
          return true;
        },
      ];
    },
    selectsObject: function() {
      return [
        (v) => {
          if (v == undefined) return 'Campo requerido';
          if (Object.keys(v).length === 0) return 'Campo requerido';
          return true;
        },
      ];
    },
    isPhone: function() {
      return [
        (v) => {
          if (v == undefined) return 'Campo requerido';
          if (v.length != 10) return 'Debe contener 10 digitos';
        },
        (v) => /^[0-9]*$/.test(v) || 'Ingresa un número válido',
      ];
    },
  },
};
