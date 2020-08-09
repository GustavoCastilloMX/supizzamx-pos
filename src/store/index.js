import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    modulos: {},
  },
  mutations: {
    async setModulos(state, payload) {
      state.modulos = await payload;
    },
  },
  actions: {},
  modules: {},
});
