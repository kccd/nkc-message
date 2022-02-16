const {checkPostPermission} = require('../services/communication');
const {disconnectSocket, getRoomName} = require("../services/client");
module.exports = async (socket, io, res) => {
  // 文章页评论推送
  // 权限判断
  const {uid} = socket.state;
  const {postId} = res;
  const hasPermission = await checkPostPermission(uid, postId)
  if(!hasPermission) {
    return disconnectSocket(socket);
  }
  const roomName = getRoomName('post', postId);
  socket.join(roomName);
}
