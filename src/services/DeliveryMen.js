import Service from './Service';

export default {
  async getAll(token) {
    return await Service.get('repartidores_disponibles', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
