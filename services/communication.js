const CommunicationClient = require("../communicationClient.v1");
const configs = require("../configs");

// 发送到 nkc 服务的事件名称
const eventName = {
  setUserOnlineStatus: "messageServiceSetUserOnlineStatus",
  getUsersFriendsUid: "messageServiceGetUsersFriendsUid",
  getAuthInfo: "messageServiceGetAuthInfo",
  checkPostPermission: "messageServiceCheckPostPermission",
  checkForumPermission: "messageServiceCheckForumPermission",
}

// 连接通信服务
const communicationClient = new CommunicationClient({
  serverAddress: configs.communication.serverAddress,
  serverPort: configs.communication.serverPort,
  serviceName: configs.communication.clientName,
  serviceId: process.pid,
  servicePort: configs.port,
  serviceAddress: configs.address
});

/*
* 发送数据到 nkc 服务
* @param {String} type 事件名
* @param {Object} data 数据
* */
async function sendMessageToNKCService(type, data = {}) {
  return await communicationClient.sendMessagePromise(configs.communication.nkcName, {
    type,
    data
  });
}
/*
* 获取用户是否获得红包
*/
// async function getLottery(uid){
//     const {status, close, redEnvelopeStatus} = await sendMessageToNKCService(eventName.getLotterySettings, {
//       uid,
//     })
//     return {status, close, redEnvelopeStatus};

// }

/*
* 设置用户的在线状态
* @param {String} uid 用户ID
* @param {String} online 在线状态 "web", "app", ""
* @return {String} 在线状态的文字描述
* */
async function setUserOnlineStatus(uid, online) {
  const {onlineStatus} = await sendMessageToNKCService(eventName.setUserOnlineStatus, {
    uid,
    online
  });
  return onlineStatus;
}

/*
* 获取与用户有关的用户ID，包括好友和已创建对话的用户
* 上线下线时，告知这些用户在线状态
* @param {String} uid 用户ID
* @return {[String]}
* */
async function getUsersFriendsUid(uid) {
  const {friendsUid} = await sendMessageToNKCService(eventName.getUsersFriendsUid, {
    uid
  });
  return friendsUid;
}

/*
* 获取用户认证信息
* @param {String} cookie cookie 字符串信息
* @param {String} operationId 权限 ID
* @param {String} os 系统 "web", "app"
* @return {Object}
*   @param {String} uid 用户 ID
*   @param {String} onlineStatus 用户在线状态的文字描述
*   @param {[String]} friendsUid 与当前用户有关的用户 ID
* */
async function getAuthInfo(cookie, operationId, os) {
  const data = await sendMessageToNKCService(eventName.getAuthInfo, {
    cookie,
    operationId,
    os
  });
  if(!data) return null;
  const {
    uid,
    onlineStatus = '',
    friendsUid = [],
    newMessageCount = 0,
    redEnvelopeStatus
  } = data;
  return {
    uid,
    onlineStatus,
    friendsUid,
    newMessageCount,
    redEnvelopeStatus
  };
}

/*
* 判断用户是否有权访问指定 post
* @param {String} uid 用户 ID
* @param {String} pid post id
* @param {Boolean} 是否有权
* */
async function checkPostPermission(uid, pid) {
  const {hasPermission} = await sendMessageToNKCService(eventName.checkPostPermission, {
    uid,
    pid
  });
  return hasPermission;
}

/*
* 判断用户是否有权访问指定 forum
* @param {String} uid 用户 ID
* @param {String} fid forum id
* @param {Boolean} 是否有权
* */
async function checkForumPermission(uid, fid) {
  const {hasPermission} = await sendMessageToNKCService(eventName.checkForumPermission, {
    uid,
    fid
  });
  return hasPermission;
}

module.exports = {
  communicationClient,
  setUserOnlineStatus,
  getUsersFriendsUid,
  getAuthInfo,
  checkPostPermission,
  checkForumPermission,
};