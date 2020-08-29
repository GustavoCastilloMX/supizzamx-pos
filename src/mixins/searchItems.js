export const searchItemsMixin = {
  data: () => ({
    search: '',
  }),
  computed: {
    searchResult() {
      return this.items.filter((item) => {
        return item.nombre.toLowerCase().includes(this.search.toLowerCase());
      });
    },
  },
};
