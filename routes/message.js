const {getRoomName, getRoomClientsId} = require("../services/client");
const {getUsersFriendsUid, setUserOnlineStatus} = require("../services/communication");
const log = require('../services/log');
module.exports = async (socket, io) => {
  const {uid, onlineStatus, friendsUid} = socket.state;
  let userRoom = uid => getRoomName("user", uid);
  // 加入房间
  socket.join(userRoom(uid));
  // 发送上线通知
  await Promise.all(friendsUid.map(friendUid => {
    io.in(userRoom(friendUid)).emit('updateUserOnlineStatus', {
      uid,
      status: onlineStatus,
    });
  }));

  socket.on('disconnect', async () => {
    // 更新用户在线状态
    const roomName = await getRoomName('user', uid);
    const clients = await getRoomClientsId(io, roomName);
    if(clients.length === 0) {
      // 设置用户状态为下线
      const onlineStatus = await setUserOnlineStatus(uid, '');
      // 发送下线通知
      const friendsUid = await getUsersFriendsUid(uid);
      await Promise.all(friendsUid.map(friendUid => {
        io.in(userRoom(friendUid)).emit('updateUserOnlineStatus', {
          uid,
          status: onlineStatus,
        });
      }));
    }
    await log.onDisconnectedSocket(socket);
  })
};
