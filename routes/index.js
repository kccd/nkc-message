// 缺少定时更新用户在线状态信息

const message = require('./message');
const {disconnectSocket, getRoomName, getRoomClientsId} = require('../services/client');
const {communicationClient} = require('../services/communication');

module.exports = async (io) => {

  communicationClient.onMessage((req) => {
    const {from, content} = req;
    const {roomName, data, eventName} = content;
    let rooms = [];
    if(typeof roomName === 'string') {
      rooms.push(roomName)
    } else {
      for(const r of roomName) {
        rooms.push(r);
      }
    }
    let _io = io;
    for(const r of rooms) {
      _io = _io.to(r);
    }
    _io.emit(eventName, data);
  });

  io.on('connection', async socket => {
    socket.on('error', async err => {
      console.error(err);
      await disconnectSocket(socket);
    });
    socket.on('disconnect', async ()=> {
      await disconnectSocket(socket);
    });

    const {uid} = socket.state;

    if(!uid) {
      return await disconnectSocket(socket);
    }

    // socket连接数量限制
    const roomName = await getRoomName('user', uid);
    const clients = await getRoomClientsId(io, roomName);
    const maxCount = 10;
    for(let i = 0; i < (clients.length - maxCount + 1); i++) {
      try{
        await io.adapter.remoteDisconnect(clients[i], true);
      } catch(err) {
        console.log(err.message);
      }
    }

    await message(socket, io);

    socket.on('joinRoom', async res => {
      const {type, data} = res;
      if(type === 'forum') {
        await require('./forum')(socket, io, data);
      } else if(type === 'post') {
        await require('./post')(socket, io, data);
      }
    });
  });
};
