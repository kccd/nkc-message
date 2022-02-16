const {getRealIp} = require('../services/client');
const configs = require('../configs');
const func = async (socket, next) => {
  const {ip} = getRealIp({
    proxy: configs.proxy,
    maxIpsCount: configs.maxIpsCount,
    remoteIp: socket.handshake.address,
    xForwardedFor: socket.handshake.headers['x-forwarded-for'],
  });
  socket.state = {
    address: ip,
    os: socket.handshake.query.os === 'app'? 'app': 'web',
  };
  await next();
};
module.exports = func;
