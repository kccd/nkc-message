require('colors');
const http = require('http');
const socketIo = require('socket.io');
const configs = require('./configs');
const socketIoRedis = require('socket.io-redis');
const init = require('./middlewares/init');
const auth = require('./middlewares/auth');
const logger = require('./middlewares/logger');

async function run() {
  const server = http.createServer((req, res) => {
    res.write('socket.io server');
    res.end();
  });

  const io = socketIo(server, configs.socketIO.options);
  io.on('error', err => {
    console.log(err);
  });
  io.adapter(socketIoRedis({
    host: configs.redis.address,
    port: configs.redis.port
  }));
  const namespace = io.of(`/common`);
  await namespace.use(init);
  await namespace.use(auth);
  await namespace.use(logger);
  const common = require('./routes');
  await common(namespace);

  server.listen(configs.port, configs.address, () => {
    console.log(`socket.io server is running at ${configs.address}:${configs.port}`);
  });
}

run().catch(console.error);


