import moment from 'moment';

export const formatoTabla = {
  methods: {
    getFolio(id) {
      if (id != undefined) return id.slice(-3);
    },
    getFecha(fecha) {
      let newLocale = 'es';
      let newDate = new Date(fecha);
      moment.locale(newLocale);
      return moment(newDate).format('lll');
    },
    getFechaTicket(fecha) {
      let newLocale = 'es';
      let newDate = new Date(fecha);
      moment.locale(newLocale);
      return moment(newDate).format('LLLL');
    },
    customSort(items, index, isDesc) {
      console.log(index);

      if (index[0] == 'pagado') {
        if (isDesc[0]) items = this.ordenarAscendente(items, 'pagado');
        if (!isDesc[0]) items = this.ordenarDescendente(items, 'pagado');
      }

      if (index[0] == 'total') {
        if (isDesc[0]) items = this.ordenarAscendente(items, 'total');
        if (!isDesc[0]) items = this.ordenarDescendente(items, 'total');
      }

      if (index[0] == 'forma_pago') {
        if (isDesc[0])
          items = this.ordenarAscendenteString(items, 'forma_pago');
        if (!isDesc[0])
          items = this.ordenarDescendenteString(items, 'forma_pago');
      }

      if (index[0] == 'entrega') {
        if (isDesc[0]) items = this.ordenarAscendenteString(items, 'entrega');
        if (!isDesc[0]) items = this.ordenarDescendenteString(items, 'entrega');
      }

      if (index[0] == 'status') {
        if (isDesc[0]) items = this.ordenarAscendenteString(items, 'status');
        if (!isDesc[0]) items = this.ordenarDescendenteString(items, 'status');
      }

      if (index[0] == 'fecha') {
        if (isDesc[0]) items = this.ordenarAscendenteFecha(items, 'fecha');
        if (!isDesc[0]) items = this.ordenarDescendenteFecha(items, 'fecha');
      }

      return items;
    },
    ordenarAscendenteFecha(items, key) {
      return items.sort((a, b) => {
        let c = new Date(a.fecha);
        let d = new Date(b.fecha);
        return d - c;
      });
    },
    ordenarDescendenteFecha(items, key) {
      return items.sort((a, b) => {
        let c = new Date(a.fecha);
        let d = new Date(b.fecha);
        return c - d;
      });
    },
    ordenarAscendente(items, key) {
      return items.sort((a, b) => a[key] - b[key]);
    },
    ordenarDescendente(items, key) {
      return items.sort((a, b) => b[key] - a[key]);
    },
    ordenarAscendenteString(items, key) {
      return items.sort((a, b) =>
        a[key].toLowerCase() < b[key].toLowerCase()
          ? 1
          : a[key].toLowerCase() > b[key].toLowerCase()
          ? -1
          : 0
      );
    },
    ordenarDescendenteString(items, key) {
      return items.sort((a, b) =>
        a[key].toLowerCase() > b[key].toLowerCase()
          ? 1
          : a[key].toLowerCase() < b[key].toLowerCase()
          ? -1
          : 0
      );
    },
    verDetallePedido(pedido) {
      this.pedido = Object.assign({}, pedido);
      this.showDetail = true;
    },
  },
};
