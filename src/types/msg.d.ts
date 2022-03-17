import { IUserInfo } from './user';

interface IMsgContent {
  stringContent?: string; //文本
  imageMsg: IImageMsgInfo; //图片
  voiceMsg: IVoiceMsgInfo;
  userOperateEventDescInfo: IUserOperateEventDescInfo; //系统消息才会使用到本类型,未使用,废弃
  systemNotifyInfo: ISystemNotifyInfo; //系统通知消息,用户同一个消息不同的用户显示不同内容
  groupAtInfo: IGroupAtInfo; //群消息@功能,可以指定提醒的用户
  revokeInfo: IRevokeInfo; //消息撤回操作消息
  videoCallInfo: IVideoCallMsgInfo; //视频通话消息
  gpsMsgInfo: IGpsMsgInfo; //定位消息
  newFriendsApplyNotice: INewFriendsApplyNotice; //申请消息
  forwardMsg: IForwardMsgInfo; //消息记录转发消息
  visitingCard: IVisitingCard; //名片
  groupUserInviteInfo: IGroupUserInviteMsgInfo; //邀请用户加入群聊消息
  fileInfo: IFileInfo;
  encryptContent: string; //加密消息内容
  videoMsgInfo: IVideoMsgInfo; //视频消息
  cleanInfo: ICleanInfo; //清理消息
  linkUrlInfo: ILinkUrlInfo; //链接消息
  fireInfo: IFireInfo; //焚阅消息
}

export type TMsgContent =
  | string
  | IImageMsgInfo
  | IVoiceMsgInfo
  | IUserOperateEventDescInfo
  | ISystemNotifyInfo
  | IGroupAtInfo
  | IRevokeInfo
  | IVideoCallMsgInfo
  | IGpsMsgInfo
  | INewFriendsApplyNotice
  | IForwardMsgInfo
  | IVisitingCard
  | IGroupUserInviteMsgInfo
  | IFileInfo
  | IVideoMsgInfo
  | ICleanInfo
  | ILinkUrlInfo
  | IFireInfo;
type TMsgContent = keyof IMsgContent;

export interface IFileInfo {
  fileUrl: string; //文件下载地址
  fileName: string; //文件名
  fileSize: number; //文件大小
}

export interface IFireInfo {
  fireMsgId: number; //需要焚阅的消息id
  stringContent: string; //xxx已焚阅一条消息
}

export interface ILinkUrlInfo {
  url: string; // 链接地址
  title: string; // 链接标题
  content: string; // 链接描述
  icon: string; // 链接图标
  needParse: number; //是否需要解析 0--不需要 1--需要
}

export interface ICleanInfo {
  maxMsgId: number; //需要删除的消息maxid
  stringContent: string; //文本消息内容
}

export interface IVideoMsgInfo {
  url: string; // 视频文件地址
  name: string; // 视频文件名称
  imageUrl: string; // 视频首帧图片(缩略图)
  duration: number; // 视频时长ms
  format: string; // 视频格式，比如mp4
  weight: number; // 视频宽度
  height: number; // 视频高度
  size: number; // 视频文件大小
  extra: string; // 扩展信息
}

export interface IGroupUserInviteMsgInfo {
  inviteTitle: string; //邀请标题
  inviteDesc: string; //邀请描述
  inviteGroupId: number; //群ID
  inviteGroupIconUrl: string; //群图片
}

export interface IVisitingCard {
  type: number; //0--个人名片，1--群名片
  uid: number; //用户uid
  icon: string; //头像
  name: string; //名字
  showContent: string; //展示内容（个人名片/群名片）
  sourceName: string; //来源名称
  sourceId: number; //来源id
  sourceTime: number; //分享时间 用于验证过期时间
  showContent: string;
}

export interface IForwardMsgInfo {
  forwardMsgTitle: string; //转发消息标题
  forwardMsgInfos: IMsgInfo[]; //转发的消息内容
}

export interface INewFriendsApplyNotice {
  uid: number;
  nickName: string;
  icon: string;
  applyState: number; //申请状态，1--待处理，2--已同意，3--已拒绝，4--已过期
  applyDesc: string; //验证信息
  applyType: number; //1--好友申请，2--群申请
  applyId: number;
  endTime: number; //结束时间
  updateTime: number; //更新时间
  adminUids: number[]; //有权限处理该请求的用户列表（申请时有效的群主和管理员）
}

export interface IGpsMsgInfo {
  longitude: string; //经度
  latitude: string; //纬度
  positionName: string; //地址名字
  positionDetail: string; //地址详情
  mapUrl: string; //图片url
}

export interface IVideoCallMsgInfo {
  videoType: number; //1--语音，2--视频
  sendShowMsg: IAppointUserTextInfo[]; //
  needShowTime: number; //0--显示，1--不显示
  callTime: number; //呼叫时长，单位秒
}

interface IAppointUserTextInfo {
  userIds: number[]; //指定的用户uid集合
  msgText: string; //指定用户需要显示的消息内容
}

export interface IRevokeInfo {
  revokeMsgId: number; //需要撤回的消息id
  stringContent: string; //文本消息内容
}

export interface IGroupAtInfo {
  atUsers: IAtInfo[]; //指定的提醒人uid
  stringContent: string; //文本消息内容
}

interface IAtInfo {
  uid: number;
  type: number; // 0--uid ,1--all
}

export interface IImageMsgInfo {
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
}

export interface IVoiceMsgInfo {
  voiceUrl: string;
  voiceTime: number;
}

export interface IUserOperateEventDescInfo {
  operateType: number; //1--请求添加好友,2--同意添加好友，3--拒绝添加好友，4--删除好友
  operateUserId: number; //操作者信息
  beOperatedUserId: number; //被操作者信息
  operateDesc: string; //操作描述
  operateReason: string; //操作备注信息，可以是添加理由，拒绝理由等
}

export interface ISystemNotifyInfo {
  appointUserSystemNotifyInfos: IAppointUserSystemNotifyInfop[]; //可以有多个不同类型的指定用户群分别显示不同的消息
  otherUserNotifyInfo: IReplaceMsgInfo; //不在指定用户群的用户需要显示的消息
  drawableDirection: number; //0--无，1--top。2--left，3-- bottom，4--Right
  drawableUrl: string;
}

interface IAppointUserSystemNotifyInfo {
  userIds: number[]; //指定的用户uid集合
  appointUserNotifyInfo: IReplaceMsgInfo; //指定用户需要显示的消息内容
}

interface IReplaceMsgInfo {
  spileText: string; //占位标识字符串,例如“[spile]”,当本字段为空时直接显示消息内容即可
  msgText: string; //带占位标识的消息内容
  replaceMsgItems: IReplaceMsgItem[]; //依次填入的消息描述结构体
}

interface IReplaceMsgItem {
  showContent: string; //用来显示的字符
  jumpUrl: string; //跳转的链接
  showContentColor: string; //文字颜色
}

export interface IMsgInfo<T> {
  msgId: number;
  isGroupMsg: number; //0--普通单个用户消息(默认),1--群消息
  fromId: number; //发送者
  toId: number; //接收者
  msgTime: number;
  msgShowType: number; //0--无效，1--普通消息，2--系统通知消息,3--阅后即焚消息，4--需要客户端进行逻辑操作的消息，5--客服消息,  6--机器人客服消息
  clientMsgUuid: string; //客户端生成的消息uuid,用于客户端本地数据库消息去重,如果该字段为空则需要客户端自己生成，客户端发送的消息必须带这个字段
  isEncrypt: number; //是否是加密消息 0--不是 1--是
  type: string;
  attachInfo: {
    msgSource: string;
  }; //消息附加的信息,由客户端自定义解析
  msgContent: Record<keyof IMsgContent, T> & {
    msgContentType: number;
    msgContent: string;
  };
  isRoamMsg: boolean;
}

// 缓存消息列表的 interface
export interface ImsgItem {
  id: number;
  isBotUser: boolean;
  isGroup: boolean;
  readList: IMsgInfo[];
  unReadNum: number;
  userDetailInfo: IUserDetailInfo;
  lastMsg: IMsgInfo;
  groupDetailInfo: IGroupInfo;
  isDel: boolean;
  unRead: boolean;
}

export interface INotifyClassMsgListInfo {
  msgClassHaveNewMsg: number;
  msgClassIcon: string;
  msgClassId: number;
  msgClassRecentMsgContent: string;
  msgClassTitle: string;
  updateTime: number;
}
