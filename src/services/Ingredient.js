import Service from './Service';

export default {
  async getAll(token) {
    return await Service.get('ingredientes', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
