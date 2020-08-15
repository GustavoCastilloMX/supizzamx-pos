import Service from './Service';

export default {
  async get(token, day) {
    return await Service.get(`promos/${day}/days`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
