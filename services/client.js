// 房间名称
const map = {
  "console": "CONSOLE",
  "user"   : (uid) => `USER:${uid}`,
  "forum"  : (fid) => `FORUM:${fid}`,
  "thread" : (tid) => `THREAD:${tid}`,
  "post"   : (pid) => `POST:${pid}`,
};

/*
* 获取指定房间下的客户端 ID
* @param {socket.io namespace} namespace
* @param {String} roomName 房间名称
* @return {[String]}
* */
async function getRoomClientsId(namespace, roomName) {
  const socketsID = await namespace.adapter.sockets(new Set([roomName]));
  return [...socketsID];
}

/*
* 获取房间名称
* @param {String} type 类型
* @return {String}
* */
function getRoomName(type, ...params) {
  let value = map[type];
  let valueType = typeof value;
  if(valueType === "function") {
    return value.apply(null, params);
  } else {
    return value;
  }
}

/*
* 获取真实 IP
* */
function getRealIp(props) {
  let {
    proxy,
    maxIpsCount,
    remoteIp: ip,
    remotePort: port,
    xForwardedFor,
    xForwardedRemotePort
  } = props;

  if(proxy) {
    if(xForwardedFor) {
      xForwardedFor =	xForwardedFor.split(',');
    } else {
      xForwardedFor = [];
    }
    xForwardedFor.push(ip);
    xForwardedFor.reverse();
    const _ip = xForwardedFor[maxIpsCount - 1];
    ip = _ip || ip;
    if(xForwardedRemotePort) {
      xForwardedRemotePort = xForwardedRemotePort.split(',');
    } else {
      xForwardedRemotePort = [];
    }
    xForwardedRemotePort.push(port);
    xForwardedRemotePort = xForwardedRemotePort.map(p => Number(p));
    xForwardedRemotePort.reverse();
    const _port = xForwardedRemotePort[maxIpsCount - 1];
    port = _port || port;
  }
  return {
    ip: ip.replace(/^::ffff:/, ''),
    port
  };
}

/*
* 断开 socket 连接
* @param {socket}
* */
async function disconnectSocket(socket) {
  socket.disconnect(true);
}

module.exports = {
  getRoomName,
  getRoomClientsId,
  getRealIp,
  disconnectSocket
};