const {checkForumPermission} = require('../services/communication');
const {disconnectSocket, getRoomName} = require('../services/client');
module.exports = async (socket, io, res) => {
  const {uid} = socket.state;
  const {forumId} = res;
  const hasPermission = await checkForumPermission(uid, forumId);
  if(!hasPermission) {
    return disconnectSocket(socket);
  }
  const roomName = getRoomName('forum', forumId);
  socket.join(roomName);
}
