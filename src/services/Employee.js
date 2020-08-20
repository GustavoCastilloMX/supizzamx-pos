import Service from './Service';

export default {
  async getAll(token) {
    return await Service.get('trabajadores_cortesia', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
