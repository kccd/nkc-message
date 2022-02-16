module.exports = {
  communication: {
    serverAddress: '192.168.11.250',
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
  proxy: true,
  maxIpsCount: 2,
  address: '127.0.0.1',
  port: 2170
};