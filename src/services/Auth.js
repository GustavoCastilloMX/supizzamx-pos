import Service from './Service.js';

export default {
  async login(user) {
    return await Service.post('login_admin', user);
  },
  async getPermissions(token) {
    return await Service.get('permisos', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  async obtenerAutorizacionCortesia(token, clave) {
    return await Service.post('trabajadores_seguridad', clave, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
