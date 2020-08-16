import Service from './Service';

export default {
  async getAll(token) {
    return await Service.get('bebidas', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  async getByPrice(token, price) {
    return await Service.get(`bebidas/${price}/precio`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
