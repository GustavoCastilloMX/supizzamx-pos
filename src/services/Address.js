import Service from './Service';

export default {
  async get(token, clientId) {
    return await Service.get(`direcciones/${clientId}/cliente`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  async create(token, direccion) {
    return await Service.post('direcciones', direccion, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
