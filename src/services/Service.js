import axios from 'axios';

let baseURL = 'https://pizza-back.prbs.li/api/';

if (location.host == 'pos.supizza.mx') baseURL = 'https://back.supizza.mx/api';

export default axios.create({
  baseURL,
});
