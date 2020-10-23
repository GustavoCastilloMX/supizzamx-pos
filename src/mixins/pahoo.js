export const pahooMixin = {
  data: () => ({
    enviroment: '',
    mqttClient: '',
  }),
  methods: {
    connectMQTT() {
      const hostname = 'mqtt.li';
      const port = 8888;
      const min = 1;
      const max = 999;
      const id = Math.random() * (max - min) + min;
      const clientId = `SUPIZZA-POS-${id}`;
      const host = location.host;

      this.enviroment = host == 'pos.endomorelia.app' ? 'prod' : 'test';

      this.mqttClient = new Paho.Client(hostname, port, clientId);
      this.mqttClient.onMessageArrived = this.messageArrived;
      this.mqttClient.onConnectionLost = this.connectionLost;

      this.connect();
    },
    connect() {
      let username = 'SUPIZZA-POS';

      this.mqttClient.connect({
        onSuccess: this.connected,
        onFailure: this.connectionFailed,
        keepAliveInterval: 10,
        userName: username,
        useSSL: true,
        // password: password,
      });
    },
    connected() {
      this.mqttClient.subscribe(`suPizza/${this.enviroment}/pos/orders/movil`);
      this.mqttClient.subscribe(`pruebas`);
      console.log('CONECTADO');
      this.getOrdersMovil();
    },
    connectionFailed(res) {
      console.warn('Connect failed:' + res.errorMessage);
      this.connect();
    },
    messageArrived(message) {
      console.log(message);
      let topic = message.topic;
      const ordersMovil = `suPizza/${this.enviroment}/pos/orders/movil`;
    },
    connectionLost(res) {
      console.warn('Connection lost:' + res.errorMessage);
    },
  },
};
