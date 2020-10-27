import Service from './Service';

export default {
  async setSale(token, sale) {
    return await Service.post('pedidos', sale, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getSales(token) {
    return await Service.get('pedidos_cajero', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
