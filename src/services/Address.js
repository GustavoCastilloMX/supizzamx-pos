import Service from './Service';

export default {
  async get(token, clientId) {
    return await Service.get(`direcciones/${clientId}/cliente`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
