const {disconnectSocket} = require('../services/client');
const {getAuthInfo} = require("../services/communication");
const func = async (socket, next) => {
  const {handshake, state} = socket;
  const {operationId, secret} = handshake.query;
  const cookie = handshake.headers.cookie || secret;
  const {os} = state;
  // 从 nkc 服务获取认证信息
  const authInfo = await getAuthInfo(cookie, operationId, os);
  if(!authInfo) {
    return await disconnectSocket(socket);
  }
  const {uid, onlineStatus, friendsUid} = authInfo;
  state.uid = uid;
  state.friendsUid = friendsUid;
  state.onlineStatus = onlineStatus;
  await next();
};
module.exports = func;
