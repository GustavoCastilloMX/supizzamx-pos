import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import es from 'vuetify/es5/locale/es';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        rojoSupizza: '#018143',
        primary: '#4CAF50',
        secondary: '#FF8800',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        red2: '#CF030F',
        success: '#4CAF50',
        warning: '#FFC107',
      },
    },
  },
  lang: {
    locales: { es },
    current: 'es',
  },
});
