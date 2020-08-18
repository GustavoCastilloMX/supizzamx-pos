import Service from './Service';

export default {
  async setSale(token, sale) {
    return await Service.post('pedidos', sale, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
