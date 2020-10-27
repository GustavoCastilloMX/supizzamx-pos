import store from '../store/index';

export default class Socket {
  #hostname;
  #port;
  #min;
  #max;
  #id;
  #clientId;
  #host;
  #enviroment;
  #mqttClient;
  #isFirst;

  constructor() {
    if (this.instance != undefined) return this.instance;
    this.#hostname = 'mqtt.li';
    this.#port = 8888;
    this.#min = 1;
    this.#max = 999;
    this.#id = parseInt(Math.random() * (this.#max - this.#min) + this.#min);
    this.#clientId = `SUPIZZA-POS-${this.id}`;
    this.#host = location.host;
    this.#isFirst = true;

    this.#enviroment = this.host == 'pos.endomorelia.app' ? 'prod' : 'test';

    this.#mqttClient = new Paho.Client(
      this.#hostname,
      this.#port,
      this.#clientId
    );

    this.#mqttClient.onMessageArrived = (message) =>
      this.messageArrived(message);
    this.#mqttClient.onConnectionLost = (err) => this.connectionLost(err);

    this.instance = this;
    return this;

    // connect();
  }

  connect() {
    let username = 'SUPIZZA-POS';

    this.#mqttClient.connect({
      onSuccess: () => this.connected(),
      onFailure: (res) => this.connectionLost(res),
      keepAliveInterval: 10,
      userName: username,
      useSSL: true,
      // password: password,
    });
  }

  connected() {
    this.#mqttClient.subscribe(`suPizza/${this.#enviroment}/pos/orders/movil`);
    this.#mqttClient.subscribe(`pruebas`);
    console.log('CONECTADO');
    getOrdersMovil(this.#mqttClient, this.#enviroment);
  }

  messageArrived(message) {
    let topic = message.topic;
    const ordersMovil = `suPizza/${this.#enviroment}/pos/orders/movil`;

    if (topic == ordersMovil) managerOrdersMovil(message);
  }

  connectionLost(res) {
    console.warn('Connection lost:' + res.errorMessage);
    console.warn(res);
    // this.connect();
  }

  connectionFailed(res) {
    console.warn('Connect failed:' + res.errorMessage);
    this.connect();
  }

  setIsFirst(value) {
    this.#isFirst = value;
  }

  getIsFirst() {
    return this.#isFirst;
  }
}

function getOrdersMovil(mqttClient, enviroment) {
  const request = { tipo: 'SOLICITO_PEDIDOS' };
  const messageRequest = JSON.stringify(request);
  const message = new Paho.Message(messageRequest);
  message.destinationName = `suPizza/${enviroment}/pos/orders/movil`;
  mqttClient.send(message);
}

function managerOrdersMovil({ payloadString }) {
  const socket = new Socket();
  let isFirst = socket.getIsFirst();
  const { tipo } = JSON.parse(payloadString);

  if (tipo === 'PEDIDOS_APP' && isFirst) {
    pedidosAppManager(JSON.parse(payloadString));
    socket.setIsFirst(false);
  }

  if (tipo === 'ELIMINAR_PEDIDO') {
    eliminarPedidoManager(JSON.parse(payloadString));
  }

  if (tipo === 'CREA_PEDIDO') {
    crearPedidoManager(JSON.parse(payloadString));
  }
}

function pedidosAppManager({ pedidos }) {
  pedidos.forEach((e) => {
    store.state.pedidosApp.push(e);
  });
}

function eliminarPedidoManager({ pedido }) {
  const index = store.state.pedidosApp.findIndex((e) => e._id == pedido);

  if (index == -1) return;

  store.state.pedidosApp.splice(index, 1);
}

function crearPedidoManager({ pedido }) {
  store.state.pedidosApp.push(pedido);
}
