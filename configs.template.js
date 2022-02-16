module.exports = {
  communication: {
    serverAddress: '127.0.0.1',
    serverPort: 8976,
    clientName: 'socket',
    nkcName: 'nkc'
  },
  redis: {
    address: "127.0.0.1",
    port: 6379,
    password: "",
    db: 2
  },
  socketIO: {
    options: {
      serverClient: false,
      transports: [
        'polling',
        'websocket'
      ],
      pingInterval: 30000
    }
  },
  proxy: false,
  maxIpsCount: 1,
  address: '127.0.0.1',
  port: 2170
};