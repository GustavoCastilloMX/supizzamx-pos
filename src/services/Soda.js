import Service from './Service';

export default {
  async getAll(token) {
    return await Service.get('bebidas', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
