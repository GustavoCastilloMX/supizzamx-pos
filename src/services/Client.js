import Service from './Service';

export default {
  async getAll(token) {
    return await Service.get('clientes', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  async create(token, cliente) {
    return await Service.post('clientes', cliente, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  async delete(token, idCliente) {
    return await Service.delete(`clientes/${idCliente}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  async edit(token, idCliente, cliente) {
    return await Service.put(`clientes/${idCliente}`, cliente, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
