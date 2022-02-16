const moment = require("moment");

async function onDisconnectedSocket(socket) {
  const {uid, address} = socket.state;
  if(uid) {
    console.log(
      `${moment().format('YYYY/MM/DD HH:mm:ss').grey} `+
      `${(' '+ process.pid + ' ').grey} `+
      `${' SOCKET '.bgGreen} ${uid.bgCyan} `+
      `${'/common'.bgBlue} ${'断开连接'.bgRed} ${address}`
    );
  } else {
    console.log(
      `${moment().format('YYYY/MM/DD HH:mm:ss').grey} `+
      `${(' '+ process.pid + ' ').grey} `+
      `${' SOCKET '.bgGreen} visitor `+
      `${'/common'.bgBlue} ${'断开连接'.bgRed} ${address}`
    );
  }
}

async function onConnectedSocket(socket) {
  const {uid, address} = socket.state;
  if(uid) {
    console.log(
      `${moment().format('YYYY/MM/DD HH:mm:ss').grey} `+
      `${(' '+ process.pid + ' ').grey} `+
      `${' SOCKET '.bgGreen} ${uid.bgCyan} `+
      `${'/common'.bgBlue} ${'连接成功'.bgGreen} ${address}`
    );
  } else {
    console.log(
      `${moment().format('YYYY/MM/DD HH:mm:ss').grey} `+
      `${(' '+ process.pid + ' ').grey} `+
      `${' SOCKET '.bgGreen} visitor `+
      `${'/common'.bgBlue} ${'连接成功'.bgGreen} ${address}`
    );
  }
}
module.exports = {
  onConnectedSocket,
  onDisconnectedSocket
};
