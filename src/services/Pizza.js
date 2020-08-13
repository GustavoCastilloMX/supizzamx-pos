import Service from './Service';

export default {
  async get(token, idPizza) {
    return await Service.get(`pizzas/${idPizza}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  async getAll(token) {
    return await Service.get('pizzas', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
