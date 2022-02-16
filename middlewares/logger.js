const {onConnectedSocket} = require('../services/log');
module.exports = async (socket, next) => {
  await onConnectedSocket(socket);
  await next();
};
