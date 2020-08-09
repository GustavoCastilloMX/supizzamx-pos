import Service from './Service';

export default {
  async getAll(token) {
    return await Service.get('complementos', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
