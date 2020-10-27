import service from './Service';

export default {
  async toAccept(token, idSale) {
    return await service.get(`pedidos/${idSale}/aceptar`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
