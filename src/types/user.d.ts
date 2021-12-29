// Aoelailiao.Login.ClientGetUserInfoListReq
export interface IUserInfo {
  uid: number;
  nickname: string;
  icon: string;
  userAttachInfo: {
    remarkName: string; //备注名称
    destoryReaded: number; //阅后即焚开关,0--关闭(默认),1--开
    msgTop: number; //消息置顶开关,0--关闭(默认),1--开
    msgMute: number; //消息免打扰开关,0--关闭(默认),1--开
    msgScreenShotNotify: number;
  }; //附加信息
  onlineState: number;
  imAccount: string;
  lastOnlineTime: number; //上次在线时间
  isBotUser: number; //是否为机器人,默认为0表示真实用户，1表示为机器人，机器人用户不会收到消息推送
}

export interface IUserDetailInfo {
  userInfo: IUserInfo;
  isFriend: number;
  friendQueryType: number;
  phone: string;
  qrCode: string;
  isRealnameAuth: number;
  isInMyBlacklist: number;
  isSetPassword: number;
  userSex: number;
  cityCode: string;
  userSign: string;
  findMeGroup: number;
  source: string;
  sourceId: number;
  sourceType: number;
}

export interface IContacts {
  active: boolean;
  name: string;
  nickname: string;
  tag: string;
  icon: string;
  uid: number;
  userAttachInfo: {
    remarkName: string; //备注名称
    destoryReaded: number; //阅后即焚开关,0--关闭(默认),1--开
    msgTop: number; //消息置顶开关,0--关闭(默认),1--开
    msgMute: number; //消息免打扰开关,0--关闭(默认),1--开
    msgScreenShotNotify: number;
  }; //附加信息
}

//
interface IGroupMemberUserInfo {
  memberUid: number; //群成员uid
  joinType: number; //入群方式,1--邀请入群
  inviteUid: number; //入群邀请人
  remarkName: string; //我在群里面的备注名称
}

// 群附加信息
export interface IGroupAttachInfo {
  groupTop: number; //群置顶,0--否(默认)，1--是
  groupMsgMute: number; //群消息免打扰(免推送),0--否(默认)，1--是
  groupSaveInGrouplist: number; //保存到通信录,0--否(默认)，1--是
  groupDestoryReaded: number; //阅后即焚,0--否(默认)，1--是
  groupScreenShotNotify: number; //截屏通知,0--否(默认)，1--是
  groupJoinAuthType: number; //加群需要认证,0--否(默认)，1--是
  groupMemberSplit: number; //群员隔离
  groupMsgGag: number; //全员禁言
  groupUnableEditNickname: number; //禁止修改昵称
  groupRemarkName: string; //用户对群的备注名称
  groupMsgClean: number; //群小时定时清理,0--否(默认)，1--是
  allowMemberGetHisotyMsg: number; //允许群成员获取聊天历史记录,0--否(默认)，1--是
  allowEveryoneJoin: number; //允许任何人加群,0--否，1--是(默认)
  allowMemberInviteJoin: number; //允许群成员邀请其他用户入群,0--否，1--是(默认)
  groupInviteState: number; //群邀请权限,0--所有人，1--仅限邀请 2--不允许任何人加群
}
// 群信息接口 ClientGetGroupInfoReq
export interface IGroupInfo {
  groupId: number;
  groupName: string;
  groupIcon: string;
  groupMemberLists: {
    rootUid: number; //群主
    adminUidList: number[]; //管理员
    memberUserInfos: IGroupMemberUserInfo[];
    botUidList: number[]; //机器人用户列表,只保存了机器人的uid
  }; //群成员列表
  groupAttachInfo: IGroupAttachInfo; //群附加信息
  qrCode: string; //二维码url
  groupNoticeInfo: {
    groupNoticeContent: string; //公告内容
    updateTime: number; //修改时间
    editorUid: number; //编辑群公告用户的uid
    noticeId: number; //公告id
  }; //群公告信息
  groupState: number; //群状态，1--正常，其他--群已失效
  isEncrypt: number; //是否是加密会话 0--不是(默认） 1--是
}
