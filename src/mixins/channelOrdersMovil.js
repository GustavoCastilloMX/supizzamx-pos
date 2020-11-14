export const channelOrdersMovil = {
  methods: {
    getOrdersMovil() {
      const request = { tipo: 'SOLICITO_PEDIDOS' };
      const messageRequest = JSON.stringify(request);
      const message = new Paho.Message(messageRequest);
      message.destinationName = `suPizza/${this.enviroment}/pos/orders/movil`;
      this.mqttClient.send(message);
    },
  },
};
